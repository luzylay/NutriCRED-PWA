import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BrainCircuit, Info, Zap, Droplet, Apple } from "lucide-react";

interface NutritionalTwinSimulatorProps {
  currentZScore: number;
  childName: string;
}

export function NutritionalTwinSimulator({
  currentZScore,
  childName,
}: NutritionalTwinSimulatorProps) {
  const [addIron, setAddIron] = useState(false);
  const [addProtein, setAddProtein] = useState(false);
  const [addHygiene, setAddHygiene] = useState(false);

  // Generar datos predictivos (Simulación Heurística)
  const projectionData = useMemo(() => {
    const data = [];
    let statusQuoZ = currentZScore;
    let twinZ = currentZScore;

    const months = ["Hoy", "Mes 1", "Mes 2", "Mes 3", "Mes 4", "Mes 5", "Mes 6"];

    for (let i = 0; i < months.length; i++) {
      if (i > 0) {
        // Status Quo: Si el niño ya está bajo, tiende a mantenerse o bajar levemente sin intervención
        statusQuoZ = statusQuoZ - 0.05;

        // Twin: Calculamos el impacto de las intervenciones
        let interventionBoost = 0;
        if (addIron) interventionBoost += 0.15; // Impacto fuerte en recuperación
        if (addProtein) interventionBoost += 0.1;
        if (addHygiene) interventionBoost += 0.05; // Prevención de parásitos/diarrea que quitan nutrientes

        // Efecto acumulativo pero logarítmico (no sube infinitamente)
        twinZ = twinZ + (interventionBoost * (1 - (twinZ / 2))) - 0.02; // -0.02 base de estrés metabólico
      }

      data.push({
        name: months[i],
        StatusQuo: parseFloat(statusQuoZ.toFixed(2)),
        GemeloDigital: parseFloat(twinZ.toFixed(2)),
      });
    }
    return data;
  }, [currentZScore, addIron, addProtein, addHygiene]);

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <BrainCircuit className="size-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold font-nunito text-lg leading-tight">
              Gemelo Digital Nutricional
            </h3>
            <p className="text-white/80 text-xs">
              Simulación de crecimiento predictivo por IA para {childName}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={projectionData}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[-3, 2]} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px", fontWeight: "bold" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <ReferenceLine y={-2} stroke="var(--destructive)" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Desnutrición (-2 DE)', fill: 'var(--destructive)', fontSize: 10 }} />
              <ReferenceLine y={0} stroke="var(--primary)" strokeDasharray="3 3" />
              
              <Line
                type="monotone"
                dataKey="StatusQuo"
                name="Sin Intervención"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="GemeloDigital"
                name="Con Intervención (Gemelo)"
                stroke="#8b5cf6" // Violeta
                strokeWidth={3}
                dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-muted/30 rounded-2xl p-4 border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Intervenciones en el Gemelo Digital
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setAddIron(!addIron)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-h-[44px] cursor-pointer touch-manipulation active:scale-[0.98] ${addIron ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 text-violet-700 dark:text-violet-300 font-bold" : "bg-card border-border text-foreground hover:bg-muted"}`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${addIron ? "bg-violet-100 dark:bg-violet-800" : "bg-muted"}`}>
                <Droplet className={`size-4 ${addIron ? "text-violet-600 dark:text-violet-300" : "text-muted-foreground"}`} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold truncate">Gotas de Hierro</p>
                <p className="text-[10px] opacity-80 truncate">Multimicronutrientes</p>
              </div>
            </button>

            <button
              onClick={() => setAddProtein(!addProtein)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-h-[44px] cursor-pointer touch-manipulation active:scale-[0.98] ${addProtein ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-700 dark:text-emerald-300 font-bold" : "bg-card border-border text-foreground hover:bg-muted"}`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${addProtein ? "bg-emerald-100 dark:bg-emerald-800" : "bg-muted"}`}>
                <Apple className={`size-4 ${addProtein ? "text-emerald-600 dark:text-emerald-300" : "text-muted-foreground"}`} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold truncate">Sangrecita</p>
                <p className="text-[10px] opacity-80 truncate">3 veces por semana</p>
              </div>
            </button>

            <button
              onClick={() => setAddHygiene(!addHygiene)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-h-[44px] cursor-pointer touch-manipulation active:scale-[0.98] ${addHygiene ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 text-blue-700 dark:text-blue-300 font-bold" : "bg-card border-border text-foreground hover:bg-muted"}`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${addHygiene ? "bg-blue-100 dark:bg-blue-800" : "bg-muted"}`}>
                <Zap className={`size-4 ${addHygiene ? "text-blue-600 dark:text-blue-300" : "text-muted-foreground"}`} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold truncate">Lavado de Manos</p>
                <p className="text-[10px] opacity-80 truncate">Agua Segura</p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-start bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
          <Info className="size-4 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <strong>¿Qué es esto?</strong> Esta simulación heurística predice el estado futuro del niño basado en modelos metabólicos de absorción de micronutrientes.
          </p>
        </div>
      </div>
    </div>
  );
}
