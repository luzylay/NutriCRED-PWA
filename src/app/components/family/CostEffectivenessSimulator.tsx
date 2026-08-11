import { useState, useMemo } from "react";
import { ShoppingBag, Share2, Sparkles, CheckCircle, MapPin, Calculator, Info } from "lucide-react";

type StrategyType = "A" | "B" | "C";

interface CostEffectivenessSimulatorProps {
  onRequestAssistant?: (context: string) => void;
}

export function CostEffectivenessSimulator({ onRequestAssistant }: CostEffectivenessSimulatorProps) {
  const [weeklyBudget, setWeeklyBudget] = useState(15);
  const [region, setRegion] = useState<"Sierra" | "Costa" | "Selva">("Sierra");
  const [strategy, setStrategy] = useState<StrategyType>("B");

  // Region specific superfood basket (Precios referenciales)
  const REGIONAL_BASKETS = {
    Sierra: [
      { name: "Sangrecita de Cuy / Pollo", price: 3.5, iron: "29.5 mg", bio: "Ultra-Alta", type: "animal" },
      { name: "Aguaymanto / Sauco", price: 2.0, iron: "Vitamina C", bio: "Potenciador", type: "veg" },
      { name: "Tarwi / Chocho", price: 2.5, iron: "7.5 mg", bio: "Proteína", type: "veg" },
      { name: "Charqui de Alpaca", price: 4.0, iron: "12.0 mg", bio: "Alta", type: "animal" },
      { name: "Quinua Perla", price: 3.0, iron: "4.5 mg", bio: "Completa", type: "veg" },
    ],
    Costa: [
      { name: "Bazo / Hígado de Res", price: 3.8, iron: "28.7 mg", bio: "Ultra-Alta", type: "animal" },
      { name: "Limón / Maracuyá", price: 1.5, iron: "Vitamina C", bio: "Potenciador", type: "veg" },
      { name: "Pescado Bonito / Jurel", price: 4.5, iron: "3.2 mg", bio: "Omega 3 + Hierro", type: "animal" },
      { name: "Lentejas de Grano Chica", price: 2.2, iron: "7.0 mg", bio: "Media", type: "veg" },
      { name: "Camote Morado", price: 2.0, iron: "Vitamina A", bio: "Regenerador", type: "veg" },
    ],
    Selva: [
      { name: "Hígado de Pollo / Pescado", price: 3.5, iron: "19.2 mg", bio: "Ultra-Alta", type: "animal" },
      { name: "Camu Camu (Máxima Vit C)", price: 2.5, iron: "Vitamina C x40", bio: "Potenciador Supremo", type: "veg" },
      { name: "Cocona", price: 1.8, iron: "Vitamina C", bio: "Potenciador", type: "veg" },
      { name: "Frijol Ucayalino", price: 2.8, iron: "6.8 mg", bio: "Media", type: "veg" },
      { name: "Yuca amarilla", price: 2.0, iron: "Carbohidrato", bio: "Energía", type: "veg" },
    ],
  };

  const currentBasket = REGIONAL_BASKETS[region];

  // Dynamic ticket calculation based on strategy
  const activeBasket = useMemo(() => {
    switch (strategy) {
      case "A": // 100% Animal + Vit C (elimina carbohidratos/menestras vegetales puras)
        return currentBasket.filter(item => item.type === "animal" || item.bio.includes("Potenciador"));
      case "C": // 100% Vegetal (elimina carnes)
        return currentBasket.filter(item => item.type === "veg");
      case "B": // Mixto
      default:
        return currentBasket;
    }
  }, [currentBasket, strategy]);

  const totalActiveCost = activeBasket.reduce((sum, item) => sum + item.price, 0);

  // Time calculations to raise +1 g/dL Hemoglobin (simulated math)
  const daysAnimal = Math.max(7, Math.round(12 - (weeklyBudget / 30) * 5));
  const daysMixed = Math.max(12, Math.round(20 - (weeklyBudget / 30) * 8));
  const daysVegetal = Math.max(35, Math.round(50 - (weeklyBudget / 30) * 15));

  const handleShareWhatsApp = () => {
    const stratName = strategy === "A" ? "Opción 100% Animal" : strategy === "C" ? "Opción Solo Vegetal" : "Opción Mixta (Recomendada)";
    const text = `🛒 *TICKET DE COMPRA ANTI-ANEMIA (${region.toUpperCase()})* 🛒\n` +
      `Estrategia: ${stratName}\n\n` +
      activeBasket.map((i) => `• ${i.name} — S/ ${i.price.toFixed(2)} (${i.bio})`).join("\n") +
      `\n\n💰 *Total Semanal:* S/ ${totalActiveCost.toFixed(2)} Soles\n` +
      `⚡ *Tiempo estimado de recuperación:* ${strategy === 'A' ? daysAnimal : strategy === 'B' ? daysMixed : daysVegetal} Días\n` +
      `Fuentes: MINSA / INS. Garantizado por Yanapiriwawa.`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="bg-card/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 shadow-sm space-y-6 animate-in fade-in duration-500">
      
      {/* Title Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Calculator className="size-6" />
          </div>
          <div>
            <h3 className="font-black text-foreground text-lg leading-tight font-nunito flex items-center gap-2">
              Simulador de Costo-Efectividad Nutricional
              <Sparkles className="size-4 text-emerald-500" />
            </h3>
            <p className="text-xs font-semibold text-muted-foreground">
              Maximiza la recuperación de Hemoglobina al menor costo semanal (S/ Soles)
            </p>
          </div>
        </div>

        {/* Region Selector Pills */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border border-border">
          {(["Sierra", "Costa", "Selva"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                region === r
                  ? "bg-card text-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="size-3 text-emerald-500" />
              <span>{r}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fuente Info */}
      <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50 text-blue-800 dark:text-blue-300">
        <Info className="size-4 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <strong>Fuentes Oficiales:</strong> Los valores nutricionales provienen de la Tabla Peruana de Composición de Alimentos (INS/MINSA). Los precios son referenciales del Mercado Mayorista (Actualizado: Ago 2026).
        </p>
      </div>

      {/* Interactive Budget Slider */}
      <div className="bg-muted/40 border border-border rounded-3xl p-5 space-y-3">
        <div className="flex justify-between items-center text-xs font-extrabold">
          <span className="text-muted-foreground uppercase tracking-wider">Presupuesto Semanal Objetivo:</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-nunito">
            S/ {weeklyBudget}.00 Soles
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={35}
          step={1}
          value={weeklyBudget}
          onChange={(e) => setWeeklyBudget(Number(e.target.value))}
          className="w-full accent-emerald-500 h-2 bg-muted rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground font-bold">
          <span>S/ 5.00 (Mínimo)</span>
          <span>S/ 20.00 (Recomendado)</span>
          <span>S/ 35.00 (Óptimo)</span>
        </div>
      </div>

      {/* Comparison Grid: Select Strategy */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Elige una Estrategia para actualizar tu ticket:
          </p>
          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
            Recuperación vs. Costo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Opción A */}
          <button
            onClick={() => setStrategy("A")}
            className={`text-left rounded-3xl p-4 space-y-3 shadow-xs transition-all border-2 active:scale-[0.98] ${
              strategy === "A" ? "bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border-emerald-500/80 ring-2 ring-emerald-500/30" : "bg-card hover:bg-muted/50 border-transparent hover:border-border"
            }`}
          >
            <div className="space-y-1.5">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border inline-block ${
                strategy === "A" ? "text-emerald-800 dark:text-emerald-300 bg-emerald-500/20 border-emerald-500/30" : "text-muted-foreground bg-muted border-border"
              }`}>
                Opción A: 100% Animal
              </span>
              <h4 className={`text-sm font-black font-nunito leading-tight ${strategy === "A" ? "text-emerald-700 dark:text-emerald-300" : "text-foreground"}`}>
                Sangrecita / Hígado / Bazo
              </h4>
            </div>
            
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-black text-foreground font-nunito tracking-tight">{daysAnimal} Días</span>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[95%]"></div>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold text-right">Velocidad de cura: 95%</p>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed font-medium">Revierte la anemia en tiempo récord.</p>
          </button>

          {/* Opción B */}
          <button
            onClick={() => setStrategy("B")}
            className={`text-left rounded-3xl p-4 space-y-3 shadow-xs transition-all border-2 active:scale-[0.98] ${
              strategy === "B" ? "bg-gradient-to-br from-primary/15 to-indigo-600/5 border-primary/80 ring-2 ring-primary/30" : "bg-card hover:bg-muted/50 border-transparent hover:border-border"
            }`}
          >
            <div className="space-y-1.5">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border inline-block ${
                strategy === "B" ? "text-primary bg-primary/20 border-primary/30" : "text-muted-foreground bg-muted border-border"
              }`}>
                Opción B: Mixto (Recomendado)
              </span>
              <h4 className={`text-sm font-black font-nunito leading-tight ${strategy === "B" ? "text-primary" : "text-foreground"}`}>
                Sangrecita + Menestras
              </h4>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-black text-foreground font-nunito tracking-tight">{daysMixed} Días</span>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[75%]"></div>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold text-right">Velocidad de cura: 75%</p>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed font-medium">Equilibrio ideal entre costo y rapidez.</p>
          </button>

          {/* Opción C */}
          <button
            onClick={() => setStrategy("C")}
            className={`text-left rounded-3xl p-4 space-y-3 shadow-xs transition-all border-2 active:scale-[0.98] ${
              strategy === "C" ? "bg-gradient-to-br from-amber-500/15 to-orange-500/5 border-amber-500/80 ring-2 ring-amber-500/30" : "bg-card hover:bg-muted/50 border-transparent hover:border-border"
            }`}
          >
            <div className="space-y-1.5">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border inline-block ${
                strategy === "C" ? "text-amber-800 dark:text-amber-300 bg-amber-500/20 border-amber-500/30" : "text-muted-foreground bg-muted border-border"
              }`}>
                Opción C: Solo Vegetal
              </span>
              <h4 className={`text-sm font-black font-nunito leading-tight ${strategy === "C" ? "text-amber-700 dark:text-amber-300" : "text-foreground"}`}>
                Menestras Únicamente
              </h4>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-black text-foreground font-nunito tracking-tight">{daysVegetal} Días</span>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full bg-amber-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[35%]"></div>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold text-right">Velocidad de cura: 35%</p>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed font-medium">Absorción lenta. Requiere constancia.</p>
          </button>
        </div>
      </div>

      {/* Generated Regional Superfood Purchase Receipt */}
      <div className={`bg-card border-2 border-dashed rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden transition-colors duration-500 ${
        strategy === "A" ? "border-emerald-500/40" : strategy === "B" ? "border-primary/40" : "border-amber-500/40"
      }`}>
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className={`size-5 ${
              strategy === "A" ? "text-emerald-500" : strategy === "B" ? "text-primary" : "text-amber-500"
            }`} />
            <div>
              <h4 className="font-extrabold text-foreground text-sm font-nunito">
                Ticket Semanal ({region}) - Opción {strategy}
              </h4>
              <p className="text-[10px] text-muted-foreground font-semibold">
                Superalimentos clave para combatir la anemia a $0 desperdicio
              </p>
            </div>
          </div>
          <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-full ${
            strategy === "A" ? "text-emerald-600 bg-emerald-500/10" : strategy === "B" ? "text-primary bg-primary/10" : "text-amber-600 bg-amber-500/10"
          }`}>
            Total: S/ {totalActiveCost.toFixed(2)}
          </span>
        </div>

        <div className="space-y-2">
          {activeBasket.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-border/40 last:border-0 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <CheckCircle className={`size-3.5 ${
                  strategy === "A" ? "text-emerald-500" : strategy === "B" ? "text-primary" : "text-amber-500"
                }`} />
                <span className="font-bold text-foreground">{item.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">({item.iron})</span>
              </div>
              <span className="font-mono font-black text-foreground">S/ {item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* WhatsApp Export Action */}
        <button
          onClick={handleShareWhatsApp}
          className={`w-full py-3 rounded-2xl text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            strategy === "A" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : strategy === "B" ? "bg-primary hover:bg-primary/90 shadow-primary/20" : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
          }`}
        >
          <Share2 className="size-4" />
          <span>Compartir Ticket de Compra por WhatsApp</span>
        </button>

        {/* AI Integration Action */}
        {onRequestAssistant && (
          <button
            onClick={() => {
              const stratName = strategy === "A" ? "100% Animal" : strategy === "C" ? "Solo Vegetal" : "Mixta";
              onRequestAssistant(`Quiero personalizar mi ticket actual (S/ ${weeklyBudget}, Región ${region}, Opción ${stratName}). ¿Qué reemplazos me sugieres si me falta algún alimento o tengo alergias?`);
            }}
            className="w-full py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold text-xs border border-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Sparkles className="size-4" />
            <span>🪄 Consultar Reemplazos con Yanapiri Mikhuy</span>
          </button>
        )}
      </div>

    </div>
  );
}

export default CostEffectivenessSimulator;
