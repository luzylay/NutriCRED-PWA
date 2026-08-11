import { useState } from "react";
import { Apple, CupSoda, Droplet, Check, X, FlaskConical } from "lucide-react";

export function IronAbsorptionVisualizer() {
  const [hasVitaminC, setHasVitaminC] = useState(false);
  const [hasInhibitor, setHasInhibitor] = useState(false);

  // Calcula eficiencia de absorción (heurística educativa simple)
  let absorptionLevel = 20; // Base: 20%
  if (hasVitaminC) absorptionLevel += 40;
  if (hasInhibitor) absorptionLevel -= 15;
  
  // Limites
  absorptionLevel = Math.max(5, Math.min(100, absorptionLevel));

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <FlaskConical className="size-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold font-nunito text-lg leading-tight">
              Diseño "In-Silico" Simulado
            </h3>
            <p className="text-white/80 text-xs">
              Mecánica Molecular de Absorción de Hierro
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Las interacciones moleculares en el intestino determinan cuánto hierro ingresa a la sangre. <strong>Agrega o quita elementos</strong> para ver cómo cambia la biodisponibilidad del hierro (Fe²⁺/Fe³⁺).
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setHasVitaminC(!hasVitaminC)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
              hasVitaminC
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                : "bg-card border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            <Apple className="size-8 mb-2" />
            <p className="text-sm font-bold">Vitamina C</p>
            <p className="text-[10px] text-center mt-1 opacity-80">
              Jugo de Naranja/Limonada (Facilitador)
            </p>
            {hasVitaminC && (
              <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5">
                <Check className="size-3" />
              </div>
            )}
          </button>

          <button
            onClick={() => setHasInhibitor(!hasInhibitor)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all relative ${
              hasInhibitor
                ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                : "bg-card border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            <CupSoda className="size-8 mb-2" />
            <p className="text-sm font-bold">Inhibidores</p>
            <p className="text-[10px] text-center mt-1 opacity-80">
              Té, Mate, Gaseosa (Taninos/Fitatos)
            </p>
            {hasInhibitor && (
              <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-0.5">
                <X className="size-3" />
              </div>
            )}
          </button>
        </div>

        <div className="bg-muted/30 rounded-2xl p-5 border border-border space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Absorción Neta de Hierro
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-4xl font-extrabold font-nunito text-foreground">
                  {absorptionLevel}%
                </p>
              </div>
            </div>
            
            <div className="size-16 relative">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <path
                  className="text-muted stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    absorptionLevel > 40 ? "text-emerald-500" : absorptionLevel > 15 ? "text-amber-500" : "text-red-500"
                  } stroke-current transition-all duration-1000 ease-out`}
                  strokeWidth="3"
                  strokeDasharray={`${absorptionLevel}, 100`}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs font-semibold text-foreground flex items-start gap-2">
              <span className="text-lg">🔬</span>
              {hasVitaminC && !hasInhibitor && "¡Excelente! El ácido ascórbico reduce el Fe³⁺ a Fe²⁺ y forma quelatos solubles, facilitando su paso por el enterocito."}
              {hasVitaminC && hasInhibitor && "La Vitamina C intenta ayudar, pero los fitatos compiten por unirse al hierro y lo bloquean parcialmente."}
              {!hasVitaminC && hasInhibitor && "Peligro: Los polifenoles (taninos) del té se unen al hierro formando complejos insolubles que el cuerpo no puede absorber. ¡Se desecha todo!"}
              {!hasVitaminC && !hasInhibitor && "Absorción basal. Añade cítricos a las lentejas o sangrecita para potenciar la absorción de hierro no-hemo."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
