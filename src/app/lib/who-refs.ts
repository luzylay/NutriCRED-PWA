// ─── WHO GROWTH REFERENCE TABLES ─────────────────────────────────────────────
// Source: WHO Child Growth Standards (2006)
// Used for weight-for-age Z-score calculation and chart band rendering

/** [median, standard_deviation] indexed by age in months */
const BOYS_WEIGHT_REF: Record<number, [number, number]> = {
  0: [3.3, 0.4], 3: [6.4, 0.7], 6: [7.9, 0.8], 9: [8.9, 0.9], 12: [9.6, 1.0],
  15: [10.3, 1.1], 18: [10.9, 1.1], 21: [11.5, 1.2], 24: [12.2, 1.2],
  30: [13.3, 1.4], 36: [14.3, 1.5], 42: [15.3, 1.7], 48: [16.3, 1.8],
  54: [17.3, 2.0], 60: [18.3, 2.1],
};

const GIRLS_WEIGHT_REF: Record<number, [number, number]> = {
  0: [3.2, 0.4], 3: [5.8, 0.6], 6: [7.3, 0.8], 9: [8.2, 0.9], 12: [8.9, 1.0],
  15: [9.5, 1.0], 18: [10.2, 1.1], 21: [10.9, 1.1], 24: [11.5, 1.2],
  30: [12.7, 1.3], 36: [13.9, 1.5], 42: [15.0, 1.6], 48: [15.5, 1.8],
  54: [16.8, 1.9], 60: [18.2, 2.1],
};

/**
 * Interpolated WHO weight-for-age reference.
 * Returns [median, standard_deviation] for a given age in months and sex.
 */
export function getWHORef(ageMonths: number, sex: "M" | "F"): [number, number] {
  const ref = sex === "M" ? BOYS_WEIGHT_REF : GIRLS_WEIGHT_REF;
  const ages = Object.keys(ref)
    .map(Number)
    .sort((a, b) => a - b);

  if (ageMonths <= ages[0]) return ref[ages[0]];
  if (ageMonths >= ages[ages.length - 1]) return ref[ages[ages.length - 1]];

  for (let i = 0; i < ages.length - 1; i++) {
    const ageLow = ages[i];
    const ageHigh = ages[i + 1];
    if (ageMonths >= ageLow && ageMonths <= ageHigh) {
      const [medLow, sdLow] = ref[ageLow];
      const [medHigh, sdHigh] = ref[ageHigh];
      const ratio = (ageMonths - ageLow) / (ageHigh - ageLow);
      return [
        medLow + ratio * (medHigh - medLow),
        sdLow + ratio * (sdHigh - sdLow),
      ];
    }
  }

  return ref[ages[ages.length - 1]];
}

/**
 * Calculate weight-for-age Z-score using WHO LMS method (simplified SD method).
 */
export function calculateZScore(
  weight: number,
  ageMonths: number,
  sex: "M" | "F"
): number {
  const [median, sd] = getWHORef(ageMonths, sex);
  return parseFloat(((weight - median) / sd).toFixed(2));
}

/**
 * Classify alert level from a Z-score value.
 */
export function classifyZScore(zscore: number): "normal" | "follow-up" | "urgent" {
  if (zscore < -3) return "urgent";
  if (zscore < -2) return "follow-up";
  return "normal";
}

/**
 * MUAC classification (6–59 months).
 * < 11.5 cm → urgent (severe acute malnutrition)
 * 11.5–12.5 cm → follow-up (moderate acute malnutrition)
 * >= 12.5 cm → normal
 */
export function classifyMUAC(muac: number): "normal" | "follow-up" | "urgent" {
  if (muac < 11.5) return "urgent";
  if (muac < 12.5) return "follow-up";
  return "normal";
}
