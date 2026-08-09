from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None


# User Schemas
class UserLogin(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    email_or_phone: str
    password: str
    role: str  # ADMIN, PROFESSIONAL, COMMUNITY_AGENT, CAREGIVER
    # Optional profile info depending on role
    name: str
    lastname: str
    phone: Optional[str] = ""
    address: Optional[str] = ""
    district: str
    community: str
    specialty: Optional[str] = ""
    establishment: Optional[str] = ""
    colegiatura_code: Optional[str] = ""


class UserResponse(BaseModel):
    id: int
    username: str
    email_or_phone: str
    role: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Child Schemas
class ChildCreate(BaseModel):
    name: str
    sex: str  # M or F
    date_of_birth: datetime
    district: str
    community: str
    relationship: str  # e.g. Mother, Father (used for Caregiver link)


class ChildResponse(BaseModel):
    id: int
    name: str
    sex: str
    date_of_birth: datetime
    district: str
    community: str
    zscore_actual: float
    status_alerta: str  # normal, follow-up, urgent

    model_config = ConfigDict(from_attributes=True)


# Measurement Schemas
class MeasurementCreate(BaseModel):
    type: str  # weight, height, muac
    value: float
    unit: str  # kg, cm
    method: str = "self"  # self, agent, professional


class MeasurementResponse(BaseModel):
    id: int
    child_id: int
    registered_by: int
    type: str
    value: float
    unit: str
    measurement_date: datetime
    method: str
    sync_status: str

    model_config = ConfigDict(from_attributes=True)


# Alert Schemas
class AlertResponse(BaseModel):
    id: int
    child_id: int
    measurement_id: Optional[int] = None
    level: str
    created_at: datetime
    status_revision: str
    comments: Optional[str] = None
    rule_name: Optional[str] = None
    rule_source: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# Observation & Visit Schemas
class ObservationCreate(BaseModel):
    qualitative_notes: str
    alarm_signs: Optional[str] = None


class ObservationResponse(BaseModel):
    id: int
    qualitative_notes: str
    alarm_signs: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class VisitCreate(BaseModel):
    child_id: int
    visit_type: str
    observations: ObservationCreate


class VisitResponse(BaseModel):
    id: int
    child_id: int
    agent_id: int
    visit_date: datetime
    visit_type: str
    observations: List[ObservationResponse] = []

    model_config = ConfigDict(from_attributes=True)


# Audit Log Schemas
class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    action: str
    table_affected: Optional[str] = None
    record_id: Optional[int] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


# Dashboard Schemas
class DashboardSummary(BaseModel):
    total_children: int
    normal_count: int
    follow_up_count: int
    urgent_count: int


class DashboardPriorityChild(BaseModel):
    id: int
    name: str
    age: str
    last_measured: str
    weight: float
    height: float
    muac: Optional[float] = None
    z_score: float
    status: str
    next_action: str
    district: str
    community: str
    caregiver: str


# Guidance & Sources
class GuidanceResponse(BaseModel):
    id: int
    child_id: int
    age_months: int
    recommendation: str
    source_title: str
    source_institution: str

    model_config = ConfigDict(from_attributes=True)


# Admin Schemas
class AdminStats(BaseModel):
    total_children: int
    total_users: int
    active_alerts: int
    visits_this_month: int
    caregivers: int
    professionals: int
    community_agents: int
    normal_children: int
    follow_up_children: int
    urgent_children: int


class UserStatusUpdate(BaseModel):
    status: str  # active or inactive
