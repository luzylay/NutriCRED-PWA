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
        className="flex items-center justify-center bg-muted/20 border border-dashed rounded-2xl"
        style={{ height }}
      >
        <p className="text-xs text-muted-foreground">
          Sin registros de crecimiento suficientes
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 4, bottom: 0, left: -20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="currentColor"
          strokeOpacity={0.06}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "currentColor", opacity: 0.55 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "currentColor", opacity: 0.55 }}
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
              <div
                className="rounded-xl px-3 py-2 text-xs shadow-xl border"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <p className="font-bold mb-1">{label}</p>
                <p style={{ color: "var(--primary)" }}>
                  Valor:{" "}
                  <span className="font-mono font-semibold">
                    {valEntry.value} {unit}
                  </span>
                </p>
                {p50Entry && (
                  <p className="opacity-60">
                    P50 OMS:{" "}
                    <span className="font-mono">
                      {p50Entry.value} {unit}
                    </span>
                  </p>
                )}
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="p3"
          stackId="oms"
          stroke="none"
          fill="transparent"
          legendType="none"
          isAnimationActive={true}
        />
        <Area
          type="monotone"
          dataKey="band"
          stackId="oms"
          stroke="none"
          fill="#06b6d4"
          fillOpacity={0.09}
          legendType="none"
          isAnimationActive={true}
        />
        <Line
          type="monotone"
          dataKey="p50"
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          dot={false}
          legendType="none"
          isAnimationActive={true}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{
            r: 4,
            fill: "var(--primary)",
            strokeWidth: 2.5,
            stroke: "var(--background)",
          }}
          isAnimationActive={true}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
