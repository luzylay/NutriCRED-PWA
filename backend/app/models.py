from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship, relationship as orm_relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email_or_phone = Column(String, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # ADMIN, PROFESSIONAL, COMMUNITY_AGENT, CAREGIVER
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="active") # active, inactive

    # Relationships
    caregiver = relationship("Caregiver", uselist=False, back_populates="user")
    professional = relationship("HealthProfessional", uselist=False, back_populates="user")
    agent = relationship("CommunityAgent", uselist=False, back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Caregiver(Base):
    __tablename__ = "caregivers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=True)
    district = Column(String, nullable=False)
    community = Column(String, nullable=False)

    # Relationships
    user = relationship("User", back_populates="caregiver")
    children_links = relationship("CaregiverChild", back_populates="caregiver")
    consents = relationship("Consent", back_populates="caregiver")

class HealthProfessional(Base):
    __tablename__ = "health_professionals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    establishment = Column(String, nullable=False)
    colegiatura_code = Column(String, nullable=False)

    # Relationships
    user = relationship("User", back_populates="professional")
    children_links = relationship("ProfessionalChild", back_populates="professional")

class CommunityAgent(Base):
    __tablename__ = "community_agents"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    district = Column(String, nullable=False)
    community = Column(String, nullable=False)
    phone = Column(String, nullable=False)

    # Relationships
    user = relationship("User", back_populates="agent")
    children_links = relationship("AgentChild", back_populates="agent")
    visits = relationship("Visit", back_populates="agent")

class Child(Base):
    __tablename__ = "children"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sex = Column(String, nullable=False) # M, F
    date_of_birth = Column(DateTime, nullable=False)
    district = Column(String, nullable=False)
    community = Column(String, nullable=False)
    zscore_actual = Column(Float, default=0.0)
    status_alerta = Column(String, default="normal") # normal, follow-up, urgent

    # Relationships
    caregivers_links = relationship("CaregiverChild", back_populates="child", cascade="all, delete-orphan")
    agents_links = relationship("AgentChild", back_populates="child", cascade="all, delete-orphan")
    professionals_links = relationship("ProfessionalChild", back_populates="child", cascade="all, delete-orphan")
    measurements = relationship("Measurement", back_populates="child", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="child", cascade="all, delete-orphan")
    visits = relationship("Visit", back_populates="child", cascade="all, delete-orphan")
    nutrition_guidance = relationship("NutritionGuidance", back_populates="child", cascade="all, delete-orphan")

class CaregiverChild(Base):
    __tablename__ = "caregiver_child"
    id = Column(Integer, primary_key=True, index=True)
    caregiver_id = Column(Integer, ForeignKey("caregivers.id"))
    child_id = Column(Integer, ForeignKey("children.id"))
    relationship = Column(String, nullable=False) # Mother, Father, Grandparent, etc.
    consent_id = Column(Integer, ForeignKey("consents.id"), nullable=True)

    caregiver = orm_relationship("Caregiver", back_populates="children_links")
    child = orm_relationship("Child", back_populates="caregivers_links")

class AgentChild(Base):
    __tablename__ = "agent_child"
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("community_agents.id"))
    child_id = Column(Integer, ForeignKey("children.id"))
    assigned_date = Column(DateTime, default=datetime.utcnow)

    agent = relationship("CommunityAgent", back_populates="children_links")
    child = relationship("Child", back_populates="agents_links")

class ProfessionalChild(Base):
    __tablename__ = "professional_child"
    id = Column(Integer, primary_key=True, index=True)
    professional_id = Column(Integer, ForeignKey("health_professionals.id"))
    child_id = Column(Integer, ForeignKey("children.id"))
    assigned_date = Column(DateTime, default=datetime.utcnow)

    professional = relationship("HealthProfessional", back_populates="children_links")
    child = relationship("Child", back_populates="professionals_links")

class Measurement(Base):
    __tablename__ = "measurements"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id"))
    registered_by = Column(Integer, ForeignKey("users.id")) # user id
    type = Column(String, nullable=False) # weight, height, muac
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=False) # kg, cm
    measurement_date = Column(DateTime, default=datetime.utcnow)
    method = Column(String, nullable=False) # self, agent, professional
    sync_status = Column(String, default="synced") # synced, pending

    # Relationships
    child = relationship("Child", back_populates="measurements")
    validation = relationship("MeasurementValidation", uselist=False, back_populates="measurement")
    alerts = relationship("Alert", back_populates="measurement")

