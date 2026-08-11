import { getWHORef } from "../constants";
import { localDB } from "../db";

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
  execute: (params: any) => Promise<unknown> | unknown;
}

/**
 * Registro de Herramientas WebMCP (Model Context Protocol) para Inteligencia Artificial Offline.
 * Cumplimiento de la Ley N° 29733 (Soberanía y Privacidad de Datos en Salud).
 */
export const WEBMCP_TOOLS: Record<string, MCPToolDefinition> = {
  calculate_who_zscore: {
    name: "calculate_who_zscore",
    description: "Calcula el Z-score OMS de Peso-para-Edad según la edad en meses y sexo del menor.",
    parameters: {
      type: "object",
      properties: {
        ageMonths: { type: "number", description: "Edad del niño en meses (0 a 60)" },
        sex: { type: "string", description: "Sexo del niño: 'M' o 'F'" },
        weightKg: { type: "number", description: "Peso medido en kilogramos" },
      },
      required: ["ageMonths", "sex", "weightKg"],
    },
    execute: ({ ageMonths, sex, weightKg }: { ageMonths: number; sex: "M" | "F"; weightKg: number }) => {
      const [median, sd] = getWHORef(ageMonths, sex);
      const zscore = (weightKg - median) / sd;
      let diagnosis = "Normal (Saludable)";
      if (zscore < -3) diagnosis = "Alerta Crítica: Riesgo Desnutrición Severa (Z < -3)";
      else if (zscore < -2) diagnosis = "Alerta Moderada: Riesgo Desnutrición (Z < -2)";
      else if (zscore > 2) diagnosis = "Sobrepeso / Obesidad (Z > +2)";

      return {
        zscore: Number(zscore.toFixed(2)),
        medianOMS: median,
        sdOMS: sd,
        diagnosis,
        refDoc: "Norma Técnica NTS N° 137-MINSA/2017/DGIESP",
      };
    },
  },

  search_iron_superfood: {
    name: "search_iron_superfood",
    description: "Retorna recomendaciones de superalimentos ricos en hierro hemínico según región (Costa, Sierra, Selva).",
    parameters: {
      type: "object",
      properties: {
        region: { type: "string", description: "Región geográfica: 'Costa', 'Sierra', 'Selva' o 'Todas'" },
      },
    },
    execute: ({ region = "Todas" }: { region?: string }) => {
      const foods = [
        { name: "Sangrecita de Pollo", ironMg: 29.5, type: "Hemínico (Animal)", bio: "Absorción ultra-rápida (25%)", cost: "Muy Barato" },
        { name: "Hígado de Res/Pollo", ironMg: 19.2, type: "Hemínico (Animal)", bio: "Alta absorción (20%)", cost: "Económico" },
        { name: "Bazo de Res", ironMg: 28.7, type: "Hemínico (Animal)", bio: "Alta concentración", cost: "Económico" },
        { name: "Charqui de Alpaca (Sierra)", ironMg: 12.0, type: "Hemínico (Animal)", bio: "Tradicional andino", cost: "Accesible" },
        { name: "Tarwi / Chocho (Sierra)", ironMg: 7.5, type: "Vegetal", bio: "Combinar con Vitamina C", cost: "Muy Barato" },
      ];
      return { region, recommendedFoods: foods };
    },
  },

  get_child_growth: {
    name: "get_child_growth",
    description: "Obtiene el historial de mediciones guardado localmente en IndexedDB Dexie.js para un menor.",
    parameters: {
      type: "object",
      properties: {
        childId: { type: "number", description: "ID único del niño" },
      },
      required: ["childId"],
    },
    execute: async ({ childId }: { childId: number }) => {
      const records = await localDB.measurements.where("child_id").equals(childId).toArray();
      return { childId, count: records.length, measurements: records };
    },
  },
};
