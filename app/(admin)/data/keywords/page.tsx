"use client";

import { Upload, Download, Plus, Edit2, Trash2 } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import FilterBar from "../../../components/FilterBar";
import DataTable from "../../../components/DataTable";
import type { Column } from "../../../components/DataTable";
import StatusBadge from "../../../components/StatusBadge";
import { Button } from "../../../components/ui/button";

interface Keyword extends Record<string, unknown> {
  keyword: string;
  category: string;
  risk: string;
  matchType: string;
  status: string;
  createdAt: string;
  modifiedBy: string;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  의료: { bg: "bg-slate-100", text: "text-slate-600" },
  금융: { bg: "bg-slate-100", text: "text-slate-600" },
  과장: { bg: "bg-slate-100", text: "text-slate-600" },
  성인: { bg: "bg-slate-100", text: "text-slate-600" },
  도박: { bg: "bg-slate-100", text: "text-slate-600" },
};

const riskColors: Record<string, string> = {
  높음: "text-red-600 font-semibold",
  보통: "text-slate-600",
  낮음: "text-slate-400",
};

const keywords: Keyword[] = [
  { keyword: "100% 보장", category: "과장", risk: "높음", matchType: "부분일치", status: "활성", createdAt: "2024-01-10", modifiedBy: "김수진" },
  { keyword: "즉시 효과", category: "의료", risk: "높음", matchType: "부분일치", status: "활성", createdAt: "2024-01-09", modifiedBy: "박준혁" },
  { keyword: "무료 치료", category: "의료", risk: "높음", matchType: "완전일치", status: "활성", createdAt: "2024-01-08", modifiedBy: "이지은" },
  { keyword: "확실한 수익", category: "금융", risk: "높음", matchType: "부분일치", status: "활성", createdAt: "2024-01-07", modifiedBy: "최민수" },
  { keyword: "부작용 없음", category: "의료", risk: "높음", matchType: "완전일치", status: "활성", createdAt: "2024-01-06", modifiedBy: "김수진" },
  { keyword: "원금 보장", category: "금융", risk: "높음", matchType: "부분일치", status: "활성", createdAt: "2024-01-05", modifiedBy: "박준혁" },
  { keyword: "성인 전용", category: "성인", risk: "보통", matchType: "완전일치", status: "비활성", createdAt: "2024-01-04", modifiedBy: "이지은" },
  { keyword: "즉시 당첨", category: "도박", risk: "높음", matchType: "정규식", status: "활성", createdAt: "2024-01-03", modifiedBy: "최민수" },
  { keyword: "기적의 치료", category: "의료", risk: "보통", matchType: "부분일치", status: "활성", createdAt: "2024-01-02", modifiedBy: "김수진" },
  { keyword: "고수익 보장", category: "금융", risk: "낮음", matchType: "정규식", status: "비활성", createdAt: "2024-01-01", modifiedBy: "박준혁" },
];

const columns: Column<Keyword>[] = [
  { key: "keyword", header: "키워드/문구" },
  {
    key: "category",
    header: "카테고리",
    render: (row) => {
      const color = categoryColors[row.category as string] || { bg: "bg-slate-50", text: "text-slate-700" };
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color.bg} ${color.text}`}>
          {row.category as string}
        </span>
      );
    },
  },
  {
    key: "risk",
    header: "위험도",
    render: (row) => {
      const color = riskColors[row.risk as string] || "text-slate-600";
      return <span className={`text-xs font-semibold ${color}`}>{row.risk as string}</span>;
    },
  },
  {
    key: "matchType",
    header: "매칭 방식",
    render: (row) => (
      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {row.matchType as string}
      </span>
    ),
  },
  {
    key: "status",
    header: "상태",
    render: (row) => <StatusBadge status={row.status as string} />,
  },
  { key: "createdAt", header: "등록일" },
  { key: "modifiedBy", header: "변경자" },
  {
    key: "actions",
    header: "액션",
    render: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="xs" className="gap-1" style={{ color: "var(--color-text-secondary)" }} onClick={() => alert("키워드 수정 모달이 열립니다.")}>
          <Edit2 className="h-3.5 w-3.5" />
          수정
        </Button>
        <Button variant="ghost" size="xs" className="gap-1 text-slate-500" onClick={() => alert("키워드가 삭제되었습니다.")}>
          <Trash2 className="h-3.5 w-3.5" />
          삭제
        </Button>
      </div>
    ),
  },
];

export default function KeywordsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="금지 키워드 사전"
        description="룰베이스 검수에 사용되는 금지 키워드를 관리합니다"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => alert("엑셀 파일 업로드 기능은 준비 중입니다.")}
            >
              <Upload className="h-4 w-4" />
              엑셀 업로드
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => alert("엑셀 파일을 다운로드합니다.")}
            >
              <Download className="h-4 w-4" />
              엑셀 다운로드
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              style={{ background: "var(--color-primary)" }}
              onClick={() => alert("키워드 추가 모달이 열립니다.")}
            >
              <Plus className="h-4 w-4" />
              키워드 추가
            </Button>
          </>
        }
      />

      <FilterBar
        searchPlaceholder="키워드, 문구 검색"
        filters={[
          {
            name: "category",
            label: "카테고리",
            type: "select",
            options: [
              { label: "의료", value: "의료" },
              { label: "금융", value: "금융" },
              { label: "과장", value: "과장" },
              { label: "성인", value: "성인" },
              { label: "도박", value: "도박" },
            ],
          },
          {
            name: "risk",
            label: "위험도",
            type: "select",
            options: [
              { label: "높음", value: "높음" },
              { label: "보통", value: "보통" },
              { label: "낮음", value: "낮음" },
            ],
          },
          {
            name: "status",
            label: "상태",
            type: "select",
            options: [
              { label: "활성", value: "활성" },
              { label: "비활성", value: "비활성" },
            ],
          },
        ]}
      />

      <DataTable<Keyword>
        columns={columns}
        data={keywords}
        totalCount={324}
        currentPage={1}
        pageSize={10}
        checkbox
      />
    </div>
  );
}
