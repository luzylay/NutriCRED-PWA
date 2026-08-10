import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { GrowthPoint } from "../../lib/types";

interface GrowthChartProps {
  data: GrowthPoint[];
  height?: number;
  unit?: string;
}

export function GrowthChart({
  data,
  height = 180,
  unit = "kg",
}: GrowthChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-muted/20 border border-dashed rounded-2xl p-4 text-center"
        style={{ height }}
      >
        <p className="text-xs text-muted-foreground font-medium">
          Sin registros de crecimiento suficientes para graficar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <div className="w-full relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 12, bottom: 0, left: -16 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.08}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "currentColor", opacity: 0.7 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "currentColor", opacity: 0.7 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const valEntry = payload.find((p) => p.dataKey === "value");
                const p50Entry = payload.find((p) => p.dataKey === "p50");
                if (!valEntry) return null;
                return (
                  <div className="rounded-xl px-3 py-2 text-xs shadow-2xl border bg-card/95 backdrop-blur-md border-border text-foreground space-y-1">
                    <p className="font-extrabold text-primary border-b border-border/50 pb-1">{label}</p>
                    <p className="font-bold flex items-center justify-between gap-3">
                      <span>Peso registrado:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">
                        {valEntry.value} {unit}
                      </span>
                    </p>
                    {p50Entry && (
                      <p className="text-muted-foreground flex items-center justify-between gap-3">
                        <span>Mediana OMS (P50):</span>
                        <span className="font-mono">{p50Entry.value} {unit}</span>
                      </p>
                    )}
                  </div>
                );
              }}
            />
            {/* Transparent base for P3 */}
            <Area
              type="monotone"
              dataKey="p3"
              stackId="oms"
              stroke="none"
              fill="transparent"
              legendType="none"
              isAnimationActive={true}
            />
            {/* Healthy OMS Normal Zone (-2 SD to +2 SD) */}
            <Area
              type="monotone"
              dataKey="band"
              stackId="oms"
              stroke="#10b981"
              strokeWidth={0.5}
              strokeDasharray="2 2"
              fill="#10b981"
              fillOpacity={0.15}
              legendType="none"
              isAnimationActive={true}
            />
            {/* OMS Median Line P50 */}
            <Line
              type="monotone"
              dataKey="p50"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              legendType="none"
              isAnimationActive={true}
            />
            {/* Measured Child Weight Line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{
                r: 4.5,
                fill: "var(--primary)",
                strokeWidth: 2,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 6.5,
                fill: "var(--primary)",
                strokeWidth: 3,
                stroke: "#ffffff",
              }}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-muted-foreground flex-wrap pt-1 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-xs bg-emerald-500/30 border border-emerald-500"></span>
          <span>Rango Normal OMS (-2 a +2 SD)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-b border-dashed border-slate-500"></span>
          <span>Mediana OMS (P50)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary"></span>
          <span>Medición Registrada</span>
        </div>
      </div>
    </div>
  );
}
