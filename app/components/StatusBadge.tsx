import clsx from "clsx";

export type StatusType =
  | "접수" | "심사중" | "QC대기" | "승인" | "반려"
  | "환급완료" | "업로드됨" | "분석중" | "검수완료"
  | "통과" | "보류" | "매체등록완료" | "활성" | "비활성";

/**
 * Monochromatic status badge.
 * All badges share the same muted background (--color-primary-50).
 * Only the small dot carries a functional color cue.
 */
const dotColor: Record<string, string> = {
  접수: "bg-blue-600",
  업로드됨: "bg-blue-600",
  심사중: "bg-blue-400",
  분석중: "bg-blue-400",
  QC대기: "bg-slate-400",
  검수완료: "bg-blue-800",
  승인: "bg-blue-700",
  통과: "bg-blue-700",
  활성: "bg-blue-700",
  매체등록완료: "bg-blue-700",
  반려: "bg-slate-500",
  비활성: "bg-slate-300",
  보류: "bg-slate-400",
  환급완료: "bg-blue-500",
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const dot = dotColor[status] || "bg-slate-400";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
      style={{
        background: "var(--color-primary-50)",
        color: "var(--color-text-secondary)",
      }}
    >
      <span className={clsx("inline-block h-1.5 w-1.5 rounded-full", dot)} />
      {status}
    </span>
  );
}
