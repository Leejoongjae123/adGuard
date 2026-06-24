"use client";

import { useRouter } from "next/navigation";
import { Download, RefreshCw, MoreHorizontal } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import FilterBar from "../../../components/FilterBar";
import DataTable from "../../../components/DataTable";
import type { Column } from "../../../components/DataTable";
import StatusBadge from "../../../components/StatusBadge";
import RiskBadge from "../../../components/RiskBadge";

interface ReviewRecord {
  id: string;
  thumbnail: string;
  name: string;
  type: string;
  riskScore: number;
  status: string;
  reviewDate: string;
  reviewer: string;
  [key: string]: unknown;
}

const reviewData: ReviewRecord[] = [
  { id: "RV-2024-2041", thumbnail: "", name: "여름 캠페인 15초 v3", type: "영상", riskScore: 82, status: "반려", reviewDate: "2024-12-18", reviewer: "김서연" },
  { id: "RV-2024-2038", thumbnail: "", name: "신제품 런칭 배너 1200x628", type: "이미지", riskScore: 15, status: "통과", reviewDate: "2024-12-18", reviewer: "박지훈" },
  { id: "RV-2024-2035", thumbnail: "", name: "연말 세일 인스트림 30초", type: "영상", riskScore: 67, status: "보류", reviewDate: "2024-12-17", reviewer: "이하은" },
  { id: "RV-2024-2029", thumbnail: "", name: "브랜드 소개 범퍼 6초", type: "영상", riskScore: 8, status: "통과", reviewDate: "2024-12-17", reviewer: "최민수" },
  { id: "RV-2024-2024", thumbnail: "", name: "할인 프로모션 디스커버리", type: "영상", riskScore: 91, status: "반려", reviewDate: "2024-12-16", reviewer: "김서연" },
  { id: "RV-2024-2019", thumbnail: "", name: "건강기능식품 SNS 배너", type: "이미지", riskScore: 45, status: "보류", reviewDate: "2024-12-16", reviewer: "정유진" },
  { id: "RV-2024-2015", thumbnail: "", name: "앱 다운로드 유도 15초", type: "영상", riskScore: 22, status: "통과", reviewDate: "2024-12-15", reviewer: "박지훈" },
  { id: "RV-2024-2010", thumbnail: "", name: "겨울 시즌 키비주얼 배너", type: "이미지", riskScore: 12, status: "통과", reviewDate: "2024-12-15", reviewer: "이하은" },
];

const columns: Column<ReviewRecord>[] = [
  {
    key: "thumbnail",
    header: "썸네일",
    width: "60px",
    render: () => (
      <div className="h-9 w-12 rounded bg-slate-100" />
    ),
  },
  {
    key: "name",
    header: "소재명",
    render: (row) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{row.name}</p>
        <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{row.id}</p>
      </div>
    ),
  },
  {
    key: "type",
    header: "유형",
    width: "80px",
    render: (row) => (
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
          row.type === "영상" ? "bg-blue-50 text-blue-700" : "bg-blue-100 text-blue-700"
        }`}
      >
        {row.type}
      </span>
    ),
  },
  {
    key: "riskScore",
    header: "위험 점수",
    width: "100px",
    render: (row) => <RiskBadge score={row.riskScore} size="sm" />,
  },
  {
    key: "status",
    header: "판정",
    width: "90px",
    render: (row) => <StatusBadge status={row.status} size="sm" />,
  },
  {
    key: "reviewDate",
    header: "검수일",
    width: "110px",
  },
  {
    key: "reviewer",
    header: "담당자",
    width: "80px",
  },
  {
    key: "actions",
    header: "",
    width: "40px",
    render: () => (
      <button className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    ),
  },
];

const filterFields = [
  {
    name: "period",
    label: "기간",
    type: "date" as const,
  },
  {
    name: "media",
    label: "매체",
    type: "select" as const,
    options: [
      { label: "유튜브", value: "youtube" },
      { label: "구글디스플레이", value: "gdn" },
      { label: "네이버", value: "naver" },
      { label: "카카오", value: "kakao" },
      { label: "메타", value: "meta" },
    ],
  },
  {
    name: "risk",
    label: "위험도",
    type: "select" as const,
    options: [
      { label: "안전", value: "safe" },
      { label: "주의", value: "caution" },
      { label: "위험", value: "danger" },
    ],
  },
  {
    name: "verdict",
    label: "판정",
    type: "select" as const,
    options: [
      { label: "통과", value: "pass" },
      { label: "보류", value: "hold" },
      { label: "반려", value: "reject" },
    ],
  },
];

export default function ReviewHistoryPage() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <PageHeader
        title="검수 이력"
        description="과거 검수 건 목록을 조회하고 관리합니다"
        actions={
          <>
            <button
              className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              재검수
            </button>
            <button
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ background: "var(--color-primary)" }}
            >
              <Download className="h-3.5 w-3.5" />
              CSV 내보내기
            </button>
          </>
        }
      />

      <FilterBar
        searchPlaceholder="소재명, 키워드 검색"
        filters={filterFields}
      />

      <DataTable<ReviewRecord>
        columns={columns}
        data={reviewData}
        totalCount={156}
        currentPage={1}
        pageSize={10}
        checkbox
        onRowClick={(row) => router.push(`/review/${row.id}`)}
      />
    </div>
  );
}
