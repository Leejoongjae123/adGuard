import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

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
    <div
      onClick={onClick}
      className={clsx(
        "rounded-xl border p-5 transition-shadow",
        onClick && "cursor-pointer hover:shadow-md"
      )}
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: "var(--color-primary-50)" }}
        >
          <Icon className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
        </div>
        {trend !== undefined && (
          <div
            className={clsx(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "text-blue-700"
                : "text-slate-500"
            )}
            style={{ background: isPositive ? "var(--color-primary-50)" : "var(--color-secondary-50)" }}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {trend}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          {value}
        </p>
        <p
          className="mt-0.5 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label}
        </p>
        {sub && (
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {sub}
          </p>
        )}
      </div>
      {trendLabel && (
        <p
          className="mt-3 text-xs font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          {trendLabel} &rarr;
        </p>
      )}
    </div>
  );
}
