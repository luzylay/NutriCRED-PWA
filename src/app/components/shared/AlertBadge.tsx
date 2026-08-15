import type { AlertLevel } from "../../lib/types";
import { ALERT_CFG } from "../../lib/constants";

interface AlertBadgeProps {
  level: AlertLevel;
  size?: "sm" | "md";
}

export function AlertBadge({ level, size = "sm" }: AlertBadgeProps) {
  const cfg = ALERT_CFG[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-black whitespace-nowrap tracking-tight ${
        size === "sm" ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-xs sm:text-sm"
      } ${cfg.badgeClass}`}
    >
      <span className={`size-2 rounded-full shrink-0 ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  );
}
