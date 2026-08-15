// ─── REGLAS DE FRECUENCIA CRED MINSA & OMS ─────────────────────────────────────
// Frecuencia mínima por edad (CRED MINSA) + Ajuste por Riesgo Nutricional (OMS)
// Tabla configurable por el Administrador de Sistema (check_frequencies)

import type { AlertLevel } from "./types";

export interface CheckFrequencyRule {
  id: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  ageLabel: string;
  credStandardDays: number;
  credStandardLabel: string;
  riskFollowUpDays: number; // 🟡 Riesgo
  riskUrgentDays: number;   // 🔴 Urgente
}

/**
 * Tabla predeterminada `check_frequencies` (Configurable por Administrador IT)
 */
export const DEFAULT_CHECK_FREQUENCIES: CheckFrequencyRule[] = [
  {
    id: "neonatal",
    minAgeMonths: 0,
    maxAgeMonths: 0.99, // 0-29 días
    ageLabel: "0 a 29 días (Neonato)",
    credStandardDays: 7,
    credStandardLabel: "Semanal",
    riskFollowUpDays: 7,
    riskUrgentDays: 1, // 24 horas
  },
  {
    id: "infant",
    minAgeMonths: 1,
    maxAgeMonths: 11.99, // 1-11 meses
    ageLabel: "1 a 11 meses (Lactante)",
    credStandardDays: 30,
    credStandardLabel: "Mensual",
    riskFollowUpDays: 15,
    riskUrgentDays: 7,
  },
  {
    id: "toddler_1",
    minAgeMonths: 12,
    maxAgeMonths: 23.99, // 12-23 meses
    ageLabel: "12 a 23 meses (1-2 años)",
    credStandardDays: 60,
    credStandardLabel: "Bimensual",
    riskFollowUpDays: 30,
    riskUrgentDays: 7,
  },
  {
    id: "preschool",
    minAgeMonths: 24,
    maxAgeMonths: 59.99, // 2-4 años
    ageLabel: "2 a 4 años (Preescolar)",
    credStandardDays: 90,
    credStandardLabel: "Trimestral",
    riskFollowUpDays: 30,
    riskUrgentDays: 7,
  },
  {
    id: "school_age",
    minAgeMonths: 60,
    maxAgeMonths: 143.99, // 5-11 años
    ageLabel: "5 a 11 años (Escolar)",
    credStandardDays: 180,
    credStandardLabel: "Semestral",
    riskFollowUpDays: 30,
    riskUrgentDays: 7,
  },
];

/**
 * Obtiene la regla CRED según edad en meses.
 */
export function getCredRuleForAge(ageMonths: number): CheckFrequencyRule {
  const rule = DEFAULT_CHECK_FREQUENCIES.find(
    (r) => ageMonths >= r.minAgeMonths && ageMonths <= r.maxAgeMonths
  );
  return rule || DEFAULT_CHECK_FREQUENCIES[DEFAULT_CHECK_FREQUENCIES.length - 1];
}

/**
 * Calcula el intervalo máximo permitido en días combinando Edad (CRED) y Riesgo (OMS).
 */
export function getRecommendedCheckupIntervalDays(
  ageMonths: number,
  risk: AlertLevel
): { maxDays: number; ruleSource: string; frequencyLabel: string } {
  const rule = getCredRuleForAge(ageMonths);

  if (risk === "urgent") {
    return {
      maxDays: rule.riskUrgentDays,
      ruleSource: "OMS Urgente (Alerta Médica)",
      frequencyLabel: rule.riskUrgentDays === 1 ? "24 horas (Inmediato)" : `${rule.riskUrgentDays} días (Semanal)`,
    };
  }

  if (risk === "follow-up") {
    return {
      maxDays: rule.riskFollowUpDays,
      ruleSource: "OMS Riesgo Nutricional",
      frequencyLabel: `${rule.riskFollowUpDays} días (Quincenal / Mensual)`,
    };
  }

  return {
    maxDays: rule.credStandardDays,
    ruleSource: `MINSA CRED Estándar (${rule.ageLabel})`,
    frequencyLabel: rule.credStandardLabel,
  };
}

/**
 * Calcula la fecha recomendada del próximo control y el estado de la alerta de incumplimiento.
 */
export function calculateCheckupSchedule(
  lastCheckupDate: Date | string,
  ageMonths: number,
  risk: AlertLevel
): {
  nextRecommendedDate: Date;
  daysRemaining: number;
  isOverdue: boolean;
  isPreventiveAlert: boolean;
  alertType: "none" | "preventive" | "expired";
  intervalDays: number;
  frequencyLabel: string;
} {
  const lastDate = new Date(lastCheckupDate);
  const { maxDays, frequencyLabel } = getRecommendedCheckupIntervalDays(ageMonths, risk);

  const nextRecommendedDate = new Date(lastDate);
  nextRecommendedDate.setDate(nextRecommendedDate.getDate() + maxDays);

  const today = new Date();
  const diffTime = nextRecommendedDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isOverdue = daysRemaining < 0;
  const isPreventiveAlert = daysRemaining >= 0 && daysRemaining <= 7;

  let alertType: "none" | "preventive" | "expired" = "none";
  if (isOverdue) alertType = "expired";
  else if (isPreventiveAlert) alertType = "preventive";

  return {
    nextRecommendedDate,
    daysRemaining,
    isOverdue,
    isPreventiveAlert,
    alertType,
    intervalDays: maxDays,
    frequencyLabel,
  };
}
