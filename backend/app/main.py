import os
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .database import engine, get_db
from . import models, schemas, auth, rules

# Initialize Database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Yanapiri Wawa API",
    description="API para el seguimiento domiciliario infantil y priorización de atenciones",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(","), # Seguridad Estricta: Solo permitir el frontend oficial
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROOT HEALTH CHECK ENDPOINT ---

@app.get("/", tags=["Health"])
def root():
    """
    Endpoint raíz de la API. Confirma que el servidor está activo.
    Para la documentación interactiva Swagger, visita /docs
    """
    return {
        "status": "✅ Yanapiri Wawa API en línea",
        "version": "1.0.0",
        "descripcion": "API de seguimiento domiciliario infantil y priorización de atenciones",
        "documentacion_interactiva": "http://127.0.0.1:8000/docs",
        "endpoints_principales": {
            "login": "POST /auth/login",
            "registro": "POST /auth/register",
            "niños": "GET /children",
            "mediciones": "POST /children/{id}/measurements",
            "dashboard": "GET /dashboard/prioritized",
            "auditoria": "GET /audit"
        }
    }

@app.get("/health", tags=["Health"])
def health_check():
    """Comprobación rápida de salud del servicio."""
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# --- AUDIT HELPER ---
def log_action(
    db: Session,
    user_id: Optional[int],
    action: str,
    table: Optional[str] = None,
    record_id: Optional[int] = None,
    old_val: Optional[str] = None,
    new_val: Optional[str] = None
):
    audit = models.AuditLog(
        user_id=user_id,
        action=action,
        table_affected=table,
        record_id=record_id,
        old_value=old_val,
        new_value=new_val,
        ip_address="127.0.0.1",
        timestamp=datetime.utcnow()
    )
    db.add(audit)
    db.commit()

# --- AUTH ENDPOINTS ---

