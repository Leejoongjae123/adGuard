"use client";

import Link from "next/link";
import { FileText, ShieldCheck, AlertTriangle, Clock, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import KpiCard from "../components/KpiCard";
import DataTable from "../components/DataTable";
import type { Column } from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import RiskBadge from "../components/RiskBadge";

/* ── KPI data ─────────────────────────────────────────── */
const kpis = [
  { icon: FileText, label: "이번 달 검수 건수", value: "248건", trend: 12.4, trendLabel: "전월 대비" },
  { icon: ShieldCheck, label: "비승인 차단 건수", value: "18건", sub: "+3건 (전월 대비)" },
  { icon: AlertTriangle, label: "평균 위험 점수", value: "42점", trend: -5.2, trendLabel: "전월 대비" },
  { icon: Clock, label: "평균 처리 시간", value: "4.3분", sub: "-0.3분 (전월 대비)" },
];

/* ── Bar chart data ───────────────────────────────────── */
const monthlyRisk = [
  { month: "1월", value: 62 },
  { month: "2월", value: 55 },
  { month: "3월", value: 70 },
  { month: "4월", value: 48 },
  { month: "5월", value: 58 },
  { month: "6월", value: 42 },
  { month: "7월", value: 38 },
  { month: "8월", value: 35 },
];
const maxRisk = Math.max(...monthlyRisk.map((d) => d.value));

/* ── Donut chart data ─────────────────────────────────── */
const violations = [
  { label: "오도성", pct: 38, color: "#1E40AF" },
  { label: "과장표현", pct: 28, color: "#2563EB" },
  { label: "금지어", pct: 22, color: "#60A5FA" },
  { label: "UI겹침", pct: 12, color: "#BFDBFE" },
];

function buildConicGradient() {
  let deg = 0;
  const stops: string[] = [];
  for (const v of violations) {
    const end = deg + (v.pct / 100) * 360;
    stops.push(`${v.color} ${deg}deg ${end}deg`);
    deg = end;
  }
  return `conic-gradient(${stops.join(", ")})`;
}

/* ── Table data ───────────────────────────────────────── */
interface ReviewRow {
  name: string;
  type: string;
  riskScore: number;
  status: string;
  date: string;
  reviewer: string;
  [key: string]: unknown;
}

const recentReviews: ReviewRow[] = [
  { name: "신제품 출시 프로모션 A", type: "배너", riskScore: 78, status: "반려", date: "2026-06-23", reviewer: "김민수" },
  { name: "여름 할인 캠페인", type: "영상", riskScore: 25, status: "승인", date: "2026-06-23", reviewer: "이지은" },
  { name: "건강식품 광고 B", type: "배너", riskScore: 85, status: "반려", date: "2026-06-22", reviewer: "박서연" },
  { name: "뷰티 브랜드 리타겟팅", type: "영상", riskScore: 32, status: "승인", date: "2026-06-22", reviewer: "최현우" },
  { name: "금융상품 안내 C", type: "배너", riskScore: 65, status: "심사중", date: "2026-06-21", reviewer: "정다은" },
  { name: "모바일 게임 사전예약", type: "영상", riskScore: 18, status: "승인", date: "2026-06-21", reviewer: "한지호" },
];

const columns: Column<ReviewRow>[] = [
  { key: "name", header: "소재명", width: "28%" },
  { key: "type", header: "유형", width: "8%" },
  {
    key: "riskScore",
    header: "위험점수",
    width: "12%",
    render: (row) => <RiskBadge score={row.riskScore} />,
  },
  {
    key: "status",
    header: "판정",
    width: "10%",
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: "date", header: "검수일", width: "12%" },
  { key: "reviewer", header: "담당자", width: "10%" },
];

/* ── Page ──────────────────────────────────────────────── */
export default function DashboardPage() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="대시보드"
        description={`${dateStr} 기준`}
        actions={
          <Link
            href="/review/new"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-primary)" }}
          >
            <Plus className="h-4 w-4" />
            신규 검수 시작
          </Link>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Bar chart – 비승인 위험 추이 */}
        <div
          className="rounded-xl border p-5"
          style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
          <h2 className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
            비승인 위험 추이
          </h2>
          <div className="flex items-end gap-3" style={{ height: 180 }}>
            {monthlyRisk.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  {d.value}
                </span>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(d.value / maxRisk) * 140}px`,
                    background:
                      d.value >= 60
                        ? "#1E3A8A"
                        : d.value >= 40
                          ? "#2563EB"
                          : "#93C5FD",
                  }}
                />
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                  {d.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut chart – 위반 유형 분포 */}
        <div
          className="rounded-xl border p-5"
          style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
          <h2 className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
            위반 유형 분포
          </h2>
          <div className="flex items-center gap-8">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <div
                className="rounded-full"
                style={{
                  width: 140,
                  height: 140,
                  background: buildConicGradient(),
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                  style={{ background: "var(--color-card)" }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    4유형
                  </span>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-3">
              {violations.map((v) => (
                <div key={v.label} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ background: v.color }}
                  />
                  <span className="text-sm" style={{ color: "var(--color-text)" }}>
                    {v.label}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {v.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent reviews table */}
      <div>
        <h2
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          최근 검수 내역
        </h2>
        <DataTable columns={columns} data={recentReviews} totalCount={248} />
      </div>
    </div>
  );
}
