interface ZScoreBarProps {
  zscore: number;
}

export function ZScoreBar({ zscore }: ZScoreBarProps) {
  // Clamp Z-Score between -3 y +3 para el porcentaje de 0% a 100%
  const clampedZ = Math.max(-3, Math.min(3, zscore));
  const pct = ((clampedZ + 3) / 6) * 100;

  // Determinación de diagnóstico OMS y colores
  let color = "#10b981"; // Emerald
  let bgGradient = "from-emerald-500/20 to-emerald-500/30";
  let badgeText = "Normal (P50 OMS)";

  if (zscore < -3) {
    color = "#ef4444"; // Red
    bgGradient = "from-red-500/30 to-red-600/40";
    badgeText = "Déficit Severo (Z < -3)";
  } else if (zscore < -2) {
    color = "#f97316"; // Orange
    bgGradient = "from-orange-500/25 to-amber-500/30";
    badgeText = "Riesgo Moderado (Z < -2)";
  } else if (zscore < -1) {
    color = "#f59e0b"; // Amber
    bgGradient = "from-amber-500/20 to-yellow-500/25";
    badgeText = "Alerta Leve (Z < -1)";
  } else if (zscore > 2) {
    color = "#ef4444";
    bgGradient = "from-red-500/30 to-red-600/40";
    badgeText = "Elevado (Z > +2)";
  } else if (zscore > 1) {
    color = "#f59e0b";
    badgeText = "Sobrepromedio (Z > +1)";
  }

  return (
    <div className="space-y-2.5 bg-card/40 backdrop-blur-md p-3.5 rounded-2xl border border-border/60 shadow-sm">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono font-bold" style={{ color }}>
          <span className="size-2 rounded-full animate-ping" style={{ backgroundColor: color }}></span>
          <span>Z = {zscore > 0 ? `+${zscore.toFixed(1)}` : zscore.toFixed(1)} SD</span>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs"
          style={{ backgroundColor: color }}
        >
          {badgeText}
        </span>
      </div>

      {/* Main Track & Zones Bar */}
      <div className="relative h-4 rounded-xl overflow-hidden p-0.5 bg-muted/80 border border-border/40 shadow-inner">
        {/* Color Bands (OMS Z-score Zones) */}
        <div className="absolute inset-0 flex text-[9px] font-black text-white/80 select-none">
          {/* Z < -2: Rojo/Naranja (-3 a -2 SD) = 16.67% */}
          <div className="w-[16.67%] bg-red-500/40 dark:bg-red-900/50 flex items-center justify-center border-r border-white/20">
            -3
          </div>
          {/* -2 a -1: Amarillo/Ámbar = 16.67% */}
          <div className="w-[16.67%] bg-amber-500/40 dark:bg-amber-900/50 flex items-center justify-center border-r border-white/20">
            -2
          </div>
          {/* -1 a +1: Verde Normal OMS = 33.33% */}
          <div className="w-[33.33%] bg-emerald-500/40 dark:bg-emerald-900/50 flex items-center justify-center border-r border-white/20">
            Normal (OMS)
          </div>
          {/* +1 a +2: Amarillo = 16.67% */}
          <div className="w-[16.67%] bg-amber-500/40 dark:bg-amber-900/50 flex items-center justify-center border-r border-white/20">
            +2
          </div>
          {/* > +2: Rojo = 16.67% */}
          <div className="w-[16.67%] bg-red-500/40 dark:bg-red-900/50 flex items-center justify-center">
            +3
          </div>
        </div>

        {/* Dynamic Pointer Pin (Indicador de Posición Exacta) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 z-10"
          style={{ left: `${pct}%` }}
        >
          <div
            className="size-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform hover:scale-125 transition-transform"
            style={{ backgroundColor: color }}
          >
            <div className="size-1.5 rounded-full bg-white animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Scale Legend Footer */}
      <div className="flex justify-between text-[10px] font-bold text-muted-foreground/80 px-1 pt-0.5">
        <span>Desnutrición (Z&lt;-2)</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Rango Saludable</span>
        <span>Exceso (Z&gt;+2)</span>
      </div>
    </div>
  );
}