class MeasurementValidation(Base):
    __tablename__ = "measurement_validation"
    id = Column(Integer, primary_key=True, index=True)
    measurement_id = Column(Integer, ForeignKey("measurements.id"), unique=True)
    is_valid = Column(Boolean, default=True)
    validation_notes = Column(Text, nullable=True)
    sudden_change_detected = Column(Boolean, default=False)

    measurement = relationship("Measurement", back_populates="validation")

class AlertRule(Base):
    __tablename__ = "alert_rules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    formula_params = Column(Text, nullable=True)

    versions = relationship("RuleVersion", back_populates="rule")

class RuleVersion(Base):
    __tablename__ = "rule_versions"
    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, ForeignKey("alert_rules.id"))
    version = Column(String, nullable=False)
    activation_date = Column(DateTime, default=datetime.utcnow)
    source_doc = Column(String, nullable=False) # e.g. OMS Standards, MINSA CRED

    rule = relationship("AlertRule", back_populates="versions")
    alerts = relationship("Alert", back_populates="rule_version")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id"))
    measurement_id = Column(Integer, ForeignKey("measurements.id"), nullable=True)
    rule_version_id = Column(Integer, ForeignKey("rule_versions.id"), nullable=True)
    level = Column(String, nullable=False) # normal, follow-up, urgent
    created_at = Column(DateTime, default=datetime.utcnow)
    status_revision = Column(String, default="pending") # pending, reviewed
    comments = Column(Text, nullable=True)

    child = relationship("Child", back_populates="alerts")
    measurement = relationship("Measurement", back_populates="alerts")
    rule_version = relationship("RuleVersion", back_populates="alerts")

class Visit(Base):
    __tablename__ = "visits"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id"))
    agent_id = Column(Integer, ForeignKey("community_agents.id"))
    visit_date = Column(DateTime, default=datetime.utcnow)
    visit_type = Column(String, nullable=False) # CRED tracking, Alert follow-up, etc.

    child = relationship("Child", back_populates="visits")
    agent = relationship("CommunityAgent", back_populates="visits")
    observations = relationship("Observation", back_populates="visit")

class Observation(Base):
    __tablename__ = "observations"
    id = Column(Integer, primary_key=True, index=True)
    visit_id = Column(Integer, ForeignKey("visits.id"))
    qualitative_notes = Column(Text, nullable=False)
    alarm_signs = Column(Text, nullable=True)

    visit = relationship("Visit", back_populates="observations")

class GuidanceSource(Base):
    __tablename__ = "guidance_sources"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    institution = Column(String, nullable=False) # OMS, UNICEF, MINSA
    publication_date = Column(DateTime, nullable=True)

    guidances = relationship("NutritionGuidance", back_populates="source")

class NutritionGuidance(Base):
    __tablename__ = "nutrition_guidance"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id"))
    age_months = Column(Integer, nullable=False)
    recommendation = Column(Text, nullable=False)
    source_id = Column(Integer, ForeignKey("guidance_sources.id"))

    child = relationship("Child", back_populates="nutrition_guidance")
    source = relationship("GuidanceSource", back_populates="guidances")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    send_type = Column(String, nullable=False) # whatsapp, pwa
    message = Column(Text, nullable=False)
    sent_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="sent") # sent, failed

    user = relationship("User", back_populates="notifications")

class Consent(Base):
    __tablename__ = "consents"
    id = Column(Integer, primary_key=True, index=True)
    caregiver_id = Column(Integer, ForeignKey("caregivers.id"))
    consent_type = Column(String, nullable=False) # LOPD (Law 29733)
    signed_date = Column(DateTime, default=datetime.utcnow)
    revoked_date = Column(DateTime, nullable=True)

    caregiver = relationship("Caregiver", back_populates="consents")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # None for anonymous actions
    action = Column(String, nullable=False) # login, create_child, register_measurement, etc.
    table_affected = Column(String, nullable=True)
    record_id = Column(Integer, nullable=True)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")

class SyncQueue(Base):
    __tablename__ = "sync_queue"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    endpoint = Column(String, nullable=False)
    payload = Column(Text, nullable=False)
    retries = Column(Integer, default=0)
    status = Column(String, default="pending") # pending, synced, failed
