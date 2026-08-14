import type { DeviceTier } from "./types";

/**
 * Ajusta resolución y FPS según CPU/RAM del dispositivo.
 * Todo el análisis corre en CPU (Canvas API + JS puro) — sin GPU ni librerías externas.
 */
export function detectDeviceTier(): DeviceTier {
  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? 2 : 2;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 2;

  if (cores <= 2 || memory <= 2) {
    return { tier: "low", analysisWidth: 120, analysisHeight: 90, targetFps: 5 };
  }

  if (cores <= 4 || memory <= 4) {
    return { tier: "medium", analysisWidth: 160, analysisHeight: 120, targetFps: 8 };
  }

  return { tier: "high", analysisWidth: 200, analysisHeight: 150, targetFps: 10 };
}