@app.post("/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(models.User).filter(models.User.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado.")
        
    # Create user
    pwd_hash = auth.get_password_hash(user_in.password)
    user = models.User(
        username=user_in.username,
        email_or_phone=user_in.email_or_phone,
        password_hash=pwd_hash,
        role=user_in.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create profile based on role
    if user_in.role == "CAREGIVER":
        profile = models.Caregiver(
            user_id=user.id,
            name=user_in.name,
            lastname=user_in.lastname,
            phone=user_in.phone or user_in.email_or_phone,
            address=user_in.address,
            district=user_in.district,
            community=user_in.community
        )
        db.add(profile)
        # Accept LOPD consent automatically during demo registration
        consent = models.Consent(
            caregiver_id=profile.id,
            consent_type="LOPD_PERU_29733",
            signed_date=datetime.utcnow()
        )
        db.add(consent)
        
    elif user_in.role == "COMMUNITY_AGENT":
        profile = models.CommunityAgent(
            user_id=user.id,
            name=user_in.name,
            lastname=user_in.lastname,
            district=user_in.district,
            community=user_in.community,
            phone=user_in.phone or user_in.email_or_phone
        )
        db.add(profile)
        
    elif user_in.role == "PROFESSIONAL":
        profile = models.HealthProfessional(
            user_id=user.id,
            name=user_in.name,
            lastname=user_in.lastname,
            specialty=user_in.specialty,
            establishment=user_in.establishment,
            colegiatura_code=user_in.colegiatura_code
        )
        db.add(profile)
        
    db.commit()
    log_action(db, user.id, "register_user", "users", user.id)
    return user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.status != "active":
        raise HTTPException(status_code=400, detail="Esta cuenta está inactiva.")
        
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    log_action(db, user.id, "login", "users", user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "username": user.username
    }

# --- CHILDREN ENDPOINTS ---

@app.post("/children", response_model=schemas.ChildResponse, status_code=status.HTTP_201_CREATED)
def create_child(
    child_in: schemas.ChildCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN", "PROFESSIONAL", "CAREGIVER"]))
):
    # Verify child registration
    child = models.Child(
        name=child_in.name,
        sex=child_in.sex,
        date_of_birth=child_in.date_of_birth,
        district=child_in.district,
        community=child_in.community
    )
    db.add(child)
    db.commit()
    db.refresh(child)
    
    # If the creator is a caregiver, create caregiver-child link automatically
    if current_user.role == "CAREGIVER" and current_user.caregiver:
        link = models.CaregiverChild(
            caregiver_id=current_user.caregiver.id,
            child_id=child.id,
            relationship=child_in.relationship
        )
        db.add(link)
        db.commit()
        
    log_action(db, current_user.id, "create_child", "children", child.id)
    return child

@app.get("/children", response_model=List[schemas.ChildResponse])
def list_children(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # RBAC filters
    if current_user.role == "ADMIN" or current_user.role == "PROFESSIONAL":
        return db.query(models.Child).all()
        
    elif current_user.role == "COMMUNITY_AGENT":
        agent = current_user.agent
        if not agent:
            return []
        return db.query(models.Child).join(models.AgentChild).filter(models.AgentChild.agent_id == agent.id).all()
        
    elif current_user.role == "CAREGIVER":
        caregiver = current_user.caregiver
        if not caregiver:
            return []
        return db.query(models.Child).join(models.CaregiverChild).filter(models.CaregiverChild.caregiver_id == caregiver.id).all()
        
    return []

@app.get("/children/{id}", response_model=schemas.ChildResponse)
def get_child(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    child = db.query(models.Child).filter(models.Child.id == id).first()
    if not child:
        raise HTTPException(status_code=404, detail="El niño no se encuentra registrado.")
        
    # Check permissions
    if current_user.role == "CAREGIVER":
        link = db.query(models.CaregiverChild).filter(
            models.CaregiverChild.caregiver_id == current_user.caregiver.id,
            models.CaregiverChild.child_id == id
        ).first()
        if not link:
            raise HTTPException(status_code=403, detail="No tienes autorización para ver esta ficha.")
            
    elif current_user.role == "COMMUNITY_AGENT":
        link = db.query(models.AgentChild).filter(
            models.AgentChild.agent_id == current_user.agent.id,
            models.AgentChild.child_id == id
        ).first()
        if not link:
            raise HTTPException(status_code=403, detail="No tienes asignado este niño para seguimiento.")
            
    return child

# --- MEASUREMENTS ENDPOINTS ---

@app.post("/children/{child_id}/measurements", response_model=schemas.MeasurementResponse)
def add_measurement(
    child_id: int,
    measure_in: schemas.MeasurementCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    child = db.query(models.Child).filter(models.Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=404, detail="El niño no se encuentra registrado.")
        
    # Check write permissions
    if current_user.role == "CAREGIVER":
        link = db.query(models.CaregiverChild).filter(
            models.CaregiverChild.caregiver_id == current_user.caregiver.id,
            models.CaregiverChild.child_id == child_id
        ).first()
        if not link:
            raise HTTPException(status_code=403, detail="Permiso denegado para registrar mediciones.")
            
    # Calculate age in months
    delta = datetime.utcnow() - child.date_of_birth
    age_months = int(delta.days / 30.4375)
    
    # Store measurement
    measurement = models.Measurement(
        child_id=child_id,
        registered_by=current_user.id,
        type=measure_in.type,
        value=measure_in.value,
        unit=measure_in.unit,
        method=measure_in.method,
        measurement_date=datetime.utcnow(),
        sync_status="synced"
    )
    db.add(measurement)
    db.commit()
    db.refresh(measurement)
    
    # Data Validation check (sudden change from last value)
    last_measure = db.query(models.Measurement).filter(
        models.Measurement.child_id == child_id,
        models.Measurement.type == measure_in.type,
        models.Measurement.id != measurement.id
    ).order_split = models.Measurement.measurement_date.desc()
    
    last_measure = db.query(models.Measurement).filter(
        models.Measurement.child_id == child_id,
        models.Measurement.type == measure_in.type,
        models.Measurement.id != measurement.id
    ).order_by(models.Measurement.measurement_date.desc()).first()
    
    sudden_change = False
    notes = "Rango normal."
    if last_measure:
        change_pct = abs(measure_in.value - last_measure.value) / last_measure.value
        if change_pct > 0.30: # 30% variation is a sudden change trigger
            sudden_change = True
            notes = f"Variación brusca de {change_pct*100:.1f}% respecto a la última medición ({last_measure.value} {last_measure.unit})."
            
    validation = models.MeasurementValidation(
        measurement_id=measurement.id,
        is_valid=True,
        validation_notes=notes,
        sudden_change_detected=sudden_change
    )
    db.add(validation)
    
    # Apply Clinical Rules Engine
    level, desc, rule_name, rule_source = rules.evaluate_measurement(
        measure_in.type, measure_in.value, age_months, child.sex
    )
    
    # Update actual status of the child
    if level == "urgent" or (level == "follow-up" and child.status_alerta != "urgent"):
        child.status_alerta = level
    elif level == "normal" and child.status_alerta == "follow-up":
        # Check if there are other urgent/follow-up measurements before setting to normal
        child.status_alerta = "normal"
        
    if measure_in.type == "weight":
        z_score = rules.calculate_z_score(measure_in.value, age_months, child.sex)
        child.zscore_actual = z_score
        
    db.commit()
    
    # Get active rule version / rule link
    rule = db.query(models.AlertRule).filter(models.AlertRule.name == rule_name).first()
    if not rule:
        rule = models.AlertRule(name=rule_name, description=desc)
        db.add(rule)
        db.commit()
        
    rule_ver = db.query(models.RuleVersion).filter(models.RuleVersion.rule_id == rule.id).first()
    if not rule_ver:
        rule_ver = models.RuleVersion(rule_id=rule.id, version="1.0", source_doc=rule_source)
        db.add(rule_ver)
        db.commit()
        
    # Generate alert if abnormal
    if level != "normal":
        alert = models.Alert(
            child_id=child_id,
            measurement_id=measurement.id,
            rule_version_id=rule_ver.id,
            level=level,
            created_at=datetime.utcnow(),
            status_revision="pending",
            comments=desc
        )
        db.add(alert)
        db.commit()
        
        # Dispatch WhatsApp Mock Notification
        mock_msg = f"Yanapiri Wawa: Hay una actualización importante sobre el seguimiento de {child.name}. Ingrese al aplicativo para revisarla."
        notification = models.Notification(
            user_id=current_user.id,
            send_type="whatsapp",
            message=mock_msg,
            status="sent"
        )
        db.add(notification)
        db.commit()
        
    log_action(db, current_user.id, f"register_measurement_{measure_in.type}", "measurements", measurement.id)
    return measurement

@app.get("/children/{child_id}/measurements", response_model=List[schemas.MeasurementResponse])
def get_measurements(
    child_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Verify access
    if current_user.role == "CAREGIVER":
        link = db.query(models.CaregiverChild).filter(
            models.CaregiverChild.caregiver_id == current_user.caregiver.id,
            models.CaregiverChild.child_id == child_id
        ).first()
        if not link:
            raise HTTPException(status_code=403, detail="Acceso no autorizado.")
            
    return db.query(models.Measurement).filter(
        models.Measurement.child_id == child_id
    ).order_by(models.Measurement.measurement_date.asc()).all()

# --- ALERTS ENDPOINTS ---

@app.get("/children/{child_id}/alerts", response_model=List[schemas.AlertResponse])
def get_alerts(
    child_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Verify access
    if current_user.role == "CAREGIVER":
        link = db.query(models.CaregiverChild).filter(
            models.CaregiverChild.caregiver_id == current_user.caregiver.id,
            models.CaregiverChild.child_id == child_id
        ).first()
        if not link:
            raise HTTPException(status_code=403, detail="Acceso no autorizado.")
            
    alerts = db.query(models.Alert).filter(models.Alert.child_id == child_id).all()
    
    # Format and enrich responses
    enriched_alerts = []
    for a in alerts:
        rule_name = None
        rule_source = None
        if a.rule_version:
            rule_name = a.rule_version.rule.name
            rule_source = a.rule_version.source_doc
            
        enriched_alerts.append(
            schemas.AlertResponse(
                id=a.id,
                child_id=a.child_id,
                measurement_id=a.measurement_id,
                level=a.level,
                created_at=a.created_at,
                status_revision=a.status_revision,
                comments=a.comments,
                rule_name=rule_name,
                rule_source=rule_source
            )
        )
    return enriched_alerts

# --- PROFESSIONAL DASHBOARD ENDPOINTS ---

@app.get("/dashboard/summary", response_model=schemas.DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN", "PROFESSIONAL"]))
):
    total = db.query(models.Child).count()
    normal = db.query(models.Child).filter(models.Child.status_alerta == "normal").count()
    follow = db.query(models.Child).filter(models.Child.status_alerta == "follow-up").count()
    urgent = db.query(models.Child).filter(models.Child.status_alerta == "urgent").count()
    
    return schemas.DashboardSummary(
        total_children=total,
        normal_count=normal,
        follow_up_count=follow,
        urgent_count=urgent
    )

@app.get("/dashboard/prioritized", response_model=List[schemas.DashboardPriorityChild])
def get_dashboard_prioritized(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN", "PROFESSIONAL"]))
):
    children = db.query(models.Child).all()
    prioritized = []
    
    # Format age helper
    def get_age_str(dob: datetime):
        d = datetime.utcnow() - dob
        yrs = int(d.days / 365)
        mths = int((d.days % 365) / 30.4)
        if yrs > 0:
            return f"{yrs}a {mths}m"
        return f"{mths}m"
        
    for c in children:
        # Get weight
        w_measure = db.query(models.Measurement).filter(
            models.Measurement.child_id == c.id,
            models.Measurement.type == "weight"
        ).order_by(models.Measurement.measurement_date.desc()).first()
        weight = w_measure.value if w_measure else 0.0
        last_measured = w_measure.measurement_date.strftime("%d/%m/%Y") if w_measure else "Sin registro"
        
        # Get height
        h_measure = db.query(models.Measurement).filter(
            models.Measurement.child_id == c.id,
            models.Measurement.type == "height"
        ).order_by(models.Measurement.measurement_date.desc()).first()
        height = h_measure.value if h_measure else 0.0
        
        # Get muac
        m_measure = db.query(models.Measurement).filter(
            models.Measurement.child_id == c.id,
            models.Measurement.type == "muac"
        ).order_by(models.Measurement.measurement_date.desc()).first()
        muac = m_measure.value if m_measure else None
        
        # Get caregiver name
        cg_link = db.query(models.CaregiverChild).filter(models.CaregiverChild.child_id == c.id).first()
        caregiver_name = f"{cg_link.caregiver.name} {cg_link.caregiver.lastname}" if cg_link else "Desconocido"
        
        # Next action suggested
        next_act = "Control regular"
        if c.status_alerta == "urgent":
            next_act = "Evaluación médica prioritaria"
        elif c.status_alerta == "follow-up":
            next_act = "Visita comunitaria"
            
        prioritized.append(
            schemas.DashboardPriorityChild(
                id=c.id,
                name=c.name,
                age=get_age_str(c.date_of_birth),
                last_measured=last_measured,
                weight=weight,
                height=height,
                muac=muac,
                z_score=c.zscore_actual,
                status=c.status_alerta,
                next_action=next_act,
                district=c.district,
                community=c.community,
                caregiver=caregiver_name
            )
        )
        
    # Sort prioritized list: urgent first, then follow-up, then normal
    order = {"urgent": 0, "follow-up": 1, "normal": 2}
    prioritized.sort(key=lambda x: order.get(x.status, 2))
    return prioritized

# --- AGENT VISITS & OBSERVATIONS ---

@app.post("/visits", response_model=schemas.VisitResponse)
def record_visit(
    visit_in: schemas.VisitCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN", "COMMUNITY_AGENT"]))
):
    agent = current_user.agent
    if not agent:
        raise HTTPException(status_code=400, detail="Este usuario no cuenta con un perfil de Actor Social.")
        
    # Record visit
    visit = models.Visit(
        child_id=visit_in.child_id,
        agent_id=agent.id,
        visit_date=datetime.utcnow(),
        visit_type=visit_in.visit_type
    )
    db.add(visit)
    db.commit()
    db.refresh(visit)
    
    # Record observation
    obs = models.Observation(
        visit_id=visit.id,
        qualitative_notes=visit_in.observations.qualitative_notes,
        alarm_signs=visit_in.observations.alarm_signs
    )
    db.add(obs)
    db.commit()
    
    log_action(db, current_user.id, "record_visit", "visits", visit.id)
    
    return schemas.VisitResponse(
        id=visit.id,
        child_id=visit.child_id,
        agent_id=visit.agent_id,
        visit_date=visit.visit_date,
        visit_type=visit.visit_type,
        observations=[schemas.ObservationResponse(
            id=obs.id,
            qualitative_notes=obs.qualitative_notes,
            alarm_signs=obs.alarm_signs
        )]
    )

# --- RULES & SOURCES ---

@app.get("/rules")
def list_rules(db: Session = Depends(get_db)):
    rules_list = db.query(models.AlertRule).all()
    result = []
    for r in rules_list:
        v_list = []
        for v in r.versions:
            v_list.append({"version": v.version, "activation_date": v.activation_date, "source_doc": v.source_doc})
        result.append({
            "id": r.id,
            "name": r.name,
            "description": r.description,
            "versions": v_list
        })
    return result

# --- AI CHATBOT HYBRID ENDPOINT ---

from pydantic import BaseModel
class ChatRequest(BaseModel):
    message: str
    language: str = "es"

@app.post("/api/chat", tags=["AI"])
def chat_with_ai(request: ChatRequest, current_user: models.User = Depends(auth.get_current_user)):
    """
    Hybrid LLM Chatbot endpoint. Connects to OpenAI if key is present.
    If no key or connection fails, it returns 503 so frontend can fallback to local NLU.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="AI Service offline (No API Key). Fallback to local NLU.")
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        system_prompt = "Eres Yanapiri Wawa, un experto en nutrición infantil y pediatría comunitaria de Perú. Responde de forma empática, breve y precisa. Usa lenguaje claro para padres."
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            max_tokens=250,
            temperature=0.5
        )
        
        reply = response.choices[0].message.content
        return {"reply": reply, "source": "IA (GPT)"}
    except Exception as e:
        print(f"LLM Error: {e}")
        raise HTTPException(status_code=503, detail="AI Service offline. Fallback to local NLU.")

# --- AUDIT ENDPOINT ---

@app.get("/audit", response_model=List[schemas.AuditLogResponse])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN", "PROFESSIONAL"]))
):
    return db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).limit(100).all()

# --- ADMIN ENDPOINTS ---

@app.get("/admin/users", response_model=List[schemas.UserResponse], tags=["Admin"])
def list_all_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN"]))
):
    """List all users in the system. ADMIN only."""
    return db.query(models.User).order_by(models.User.created_at.desc()).all()

@app.patch("/admin/users/{user_id}/status", response_model=schemas.UserResponse, tags=["Admin"])
def update_user_status(
    user_id: int,
    status_in: schemas.UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN"]))
):
    """Activate or deactivate a user account. ADMIN only."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    if user.role == "ADMIN":
        raise HTTPException(status_code=400, detail="No se puede modificar el estado de un administrador.")
    
    user.status = status_in.status
    db.commit()
    db.refresh(user)
    log_action(db, current_user.id, f"set_user_status_{status_in.status}", "users", user_id)
    return user

@app.get("/admin/stats", response_model=schemas.AdminStats, tags=["Admin"])
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN"]))
):
    """System-wide statistics for the admin dashboard."""
    from datetime import timedelta
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    return schemas.AdminStats(
        total_children=db.query(models.Child).count(),
        total_users=db.query(models.User).filter(models.User.status == "active").count(),
        active_alerts=db.query(models.Alert).filter(models.Alert.status_revision == "pending").count(),
        visits_this_month=db.query(models.Visit).filter(models.Visit.visit_date >= month_start).count(),
        caregivers=db.query(models.User).filter(models.User.role == "CAREGIVER", models.User.status == "active").count(),
        professionals=db.query(models.User).filter(models.User.role == "PROFESSIONAL", models.User.status == "active").count(),
        community_agents=db.query(models.User).filter(models.User.role == "COMMUNITY_AGENT", models.User.status == "active").count(),
        normal_children=db.query(models.Child).filter(models.Child.status_alerta == "normal").count(),
        follow_up_children=db.query(models.Child).filter(models.Child.status_alerta == "follow-up").count(),
        urgent_children=db.query(models.Child).filter(models.Child.status_alerta == "urgent").count(),
    )

@app.post("/admin/assign/agent-child", tags=["Admin"])
def assign_agent_to_child(
    agent_id: int,
    child_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN"]))
):
    """Assign a child to a community agent. ADMIN only."""
    existing = db.query(models.AgentChild).filter(
        models.AgentChild.agent_id == agent_id,
        models.AgentChild.child_id == child_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Esta asignación ya existe.")
    
    link = models.AgentChild(agent_id=agent_id, child_id=child_id)
    db.add(link)
    db.commit()
    log_action(db, current_user.id, "assign_agent_child", "agent_child", child_id)
    return {"message": "Asignación creada correctamente.", "agent_id": agent_id, "child_id": child_id}

@app.post("/admin/assign/professional-child", tags=["Admin"])
def assign_professional_to_child(
    professional_id: int,
    child_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.RoleChecker(["ADMIN"]))
):
    """Assign a child to a health professional. ADMIN only."""
    existing = db.query(models.ProfessionalChild).filter(
        models.ProfessionalChild.professional_id == professional_id,
        models.ProfessionalChild.child_id == child_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Esta asignación ya existe.")
    
    link = models.ProfessionalChild(professional_id=professional_id, child_id=child_id)
    db.add(link)
    db.commit()
    log_action(db, current_user.id, "assign_professional_child", "professional_child", child_id)
    return {"message": "Asignación creada correctamente.", "professional_id": professional_id, "child_id": child_id}
