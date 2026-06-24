"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Eye, EyeOff, Copy, Check, ChevronLeft, Clock, User } from "lucide-react";
import RiskBadge from "../../../components/RiskBadge";

type TabKey = "text" | "violations" | "alternatives" | "similar";

const extractedTexts = [
  { time: "00:03", type: "자막", text: "지금 바로 시작하세요! 단 3일만 무료 체험" },
  { time: "00:07", type: "나레이션", text: "업계 최초 특허 기술로 만든 혁신적인 솔루션" },
  { time: "00:12", type: "자막", text: "100% 환불 보장, 부작용 없음" },
  { time: "00:18", type: "나레이션", text: "지금 전화하시면 50% 추가 할인" },
  { time: "00:23", type: "자막", text: "의사도 추천하는 건강기능식품" },
];

const violations = [
  {
    id: 1,
    rule: "금지어 사용",
    category: "표현 규제",
    text: "100% 환불 보장, 부작용 없음",
    keyword: "부작용 없음",
    score: 92,
    detail: "의약품/건강기능식품 광고에서 '부작용 없음' 표현은 식약처 가이드라인 위반",
  },
  {
    id: 2,
    rule: "금지어 사용",
    category: "표현 규제",
    text: "의사도 추천하는 건강기능식품",
    keyword: "의사도 추천",
    score: 88,
    detail: "전문가 추천 표현은 구체적 근거 없이 사용 불가 (표시광고법 제3조)",
  },
  {
    id: 3,
    rule: "오도성 표현",
    category: "LLM 문맥 분석",
    text: "업계 최초 특허 기술로 만든 혁신적인 솔루션",
    keyword: "업계 최초",
    score: 75,
    detail: "최초/최고 등 최상급 표현은 객관적 근거 자료 필요",
  },
  {
    id: 4,
    rule: "과장 광고",
    category: "LLM 문맥 분석",
    text: "지금 전화하시면 50% 추가 할인",
    keyword: "50% 추가 할인",
    score: 65,
    detail: "할인율 표기 시 기준가격 명시 필요 (전자상거래법)",
  },
];

const alternatives = [
  {
    violationId: 1,
    original: "100% 환불 보장, 부작용 없음",
    suggestions: [
      "조건에 따라 환불 가능, 개인차가 있을 수 있음",
      "환불 정책 적용 가능, 자세한 사항은 고객센터 문의",
    ],
  },
  {
    violationId: 2,
    original: "의사도 추천하는 건강기능식품",
    suggestions: [
      "건강기능식품 인증을 받은 제품",
      "식약처 인증 건강기능식품",
    ],
  },
  {
    violationId: 3,
    original: "업계 최초 특허 기술로 만든 혁신적인 솔루션",
    suggestions: [
      "특허 기술 기반의 차별화된 솔루션",
      "독자적 특허 기술을 적용한 솔루션",
    ],
  },
  {
    violationId: 4,
    original: "지금 전화하시면 50% 추가 할인",
    suggestions: [
      "지금 전화하시면 추가 할인 혜택 (정상가 기준)",
      "전화 주문 시 특별 할인 적용 (기준가 대비)",
    ],
  },
];

const similarCases = [
  { id: "RV-2024-1892", name: "건강즙 유튜브 광고 15s", similarity: 94, result: "반려", reason: "'부작용 없음' 금지어 사용" },
  { id: "RV-2024-1756", name: "다이어트 보조제 인스트림", similarity: 87, result: "반려", reason: "전문가 추천 무근거 표현" },
  { id: "RV-2024-1634", name: "건강기능식품 범퍼광고", similarity: 82, result: "보류", reason: "최상급 표현 근거 미비" },
  { id: "RV-2024-1501", name: "비타민 영상광고 30s", similarity: 71, result: "통과", reason: "수정 후 재검수 통과" },
  { id: "RV-2024-1423", name: "홍삼 브랜드 디스커버리", similarity: 68, result: "반려", reason: "과장 할인율 표기" },
];

function highlightKeyword(text: string, keyword: string) {
  const idx = text.indexOf(keyword);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="rounded bg-blue-100 px-0.5 text-blue-800">{keyword}</span>
      {text.slice(idx + keyword.length)}
    </>
  );
}

