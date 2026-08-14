/** Alimentos detectables por el Semáforo del Plato */
export type PlateFoodId =
  | "sangrecita"
  | "higado"
  | "limon"
  | "naranja"
  | "leche"
  | "cafe";

/** Categorías metabólicas del semáforo */
export type MetabolicCategory = "heme" | "enhancer" | "inhibitor";

/** Fuente de detección — todo corre en CPU vía Canvas API (sin GPU, sin dependencias externas) */
export type DetectionSource = "color" | "region" | "manual";

export interface FoodDetection {
  id: PlateFoodId;
  label: string;
  category: MetabolicCategory;
  confidence: number; // 0–100
  source: DetectionSource;
}

export interface PlateScanResult {
  detections: FoodDetection[];
  frameBrightness: number; // 0–255 avg
  isLowLight: boolean;
  engine: "cpu";
  fps: number;
}

export interface DeviceTier {
  tier: "low" | "medium" | "high";
  analysisWidth: number;
  analysisHeight: number;
  targetFps: number;
}

export const FOOD_CATALOG: Record<
  PlateFoodId,
  { label: string; category: MetabolicCategory; aliases: string[] }
> = {
  sangrecita: {
    label: "Sangrecita",
    category: "heme",
    aliases: ["sangre", "morcilla"],
  },
  higado: {
    label: "Hígado",
    category: "heme",
    aliases: ["higado", "liver"],
  },
  limon: {
    label: "Limón / Vitamina C",
    category: "enhancer",
    aliases: ["limon", "lemon", "citrico"],
  },
  naranja: {
    label: "Naranja",
    category: "enhancer",
    aliases: ["orange", "mandarina"],
  },
  leche: {
    label: "Leche / Lácteos",
    category: "inhibitor",
    aliases: ["leche", "milk", "yogurt", "queso"],
  },
  cafe: {
    label: "Té / Infusiones",
    category: "inhibitor",
    aliases: ["cafe", "te", "infusion", "cup"],
  },
};
