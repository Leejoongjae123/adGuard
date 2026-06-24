"use client";

import { Database, CheckCircle, XCircle, Calendar, Upload, RefreshCw } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import KpiCard from "../../../components/KpiCard";
import DataTable from "../../../components/DataTable";
import type { Column } from "../../../components/DataTable";
import StatusBadge from "../../../components/StatusBadge";

interface HistoryRow extends Record<string, unknown> {
  text: string;
  result: string;
  reason: string;
  category: string;
  source: string;
  loadedAt: string;
}

const historyData: HistoryRow[] = [
  { text: "지금 바로 신청하면 100만원 즉시 지급! 한정 수량...", result: "반려", reason: "과장 광고 표현 (금액 보장)", category: "과장광고", source: "수동 검수", loadedAt: "2024-01-15" },
  { text: "삼성전자 갤럭시 S24 울트라 공식 스펙 비교 영상", result: "승인", reason: "정상 제품 리뷰 콘텐츠", category: "전자제품", source: "AI 검수", loadedAt: "2024-01-15" },
  { text: "이 약을 먹으면 3일 만에 10kg 감량 가능합니다", result: "반려", reason: "의료법 위반 (효능 과장)", category: "의료/건강", source: "수동 검수", loadedAt: "2024-01-14" },
  { text: "현대자동차 아이오닉6 시승기 - 실제 주행 후기", result: "승인", reason: "정상 자동차 리뷰", category: "자동차", source: "AI 검수", loadedAt: "2024-01-14" },
  { text: "월 500% 수익률 보장! 지금 가입하세요", result: "반려", reason: "금융 과장 광고 (수익률 보장)", category: "금융", source: "AI 검수", loadedAt: "2024-01-13" },
  { text: "나이키 에어맥스 신상 언박싱 및 착화 리뷰", result: "승인", reason: "정상 패션 리뷰 콘텐츠", category: "패션", source: "수동 검수", loadedAt: "2024-01-13" },
  { text: "무료 성인 콘텐츠 제공 - 회원가입만 하면 즉시...", result: "반려", reason: "성인물 광고 (연령 제한 위반)", category: "성인", source: "AI 검수", loadedAt: "2024-01-12" },
  { text: "CJ 비비고 만두 신제품 출시 기념 할인 이벤트", result: "승인", reason: "정상 식품 프로모션", category: "식품", source: "수동 검수", loadedAt: "2024-01-12" },
];

const columns: Column<HistoryRow>[] = [
  {
    key: "text",
    header: "소재 텍스트",
    width: "28%",
    render: (row) => (
      <span className="block max-w-[280px] truncate" title={row.text as string}>
        {row.text as string}
      </span>
    ),
  },
  {
    key: "result",
    header: "결과",
    width: "8%",
    render: (row) => <StatusBadge status={row.result as string} />,
  },
  { key: "reason", header: "사유", width: "22%" },
  { key: "category", header: "카테고리", width: "10%" },
  { key: "source", header: "출처", width: "10%" },
  { key: "loadedAt", header: "적재일", width: "10%" },
];

export default function RagPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="승인/비승인 히스토리"
        description="RAG 학습에 사용되는 과거 심사 데이터를 관리합니다"
        actions={
          <>
            <button
              className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              <Upload className="h-4 w-4" />
              엑셀 업로드
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              <RefreshCw className="h-4 w-4" />
              재인덱싱
            </button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Database} label="총 데이터 건수" value="2,847건" />
        <KpiCard icon={CheckCircle} label="승인 비율" value="72.3%" />
        <KpiCard icon={XCircle} label="비승인 비율" value="27.7%" />
        <KpiCard icon={Calendar} label="마지막 적재일" value="2024-01-15" sub="임베딩 완료" />
      </div>

      {/* Embedding Progress Card */}
      <div
        className="rounded-xl border p-5"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
            임베딩 처리 현황
          </h3>
          <span className="text-xs font-medium text-blue-600">100% 완료</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: "100%", background: "var(--color-primary)" }}
          />
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
          2,847 / 2,847건 처리 완료
        </p>
      </div>

      {/* Feedback Loop Info Card */}
      <div
        className="flex items-center gap-3 rounded-xl border p-4"
        style={{ background: "var(--color-primary-light, #EFF6FF)", borderColor: "var(--color-border)" }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--color-primary-50, #DBEAFE)" }}
        >
          <RefreshCw className="h-4.5 w-4.5" style={{ color: "var(--color-primary)" }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
            피드백 루프
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>
            신규 검수 판정 결과가 자동으로 데이터셋에 누적됩니다
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable<HistoryRow>
        columns={columns}
        data={historyData}
        totalCount={2847}
        currentPage={1}
        pageSize={10}
      />
    </div>
  );
}
