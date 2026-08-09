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
    textClass: "text-emerald-700 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    badgeClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  "follow-up": {
    label: "Requiere seguimiento",
    textClass: "text-amber-700 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    borderClass: "border-amber-200 dark:border-amber-800",
    badgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    dotClass: "bg-amber-400",
  },
  urgent: {
    label: "Evaluación prioritaria",
    textClass: "text-red-700 dark:text-red-400",
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "border-red-200 dark:border-red-800",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    dotClass: "bg-red-500 animate-pulse",
  },
} as const;

// ─── API ─────────────────────────────────────────────────────────────────────

export const API_BASE = "http://127.0.0.1:8000";

// ─── USER ROLE → VIEW MAPPING ────────────────────────────────────────────────

export const ROLE_TO_ROUTE: Record<string, string> = {
  CAREGIVER: "/familia",
  PROFESSIONAL: "/dashboard",
  COMMUNITY_AGENT: "/actor",
  ADMIN: "/admin",
};

// ─── DEMO CREDENTIALS ────────────────────────────────────────────────────────

export const DEMO_CREDENTIALS: Record<string, string> = {
  family: "maria:maria123",
  professional: "carlos:carlos123",
  agent: "luisa:luisa123",
};
