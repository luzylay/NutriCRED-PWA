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
    label: "Adecuado",
    textClass: "text-emerald-600 dark:text-emerald-400 font-extrabold",
    bgClass: "bg-card border-emerald-500/40",
    borderClass: "border-emerald-500/40",
    badgeClass:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-black border border-emerald-500/30",
    dotClass: "bg-emerald-500",
  },
  "follow-up": {
    label: "Riesgo Nutricional",
    textClass: "text-amber-600 dark:text-amber-400 font-extrabold",
    bgClass: "bg-card border-amber-500/40",
    borderClass: "border-amber-500/40",
    badgeClass:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black border border-amber-500/30",
    dotClass: "bg-amber-500",
  },
  urgent: {
    label: "Alerta Médica",
    textClass: "text-rose-600 dark:text-rose-400 font-extrabold",
    bgClass: "bg-card border-rose-500/40",
    borderClass: "border-rose-500/40",
    badgeClass:
      "bg-rose-500/15 text-rose-700 dark:text-rose-300 font-black border border-rose-500/30",
    dotClass: "bg-rose-500 animate-pulse",
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
