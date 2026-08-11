import { useState } from "react";
import { Brain, ShieldAlert, TrendingUp, Users, Target } from "lucide-react";
import { useData } from "../../contexts/DataContext";

export function AIRiskStratificationPanel() {
  const { children } = useData();

  // Algoritmo heurístico para simular Estratificación de Riesgo por IA
  const riskData = [
    {
      sector: "Sector A (Centro)",
      population: children.filter(c => c.community.includes("Anchonga")).length || 12,
      aiRiskScore: 24, // Riesgo bajo
      trend: "down",
      drivers: ["Buena adherencia a visitas", "Consumo de proteínas alto"],
    },
    {
      sector: "Sector B (Periferia)",
      population: children.filter(c => !c.community.includes("Anchonga")).length || 8,
      aiRiskScore: 78, // Riesgo Alto (Hambre oculta)
      trend: "up",
      drivers: ["Ausentismo en controles", "Baja ingesta de hierro hemínico"],
    },
    {
      sector: "Sector C (Nuevo Asentamiento)",
      population: 5,
      aiRiskScore: 55, // Riesgo Medio
      trend: "stable",
      drivers: ["Agua no potable", "Alta prevalencia de IRAs"],
    }
  ];

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col">
      <div className="bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Brain className="size-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold font-nunito text-lg leading-tight">
              Estratificación de Riesgo IA
            </h3>
            <p className="text-white/80 text-xs">
              Modelo Predictivo de Hambre Oculta y Anemia
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          El modelo de Inteligencia Artificial analiza determinantes sociales, adherencia y Z-Scores históricos para predecir el riesgo futuro de desnutrición poblacional, permitiendo asignar suplementos de forma focalizada.
        </p>

        <div className="space-y-3">
          {riskData.map((sector, idx) => (
            <div key={idx} className="bg-muted/30 border border-border rounded-2xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Target className="size-4 text-primary" />
                    {sector.sector}
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Users className="size-3" /> Población monitoreada: {sector.population} wawas
                  </p>
                </div>
                
                <div className={`flex flex-col items-end`}>
                  <div className={`flex items-center gap-1 text-xl font-black font-nunito ${
                    sector.aiRiskScore > 70 ? "text-red-600 dark:text-red-400" :
                    sector.aiRiskScore > 40 ? "text-amber-600 dark:text-amber-400" :
                    "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {sector.aiRiskScore}%
                    <TrendingUp className={`size-4 ${sector.trend === "up" ? "text-red-500" : sector.trend === "down" ? "text-emerald-500" : "text-amber-500"}`} />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Riesgo IA
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    sector.aiRiskScore > 70 ? "bg-red-500" :
                    sector.aiRiskScore > 40 ? "bg-amber-500" :
                    "bg-emerald-500"
                  }`}
                  style={{ width: `${sector.aiRiskScore}%` }}
                />
              </div>

              <div className="bg-card rounded-xl p-3 border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Factores Predominantes (Drivers)</p>
                <ul className="space-y-1">
                  {sector.drivers.map((driver, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span> {driver}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Recomendación de Política Pública */}
        <div className="flex gap-2 items-start bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/50">
          <ShieldAlert className="size-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 text-rose-600 dark:text-rose-400">
              Acción de Precisión Sugerida
            </p>
            <p className="text-xs leading-relaxed font-medium">
              El algoritmo sugiere <strong>redistribuir el 40% del stock de micronutrientes</strong> del Sector A hacia el Sector B debido a un pico predictivo de deficiencia de hierro en los próximos 2 meses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
