// ─── CORE DOMAIN TYPES ────────────────────────────────────────────────────────

export type AlertLevel = "normal" | "follow-up" | "urgent";
export type AppView = "family" | "professional" | "agent" | "admin";
export type MeasureType = "weight" | "height" | "muac";
export type UserRole = "CAREGIVER" | "PROFESSIONAL" | "ADMIN";
export type UserStatus = "active" | "inactive";

// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  username: string;
  role: UserRole;
  token: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  username: string;
}

// ─── CHILDREN ────────────────────────────────────────────────────────────────

export interface Child {
  id: string;
  name: string;
  shortName: string;
  age: string;
  ageMonths: number;
  sex: "M" | "F";
  caregiver: string;
  caregiverDni?: string;
  status: AlertLevel;
  weight: number;
  height: number;
  muac?: number;
  lastMeasured: string;
  zScore: number;
  nextAction: string;
  district: string;
  community: string;
}

export interface GrowthPoint {
  label: string;
  value: number;
  p3: number;
  band: number;
  p50: number;
}

// ─── MEASUREMENTS ────────────────────────────────────────────────────────────

export interface Measurement {
  id?: number;
  child_id: number;
  type: MeasureType;
  value: number;
  unit: string;
  measurement_date: string;
  sync_status: "synced" | "pending";
}

export interface OfflineMeasurement extends Measurement {
  childId: number;
  method: string;
}

export interface MeasurementResult {
  success: boolean;
  level: AlertLevel;
  message: string;
}

// ─── VISITS ──────────────────────────────────────────────────────────────────

export interface Visit {
  id: number;
  child_id: number;
  agent_id: number;
  visit_date: string;
  visit_type: string;
}

export interface VisitCreate {
  child_id: number;
  visit_type: string;
  observations: {
    qualitative_notes: string;
    alarm_signs: string;
  };
}

// ─── ALERTS ──────────────────────────────────────────────────────────────────

export interface Alert {
  id: number;
  child_id: number;
  measurement_id: number;
  level: AlertLevel;
  created_at: string;
  status_revision: string;
  comments: string;
  rule_name?: string;
  rule_source?: string;
}

// ─── AUDIT ───────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  table_affected: string | null;
  record_id: number | null;
  old_value: string | null;
  new_value: string | null;
  ip_address: string | null;
  timestamp: string;
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  username: string;
  email_or_phone: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface AdminStats {
  total_children: number;
  total_users: number;
  active_alerts: number;
  visits_this_month: number;
  caregivers: number;
  professionals: number;
  normal_children: number;
  follow_up_children: number;
  urgent_children: number;
}

export interface AlertRule {
  id: number;
  name: string;
  description: string;
  versions: Array<{
    version: string;
    activation_date: string;
    source_doc: string;
  }>;
}

export interface Notification {
  id: number;
  user_id: number;
  send_type: string;
  message: string;
  sent_date: string;
  status: string;
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export interface DashboardSummary {
  total_children: number;
  normal_count: number;
  follow_up_count: number;
  urgent_count: number;
}

// ─── DAILY TRACKING (SRSI & ALARMS) ──────────────────────────────────────────

export type SupplementType = 
  | "Hierro" 
  | "Micronutrientes en polvo (MNP)" 
  | "Vitamina A" 
  | "Zinc" 
  | "Vitamina D" 
  | "No toma suplementos";

export interface DailyTrackingRecord {
  id?: number;
  child_id: number;
  date: string;
  // SRSI Data
  supplement_taken: boolean;
  supplement_type: SupplementType;
  takes_every_day: boolean;
  forgets_frequency: "Nunca" | "A veces" | "Muchas veces";
  photo_proof_url?: string; // Data URL local (JPEG comprimido) — solo suplemento, sin rostros
  
  // Alarms
  has_alarms: boolean;
  alarm_signs: string[]; // List of strings matching the 12 signs
}
