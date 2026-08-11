import { useState } from "react";
import { Key, Lock, Unlock, Sparkles, X, Trophy } from "lucide-react";


interface LockKeyGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LockKeyGameModal({ isOpen, onClose }: LockKeyGameModalProps) {
  const [selectedKey, setSelectedKey] = useState<"hem" | "vegetal_limon" | "vegetal_leche">("hem");

  if (!isOpen) return null;

  const CONFIG = {
    hem: {
      title: "Llave Maestra: Hierro HEM (Sangrecita / Hígado / Bazo)",
      desc: "El hierro animal Fe²⁺ entra libremente por los receptores del intestino sin resistencia.",
      days: 18,
      status: "Éxito Total",
      badgeColor: "bg-emerald-500 text-white",
      borderColor: "border-emerald-500/40 bg-emerald-500/10",
      riskText: "Cura óptima y rápida en 18 días. Mantiene al bebé con máxima energía.",
    },
    vegetal_limon: {
      title: "Llave Oxidada + Lija: Menestras con Gotas de Limón",
      desc: "La Vitamina C (limón) lija el hierro vegetal (Fe³⁺) permitiendo que la llave gire lentamente.",
      days: 45,
      status: "Progreso Moderado",
      badgeColor: "bg-amber-500 text-white",
      borderColor: "border-amber-500/40 bg-amber-500/10",
      riskText: "Reversión en 45 días. Requiere constancia diaria y limón en cada comida.",
    },
    vegetal_leche: {
      title: "Cerradura Trancada: Menestras o Sangrecita con Leche/Té",
      desc: "El calcio y los fitatos actúan como un candado adicional que tranca la absorción.",
      days: 90,
      status: "Alto Riesgo de Abandono",
      badgeColor: "bg-red-500 text-white",
      borderColor: "border-red-500/40 bg-red-500/10",
      riskText: "⚠️ Reversión lenta en 90 días. 78% de probabilidad de abandonar el tratamiento por desánimo.",
    },
  };

  const current = CONFIG[selectedKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-[2.5rem] max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Key className="size-5" />
            </div>
            <div>
              <h3 className="font-black text-foreground text-base leading-tight font-nunito flex items-center gap-1.5">
                Juego de la Llave y la Cerradura
                <Sparkles className="size-3.5 text-amber-500" />
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">Gamificación de Absorción Intestinal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Interactive Intestine Door Graphic */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-amber-500/10 border border-border/60 rounded-3xl p-5 text-center space-y-4 relative overflow-hidden">
          <div className="relative inline-block mx-auto">
            <div className={`size-20 rounded-3xl flex items-center justify-center border shadow-xl transition-all duration-500 ${
              selectedKey === "hem"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 scale-110"
                : selectedKey === "vegetal_limon"
                ? "bg-amber-500/20 border-amber-500 text-amber-600"
                : "bg-red-500/20 border-red-500 text-red-600 animate-bounce"
            }`}>
              {selectedKey === "hem" ? <Unlock className="size-10" /> : <Lock className="size-10" />}
            </div>
          </div>

          {/* Real-Time Anemia Reversal Counter */}
          <div className="bg-card/90 backdrop-blur-md border border-border/60 rounded-2xl p-3.5 space-y-1 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Tiempo estimado de Reversión de Anemia
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black font-nunito tracking-tight text-foreground">
                {current.days} Días
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${current.badgeColor}`}>
                {current.status}
              </span>
            </div>
          </div>
        </div>

        {/* Key Selection Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Elige la combinación de alimentos:
          </p>
          <div className="space-y-2">
            {[
              { id: "hem" as const, label: "🔑 Llave Maestra: Sangrecita / Hígado", days: "18 Días" },
              { id: "vegetal_limon" as const, label: "🗝️ Llave + Lija: Menestras + Limón", days: "45 Días" },
              { id: "vegetal_leche" as const, label: "🔒 Cerradura Trancada: Hierro + Leche", days: "90 Días" },
            ].map((k) => (
              <button
                key={k.id}
                onClick={() => setSelectedKey(k.id)}
                className={`w-full p-3.5 rounded-2xl text-xs font-extrabold text-left border transition-all flex items-center justify-between cursor-pointer ${
                  selectedKey === k.id
                    ? "bg-primary text-primary-foreground shadow-md border-primary scale-[1.01]"
                    : "bg-card hover:bg-muted/60 text-foreground border-border"
                }`}
              >
                <span>{k.label}</span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  selectedKey === k.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {k.days}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Educational Impact Box */}
        <div className={`p-4 rounded-2xl border text-xs leading-relaxed font-medium space-y-1.5 ${current.borderColor}`}>
          <div className="flex items-center gap-1.5 font-black text-foreground">
            <Trophy className="size-4 text-amber-500" />
            <span>Impacto en la Salud de tu Bebé:</span>
          </div>
          <p className="text-foreground/90">{current.riskText}</p>
        </div>

      </div>
    </div>
  );
}

export default LockKeyGameModal;
