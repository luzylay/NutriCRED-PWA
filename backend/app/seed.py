import datetime
from sqlalchemy.orm import Session
from .database import engine, SessionLocal, Base
from . import models, auth

def seed_db():
    # Recreate tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding rules and sources...")
        # 1. Alert Rules and Versions
        rule1 = models.AlertRule(
            name="WHO Growth Standards Evaluation",
            description="Evaluación del peso y talla de acuerdo con estándares de la OMS"
        )
        db.add(rule1)
        db.commit()
        
        ver1 = models.RuleVersion(
            rule_id=rule1.id,
            version="1.0",
            source_doc="Estándares OMS de Crecimiento Infantil / MINSA CRED NTS 137"
        )
        db.add(ver1)
        db.commit()
        
        rule2 = models.AlertRule(
            name="UNICEF Family-MUAC protocol",
            description="Evaluación de desnutrición aguda mediante perímetro braquial (MUAC)"
        )
        db.add(rule2)
        db.commit()
        
        ver2 = models.RuleVersion(
            rule_id=rule2.id,
            version="1.1",
            source_doc="UNICEF / WHO MUAC reference card for infants 6-59 months"
        )
        db.add(ver2)
        db.commit()

        # 2. Nutrition Guidance Sources and Recommendations
        source_minsa = models.GuidanceSource(
            title="Guía de Alimentación Complementaria",
            institution="MINSA",
            publication_date=datetime.datetime(2021, 6, 15)
        )
        db.add(source_minsa)
        db.commit()
        
        # 3. Users and Profiles
        print("Seeding users and profiles...")
        # Admin
        admin_pwd = auth.get_password_hash("admin123")
        admin = models.User(username="admin", email_or_phone="admin@yanapiri.org", password_hash=admin_pwd, role="ADMIN")
        db.add(admin)
        
        # Professional
        prof_pwd = auth.get_password_hash("carlos123")
        prof_user = models.User(username="carlos", email_or_phone="carlos.mendoza@diresahvca.gob.pe", password_hash=prof_pwd, role="PROFESSIONAL")
        db.add(prof_user)
        db.commit()
        prof_profile = models.HealthProfessional(
            user_id=prof_user.id,
            name="Carlos",
            lastname="Mendoza",
            specialty="Pediatría / CRED",
            establishment="Centro de Salud Anchonga",
            colegiatura_code="CMP 48201"
        )
        db.add(prof_profile)
        
        # Community Agent
        agent_pwd = auth.get_password_hash("luisa123")
        agent_user = models.User(username="luisa", email_or_phone="966554433", password_hash=agent_pwd, role="COMMUNITY_AGENT")
        db.add(agent_user)
        db.commit()
        agent_profile = models.CommunityAgent(
            user_id=agent_user.id,
            name="Luisa",
            lastname="Huanca",
            district="Huancavelica",
            community="Anchonga",
            phone="966554433"
        )
        db.add(agent_profile)
        
        # Caregiver (María Quispe)
        caregiver_pwd = auth.get_password_hash("maria123")
        cg_user = models.User(username="maria", email_or_phone="987654321", password_hash=caregiver_pwd, role="CAREGIVER")
        db.add(cg_user)
        db.commit()
        cg_profile = models.Caregiver(
            user_id=cg_user.id,
            name="María",
            lastname="Quispe",
            phone="987654321",
            address="Jr. Libertad 124",
            district="Huancavelica",
            community="Anchonga"
        )
        db.add(cg_profile)
        consent = models.Consent(
            caregiver_id=cg_profile.id,
            consent_type="LOPD_PERU_29733",
            signed_date=datetime.datetime.utcnow()
        )
        db.add(consent)
        db.commit()

        # 4. Children and relationship bindings
        print("Seeding children...")
        c1 = models.Child(name="Pedro Inca Tuesta", sex="M", date_of_birth=datetime.datetime.utcnow() - datetime.timedelta(days=37*30.4), district="Huancavelica", community="Ccasapata", zscore_actual=-2.8, status_alerta="urgent")
        c2 = models.Child(name="Rosa Huanca Pérez", sex="F", date_of_birth=datetime.datetime.utcnow() - datetime.timedelta(days=16*30.4), district="Huancavelica", community="Lircay", zscore_actual=-2.5, status_alerta="urgent")
        c3 = models.Child(name="Juan Quispe Mamani", sex="M", date_of_birth=datetime.datetime.utcnow() - datetime.timedelta(days=27*30.4), district="Huancavelica", community="Anchonga", zscore_actual=-1.8, status_alerta="follow-up")
        c4 = models.Child(name="Diego Ccori Vargas", sex="M", date_of_birth=datetime.datetime.utcnow() - datetime.timedelta(days=33*30.4), district="Huancavelica", community="Ccasapata", zscore_actual=-1.4, status_alerta="follow-up")
        c5 = models.Child(name="Lucía Flores Rojas", sex="F", date_of_birth=datetime.datetime.utcnow() - datetime.timedelta(days=20*30.4), district="Huancavelica", community="Lircay", zscore_actual=-0.4, status_alerta="normal")
        c6 = models.Child(name="Ana Mamani Cruz", sex="F", date_of_birth=datetime.datetime.utcnow() - datetime.timedelta(days=11*30.4), district="Huancavelica", community="Anchonga", zscore_actual=0.2, status_alerta="normal")
        
        db.add_all([c1, c2, c3, c4, c5, c6])
        db.commit()
        
        # Connect Caregiver (María Quispe) to Juan Quispe Mamani
        link1 = models.CaregiverChild(caregiver_id=cg_profile.id, child_id=c3.id, relationship="Madre", consent_id=consent.id)
        db.add(link1)
        
        # Assign children to Luisa (Community Agent)
        ac1 = models.AgentChild(agent_id=agent_profile.id, child_id=c1.id)
        ac3 = models.AgentChild(agent_id=agent_profile.id, child_id=c3.id)
        ac4 = models.AgentChild(agent_id=agent_profile.id, child_id=c4.id)
        ac6 = models.AgentChild(agent_id=agent_profile.id, child_id=c6.id)
        db.add_all([ac1, ac3, ac4, ac6])
        
        # Assign children to Carlos (Professional)
        pc1 = models.ProfessionalChild(professional_id=prof_profile.id, child_id=c1.id)
        pc2 = models.ProfessionalChild(professional_id=prof_profile.id, child_id=c2.id)
        pc3 = models.ProfessionalChild(professional_id=prof_profile.id, child_id=c3.id)
        pc4 = models.ProfessionalChild(professional_id=prof_profile.id, child_id=c4.id)
        pc5 = models.ProfessionalChild(professional_id=prof_profile.id, child_id=c5.id)
        pc6 = models.ProfessionalChild(professional_id=prof_profile.id, child_id=c6.id)
        db.add_all([pc1, pc2, pc3, pc4, pc5, pc6])
        db.commit()

        # 5. Measurements
        print("Seeding measurements...")
        # Juan Quispe (child c3) weight historical curve (18m, 20m, 22m, 24m, 27m)
        m_juan = [
            models.Measurement(child_id=c3.id, registered_by=cg_user.id, type="weight", value=10.2, unit="kg", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=9*30), method="self"),
            models.Measurement(child_id=c3.id, registered_by=cg_user.id, type="weight", value=10.5, unit="kg", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=7*30), method="self"),
            models.Measurement(child_id=c3.id, registered_by=cg_user.id, type="weight", value=10.7, unit="kg", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=5*30), method="self"),
            models.Measurement(child_id=c3.id, registered_by=cg_user.id, type="weight", value=11.0, unit="kg", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=3*30), method="self"),
            models.Measurement(child_id=c3.id, registered_by=cg_user.id, type="weight", value=11.2, unit="kg", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=3), method="self"),
            models.Measurement(child_id=c3.id, registered_by=cg_user.id, type="height", value=85.5, unit="cm", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=3), method="self"),
            models.Measurement(child_id=c3.id, registered_by=cg_user.id, type="muac", value=14.2, unit="cm", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=3), method="self")
        ]
        db.add_all(m_juan)
        
        # Pedro Inca (urgent)
        m_pedro = [
            models.Measurement(child_id=c1.id, registered_by=agent_user.id, type="weight", value=11.8, unit="kg", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=12), method="agent"),
            models.Measurement(child_id=c1.id, registered_by=agent_user.id, type="height", value=88.1, unit="cm", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=12), method="agent"),
            models.Measurement(child_id=c1.id, registered_by=agent_user.id, type="muac", value=11.5, unit="cm", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=12), method="agent")
        ]
        db.add_all(m_pedro)
        
        # Rosa (urgent)
        m_rosa = [
            models.Measurement(child_id=c2.id, registered_by=cg_user.id, type="weight", value=7.8, unit="kg", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=1), method="self"),
            models.Measurement(child_id=c2.id, registered_by=cg_user.id, type="height", value=72.1, unit="cm", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=1), method="self"),
            models.Measurement(child_id=c2.id, registered_by=cg_user.id, type="muac", value=12.0, unit="cm", measurement_date=datetime.datetime.utcnow() - datetime.timedelta(days=1), method="self")
        ]
        db.add_all(m_rosa)
        db.commit()

        # Add validation entries
        for m in db.query(models.Measurement).all():
            v = models.MeasurementValidation(measurement_id=m.id, is_valid=True, validation_notes="Rango inicial.", sudden_change_detected=False)
            db.add(v)
        db.commit()

        # Seeding alerts for abnormal kids
        # Pedro Z-score = -2.8 (follow-up/urgent)
        a1 = models.Alert(child_id=c1.id, measurement_id=m_pedro[0].id, rule_version_id=ver1.id, level="urgent", created_at=datetime.datetime.utcnow() - datetime.timedelta(days=12), comments="Desviación crítica de peso-para-edad (Z-score = -2.8).")
        a1_muac = models.Alert(child_id=c1.id, measurement_id=m_pedro[2].id, rule_version_id=ver2.id, level="urgent", created_at=datetime.datetime.utcnow() - datetime.timedelta(days=12), comments="Perímetro braquial (MUAC) crítico de 11.5 cm.")
        
        # Rosa Z-score = -2.5 (urgent)
        a2 = models.Alert(child_id=c2.id, measurement_id=m_rosa[0].id, rule_version_id=ver1.id, level="urgent", created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1), comments="Desviación crítica de peso-para-edad (Z-score = -2.5).")
        
        # Juan Z-score = -1.8 (follow-up)
        a3 = models.Alert(child_id=c3.id, measurement_id=m_juan[4].id, rule_version_id=ver1.id, level="follow-up", created_at=datetime.datetime.utcnow() - datetime.timedelta(days=3), comments="Pérdida moderada de peso detectada (Z-score = -1.8).")
        
        db.add_all([a1, a1_muac, a2, a3])
        db.commit()

        # 6. Visits and observations
        print("Seeding visits...")
        v1 = models.Visit(child_id=c1.id, agent_id=agent_profile.id, visit_date=datetime.datetime.utcnow() - datetime.timedelta(days=5), visit_type="Control de Alerta")
        db.add(v1)
        db.commit()
        
        obs1 = models.Observation(visit_id=v1.id, qualitative_notes="Se coordinó con la madre. Juan se encuentra con apetito pero la madre refiere no contar con suplemento de hierro desde hace dos semanas.", alarm_signs="Ninguno")
        db.add(obs1)
        
        # 7. Seed Nutrition Guidance
        g1 = models.NutritionGuidance(
            child_id=c3.id,
            age_months=24,
            recommendation="Brindar 3 comidas principales al día más 2 refrigerios saludables. Priorizar alimentos ricos en hierro de origen animal como sangrecita, bazo o hígado de pollo.",
            source_id=source_minsa.id
        )
        db.add(g1)
        db.commit()
        
        # 8. Seed initial audit log
        log = models.AuditLog(
            user_id=admin.id,
            action="seed_database",
            table_affected="all",
            record_id=None,
            old_value=None,
            new_value="database_populated_with_hackathon_demo",
            ip_address="127.0.0.1",
            timestamp=datetime.datetime.utcnow()
        )
        db.add(log)
        db.commit()
        
        print("Seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
