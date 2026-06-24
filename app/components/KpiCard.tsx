import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  trendLabel?: string;
  onClick?: () => void;
}

export default function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  trendLabel,
  onClick,
}: KpiCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card
      onClick={onClick}
      className={clsx(
        "transition-shadow",
        onClick && "cursor-pointer hover:shadow-sm"
      )}
      style={{ borderColor: "var(--color-border)" }}
    >
      <CardContent className="px-5 py-3">
        {/* Top row: muted icon + trend text */}
        <div className="flex items-center justify-between">
          <Icon className="h-3.5 w-3.5" style={{ color: "var(--color-text-muted)" }} />
          {trend !== undefined && (
            <span
              className="text-[11px] font-medium tabular-nums"
              style={{ color: isPositive ? "var(--color-primary)" : "var(--color-text-muted)" }}
            >
              {isPositive ? "+" : ""}{trend}%
            </span>
          )}
        </div>

        {/* Value */}
        <p
          className="mt-2 text-[22px] font-semibold leading-none tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          {value}
        </p>

        {/* Label */}
        <p className="mt-1 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </p>

        {/* Sub / trend label */}
        {(sub || trendLabel) && (
          <p className="mt-1 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
            {sub ?? trendLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
