interface ZScoreBarProps {
  zscore: number;
}

export function ZScoreBar({ zscore }: ZScoreBarProps) {
  const pct = Math.max(0, Math.min(100, ((zscore + 3) / 6) * 100));
  const color = zscore < -2 ? "#ef4444" : zscore < -1 ? "#f59e0b" : "#22c55e";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">−3</span>
        <span className="font-mono font-semibold" style={{ color }}>
          Z = {zscore.toFixed(1)}
        </span>
        <span className="text-muted-foreground">+3</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden relative">
        <div className="absolute inset-0 flex">
          <div className="w-[33.3%] bg-red-200/40 dark:bg-red-900/20" />
          <div className="w-[16.7%] bg-amber-200/40 dark:bg-amber-900/20" />
          <div className="w-[33.3%] bg-emerald-200/30 dark:bg-emerald-900/15" />
          <div className="w-[16.7%] bg-amber-200/40 dark:bg-amber-900/20" />
        </div>
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
