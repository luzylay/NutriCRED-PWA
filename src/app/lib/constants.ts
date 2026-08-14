import type { AlertLevel } from "./types";

// ─── ALERT LEVEL CONFIGURATION ───────────────────────────────────────────────

export const ALERT_CFG: Record<
  AlertLevel,
  {
    label: string;
    textClass: string;
    bgClass: string;
    borderClass: string;
    badgeClass: string;
    dotClass: string;
  }
> = {
  normal: {
    label: "Seguimiento normal",
    textClass: "text-emerald-500 font-bold",
    bgClass: "bg-card border-emerald-500/40",
    borderClass: "border-emerald-500/40",
    badgeClass:
      "bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30",
    dotClass: "bg-emerald-500",
  },
  "follow-up": {
    label: "Requiere seguimiento",
    textClass: "text-amber-500 font-bold",
    bgClass: "bg-card border-amber-500/40",
    borderClass: "border-amber-500/40",
    badgeClass:
      "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30",
    dotClass: "bg-amber-400",
  },
  urgent: {
    label: "Evaluación prioritaria",
    textClass: "text-red-500 font-bold",
    bgClass: "bg-card border-red-500/40",
    borderClass: "border-red-500/40",
    badgeClass:
      "bg-red-500/15 text-red-400 font-bold border border-red-500/30",
    dotClass: "bg-red-500 animate-pulse",
  },
} as const;

// ─── API ─────────────────────────────────────────────────────────────────────

export const API_BASE = "http://127.0.0.1:8000";

// ─── USER ROLE → VIEW MAPPING ────────────────────────────────────────────────

export const ROLE_TO_ROUTE: Record<string, string> = {
  CAREGIVER: "/familia",
  PROFESSIONAL: "/dashboard",
  ADMIN: "/admin",
};

// ─── DEMO CREDENTIALS ────────────────────────────────────────────────────────

export const DEMO_CREDENTIALS: Record<string, string> = {
  family: "maria:maria123",
  professional: "carlos:carlos123",
  agent: "luisa:luisa123",
};
