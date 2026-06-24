"use client";

import { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import DataTable from "../../../components/DataTable";
import type { Column } from "../../../components/DataTable";
import StatusBadge from "../../../components/StatusBadge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";

type PromptTab = "시스템 프롬프트" | "판정 프롬프트" | "대체 문구 생성";

interface GuidelineDoc extends Record<string, unknown> {
  name: string;
  version: string;
  status: string;
  date: string;
  action: string;
}

const samplePrompt = `당신은 YouTube 광고 소재 심사 AI입니다.

다음 기준에 따라 광고 소재를 분석하고 위험도를 판정하세요:

1. Google Ads 정책 위반 여부
2. 유튜브 커뮤니티 가이드라인 준수 여부
3. 의료/금융 등 특수 업종 규정 준수 여부
4. 허위·과장 광고 표현 포함 여부
5. 저작권 침해 가능성

각 항목에 대해 0-100 점수를 부여하고,
종합 위험도 점수를 산출하세요.`;

const guidelineDocs: GuidelineDoc[] = [
  { name: "Google Ads 정책 가이드", version: "v3.1", status: "활성", date: "2024-01-05", action: "" },
  { name: "유튜브 커뮤니티 가이드", version: "v2.8", status: "활성", date: "2024-01-03", action: "" },
  { name: "의료광고 심의 기준", version: "v1.4", status: "활성", date: "2023-12-20", action: "" },
  { name: "금융광고 규정", version: "v1.2", status: "비활성", date: "2023-11-15", action: "" },
];

const guidelineColumns: Column<GuidelineDoc>[] = [
  { key: "name", header: "문서명", width: "30%" },
  { key: "version", header: "버전", width: "15%" },
  {
    key: "status",
    header: "상태",
    width: "15%",
    render: (row) => <StatusBadge status={row.status as string} />,
  },
  { key: "date", header: "등록일", width: "20%" },
  {
    key: "action",
    header: "액션",
    width: "20%",
    render: () => (
      <div className="flex items-center gap-2">
        <button className="text-xs font-medium" style={{ color: "var(--color-primary)" }} onClick={() => alert("가이드라인 수정 모달이 열립니다.")}>
          수정
        </button>
        <button className="text-xs font-medium text-slate-500" onClick={() => alert("가이드라인이 삭제되었습니다.")}>삭제</button>
      </div>
    ),
  },
];

export default function GuidelinesPage() {
  const [activeTab, setActiveTab] = useState<PromptTab>("시스템 프롬프트");
  const [promptText, setPromptText] = useState(samplePrompt);
  const [testText, setTestText] = useState("");
  const [cautionThreshold, setCautionThreshold] = useState(31);
  const [dangerThreshold, setDangerThreshold] = useState(71);
  const [correctionFactor, setCorrectionFactor] = useState(1.0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="가이드라인 / 프롬프트 관리"
        description="LLM 심사 프롬프트와 검수 가이드라인을 관리합니다"
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* LEFT: 프롬프트 관리 (60%) */}
        <div
          className="col-span-3 rounded-xl border p-6"
          style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
          <h2 className="mb-4 text-base font-semibold" style={{ color: "var(--color-text)" }}>
            프롬프트 관리
          </h2>

          {/* Tab buttons */}
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as PromptTab)}>
            <TabsList className="mb-4">
              <TabsTrigger value="시스템 프롬프트">시스템 프롬프트</TabsTrigger>
              <TabsTrigger value="판정 프롬프트">판정 프롬프트</TabsTrigger>
              <TabsTrigger value="대체 문구 생성">대체 문구 생성</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Textarea */}
          <Textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="h-64 font-mono text-sm leading-relaxed"
          />

          {/* Version info */}
          <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
            v2.3 | 최종 수정: 2024-01-10 | 수정자: 관리자
          </p>

          {/* Buttons */}
          <div className="mt-4 flex gap-3">
            <Button
              style={{ background: "var(--color-primary)" }}
              onClick={() => alert("프롬프트가 저장되었습니다.")}
            >
              저장
            </Button>
            <Button
              variant="outline"
              onClick={() => alert("이전 버전 목록을 불러옵니다.")}
            >
              이전 버전
            </Button>
            <Button
              variant="outline"
              onClick={() => alert("이전 버전으로 롤백되었습니다.")}
            >
              롤백
            </Button>
          </div>
        </div>

        {/* RIGHT: 프롬프트 테스트 (40%) */}
        <div
          className="col-span-2 rounded-xl border p-6"
          style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
          <h2 className="mb-4 text-base font-semibold" style={{ color: "var(--color-text)" }}>
            프롬프트 테스트
          </h2>

          <Label className="mb-2 block font-medium" style={{ color: "var(--color-text-secondary)" }}>
            테스트 텍스트
          </Label>
          <Textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="테스트할 광고 문구를 입력하세요..."
            className="h-28 text-sm"
          />

          <Button
            className="mt-3 w-full"
            style={{ background: "var(--color-primary)" }}
            onClick={() => alert("테스트가 실행되었습니다. 결과를 확인하세요.")}
          >
            테스트 실행
          </Button>

          {/* Results area */}
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              판정 결과 미리보기
            </h3>
            <div
              className="rounded-lg border p-4"
              style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    종합 위험도 점수
                  </span>
                  <span className="text-lg font-bold text-blue-600">42점</span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full"
                  style={{ background: "var(--color-border)" }}
                >
                  <div className="h-full rounded-full bg-blue-500" style={{ width: "42%" }} />
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                    위반 항목
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      과장 광고 표현 의심 (42점)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      커뮤니티 가이드 준수 (12점)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      저작권 침해 없음 (5점)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 가이드라인 문서 관리 */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h2 className="mb-4 text-base font-semibold" style={{ color: "var(--color-text)" }}>
          가이드라인 문서 관리
        </h2>
        <DataTable columns={guidelineColumns} data={guidelineDocs} totalCount={4} />
      </div>

      {/* 파라미터 설정 */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h2 className="mb-6 text-base font-semibold" style={{ color: "var(--color-text)" }}>
          파라미터 설정
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-sm font-medium" style={{ color: "var(--color-text)" }}>
              위험도 임계값
            </h3>
            <div className="space-y-5">
              {/* 주의 경계 */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label style={{ color: "var(--color-text-secondary)" }}>주의 경계</Label>
                  <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                    {cautionThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cautionThreshold}
                  onChange={(e) => setCautionThreshold(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-500"
                />
              </div>

              {/* 위험 경계 */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label style={{ color: "var(--color-text-secondary)" }}>위험 경계</Label>
                  <span className="text-sm font-semibold text-blue-800">{dangerThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dangerThreshold}
                  onChange={(e) => setDangerThreshold(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-800"
                />
              </div>
            </div>
          </div>

          {/* 점수 보정 계수 */}
          <div className="space-y-1.5">
            <Label style={{ color: "var(--color-text-secondary)" }}>점수 보정 계수</Label>
            <Input
              type="number"
              step="0.1"
              value={correctionFactor}
              onChange={(e) => setCorrectionFactor(Number(e.target.value))}
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