export default function ReviewDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("violations");
  const [overlayOn, setOverlayOn] = useState(false);
  const [comment, setComment] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(key);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "text", label: "추출 텍스트" },
    { key: "violations", label: "위반 항목" },
    { key: "alternatives", label: "대체 문구" },
    { key: "similar", label: "유사 사례" },
  ];

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Top Bar */}
      <div className="mb-4 flex items-center gap-3">
        <button
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-slate-100"
          style={{ color: "var(--color-text-secondary)" }}
          onClick={() => router.push("/review/history")}
        >
          <ChevronLeft className="h-4 w-4" />
          목록으로
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <h1 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
          Summer_Campaign_15s_v3.mp4
        </h1>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          검수중
        </span>
      </div>

      {/* Split Layout */}
      <div className="flex flex-1 gap-5">
        {/* LEFT Panel (55%) */}
        <div className="flex w-[55%] flex-col gap-4">
          {/* Preview Area */}
          <div
            className="relative overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="relative flex aspect-video items-center justify-center bg-slate-800">
              <Play className="h-16 w-16 text-white/60" />
              {/* YouTube UI Overlay */}
              {overlayOn && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-[20%] border-2 border-dashed border-blue-400 bg-blue-900/30">
                    <span className="absolute left-2 top-1 text-[10px] font-semibold text-blue-300">
                      하단 UI 겹침 영역 (CTA, 진행바)
                    </span>
                  </div>
                  <div className="absolute right-0 top-0 h-[15%] w-[30%] border-2 border-dashed border-blue-300 bg-blue-800/20">
                    <span className="absolute right-2 top-1 text-[10px] font-semibold text-blue-200">
                      건너뛰기 버튼 영역
                    </span>
                  </div>
                </>
              )}
            </div>
            {/* Overlay Toggle */}
            <button
              onClick={() => setOverlayOn(!overlayOn)}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              {overlayOn ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              유튜브 UI 겹침 가이드
            </button>
          </div>

          {/* Timeline Thumbnails */}
          <div className="grid grid-cols-6 gap-2">
            {[
              { time: "00:00", label: "인트로" },
              { time: "00:03", label: "제품 소개" },
              { time: "00:07", label: "특징 설명" },
              { time: "00:12", label: "효과 강조" },
              { time: "00:18", label: "할인 안내" },
              { time: "00:23", label: "CTA" },
            ].map((scene, i) => (
              <div
                key={i}
                className="cursor-pointer overflow-hidden rounded-lg border transition-all hover:border-blue-400 hover:shadow-sm"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex aspect-video items-center justify-center bg-slate-100">
                  <span className="text-[10px] text-slate-400">{scene.label}</span>
                </div>
                <div className="px-1.5 py-1 text-center">
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                    {scene.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Meta Info */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
          >
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>캠페인</p>
                <p className="mt-0.5 font-medium" style={{ color: "var(--color-text)" }}>여름 프로모션 2024</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>매체</p>
                <p className="mt-0.5 font-medium" style={{ color: "var(--color-text)" }}>유튜브</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>광고 형식</p>
                <p className="mt-0.5 font-medium" style={{ color: "var(--color-text)" }}>인스트림 (15초)</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>요청일</p>
                <p className="mt-0.5 font-medium" style={{ color: "var(--color-text)" }}>2024-12-18</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT Panel (45%) */}
        <div className="flex w-[45%] flex-col gap-4">
          {/* Risk Score */}
          <div
            className="rounded-xl border p-5"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
          >
            <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              종합 위험 점수
            </h3>
            <RiskBadge score={82} size="lg" />
            <div className="mt-4 space-y-1.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              <p>① 룰베이스: 금지어 2건</p>
              <p>② LLM 문맥: 오도성 높음</p>
              <p>③ 유사 사례: 3건 (비승인)</p>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex-1 overflow-hidden rounded-xl border"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
          >
            {/* Tab Buttons */}
            <div className="flex border-b" style={{ borderColor: "var(--color-border)" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "border-b-2 text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  style={activeTab === tab.key ? { borderBottomColor: "var(--color-primary)" } : {}}
                >
                  {tab.label}
                  {tab.key === "violations" && (
                    <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-600 text-[10px] text-white">
                      {violations.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-h-[480px] overflow-y-auto p-4">
              {/* 추출 텍스트 Tab */}
              {activeTab === "text" && (
                <div className="space-y-3">
                  {extractedTexts.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-lg border p-3"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[11px] font-mono" style={{ color: "var(--color-text-muted)" }}>
                          {item.time}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            item.type === "자막" ? "bg-blue-50 text-blue-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.type}
                        </span>
                        <p className="mt-1 text-sm" style={{ color: "var(--color-text)" }}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 위반 항목 Tab */}
              {activeTab === "violations" && (
                <div className="space-y-3">
                  {violations.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-lg border p-3"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {v.category}
                          </span>
                          <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                            {v.rule}
                          </span>
                        </div>
                        <RiskBadge score={v.score} size="sm" />
                      </div>
                      <p className="text-sm" style={{ color: "var(--color-text)" }}>
                        {highlightKeyword(v.text, v.keyword)}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {v.detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 대체 문구 Tab */}
              {activeTab === "alternatives" && (
                <div className="space-y-4">
                  {alternatives.map((alt) => (
                    <div
                      key={alt.violationId}
                      className="rounded-lg border p-3"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                        원문
                      </p>
                      <p
                        className="mt-0.5 rounded bg-slate-100 px-2 py-1 text-sm text-slate-500 line-through"
                        style={{ color: "var(--color-text)" }}
                      >
                        {alt.original}
                      </p>
                      <p className="mt-3 text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                        대체 제안
                      </p>
                      <div className="mt-1 space-y-2">
                        {alt.suggestions.map((sug, si) => (
                          <div
                            key={si}
                            className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2"
                          >
                            <span className="text-sm text-blue-700 font-medium">{sug}</span>
                            <div className="flex items-center gap-1">
                              <button
                                className="rounded px-2 py-1 text-xs font-medium text-white transition-colors hover:opacity-90"
                                style={{ background: "var(--color-primary)" }}
                                onClick={() => alert("대체 문구가 적용되었습니다.")}
                              >
                                적용
                              </button>
                              <button
                                onClick={() => handleCopy(sug, `${alt.violationId}-${si}`)}
                                className="rounded border px-2 py-1 text-xs font-medium transition-colors hover:bg-slate-50"
                                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                              >
                                {copiedIdx === `${alt.violationId}-${si}` ? (
                                  <Check className="inline h-3 w-3 text-blue-500" />
                                ) : (
                                  <Copy className="inline h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 유사 사례 Tab */}
              {activeTab === "similar" && (
                <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "var(--color-bg)" }}>
                        <th className="px-3 py-2 text-left text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>소재명</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold" style={{ color: "var(--color-text-secondary)", width: "70px" }}>유사도</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold" style={{ color: "var(--color-text-secondary)", width: "60px" }}>결과</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>사유</th>
                      </tr>
                    </thead>
                    <tbody>
                      {similarCases.map((sc) => (
                        <tr key={sc.id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                          <td className="px-3 py-2" style={{ color: "var(--color-text)" }}>
                            <p className="text-sm">{sc.name}</p>
                            <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{sc.id}</p>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span
                              className={`text-sm font-bold ${
                                sc.similarity >= 90 ? "text-blue-800" : sc.similarity >= 75 ? "text-blue-600" : "text-slate-600"
                              }`}
                            >
                              {sc.similarity}%
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                sc.result === "반려"
                                  ? "bg-slate-700 text-white"
                                  : sc.result === "보류"
                                  ? "bg-slate-200 text-slate-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {sc.result}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            {sc.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div
        className="mt-5 flex items-center gap-3 rounded-xl border p-4"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="코멘트를 입력하세요..."
          className="h-10 flex-1 rounded-lg border px-4 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
        />
        <div className="flex items-center gap-2">
          <button
            className={`h-10 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700 ${verdict === "통과" ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
            onClick={() => {
              setVerdict("통과");
              alert("통과(으)로 판정되었습니다.");
            }}
          >
            통과
          </button>
          <button
            className={`h-10 rounded-lg border px-6 text-sm font-semibold transition-colors hover:bg-slate-50 ${verdict === "보류" ? "ring-2 ring-slate-400 ring-offset-2" : ""}`}
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
            onClick={() => {
              setVerdict("보류");
              alert("보류(으)로 판정되었습니다.");
            }}
          >
            보류
          </button>
          <button
            className={`h-10 rounded-lg bg-slate-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 ${verdict === "반려" ? "ring-2 ring-slate-400 ring-offset-2" : ""}`}
            onClick={() => {
              setVerdict("반려");
              alert("반려(으)로 판정되었습니다.");
            }}
          >
            반려
          </button>
        </div>
      </div>
    </div>
  );
}
