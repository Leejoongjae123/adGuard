import clsx from "clsx";

interface RiskBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/**
 * Risk score visualised in a blue-monochrome scale.
 *   0-30  → light blue   (안전)
 *  31-70  → medium blue   (주의)
 *  71-100 → dark navy     (위험)
 */
function getRiskLevel(score: number) {
  if (score <= 30)
    return { label: "안전", text: "text-blue-500", bg: "bg-blue-50", bar: "bg-blue-400" };
  if (score <= 70)
    return { label: "주의", text: "text-blue-700", bg: "bg-blue-100", bar: "bg-blue-600" };
  return { label: "위험", text: "text-blue-900", bar: "bg-blue-900", bg: "bg-blue-100" };
}

export default function RiskBadge({ score, size = "sm", showLabel = true }: RiskBadgeProps) {
  const risk = getRiskLevel(score);

  if (size === "lg") {
    return (
      <div className={clsx("flex flex-col items-center gap-2 rounded-xl p-5", risk.bg)}>
        <span className={clsx("text-3xl font-bold", risk.text)}>{score}%</span>
        <div className="h-2 w-full max-w-[120px] rounded-full bg-blue-200">
          <div
            className={clsx("h-full rounded-full transition-all", risk.bar)}
            style={{ width: `${score}%` }}
          />
        </div>
        {showLabel && (
          <span className={clsx("text-sm font-medium", risk.text)}>{risk.label}</span>
        )}
      </div>
    );
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full font-medium",
        risk.bg,
        risk.text,
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {score}%
      {showLabel && <span className="text-[10px] opacity-70">({risk.label})</span>}
    </span>
  );
}
