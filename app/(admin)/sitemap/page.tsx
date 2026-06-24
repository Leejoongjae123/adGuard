"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus,
  FileSearch,
  History,
  BookOpen,
  Database,
  Settings,
  Users,
  Server,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import PageHeader from "../../components/PageHeader";

const sitemapGroups = [
  {
    label: "검수",
    description: "광고 소재 검수 및 결과 관리",
    items: [
      {
        href: "/",
        icon: LayoutDashboard,
        title: "대시보드",
        desc: "검수 현황, KPI, 최근 검수 내역 한눈에 확인",
      },
      {
        href: "/review/new",
        icon: FilePlus,
        title: "신규 검수",
        desc: "영상/이미지 소재를 업로드하고 AI 검수 시작",
      },
      {
        href: "/review/RV-2024-001",
        icon: FileSearch,
        title: "검수 결과 상세",
        desc: "위반 항목 확인, 대체 문구 제안, 판정 처리",
      },
      {
        href: "/review/history",
        icon: History,
        title: "검수 이력",
        desc: "과거 검수 건 목록 조회, 필터링, CSV 내보내기",
      },
    ],
  },
  {
    label: "데이터 관리",
    description: "검수 로직에 사용되는 데이터 운영",
    items: [
      {
        href: "/data/keywords",
        icon: BookOpen,
        title: "금지 키워드 사전",
        desc: "룰베이스 검수용 금지 키워드 CRUD, 엑셀 일괄 관리",
      },
      {
        href: "/data/rag",
        icon: Database,
        title: "승인/비승인 히스토리",
        desc: "RAG 학습 데이터 적재, 임베딩 현황, 피드백 루프",
      },
    ],
  },
  {
    label: "설정",
    description: "관리자 전용 시스템 운영",
    items: [
      {
        href: "/settings/guidelines",
        icon: Settings,
        title: "가이드라인 / 프롬프트 관리",
        desc: "LLM 심사 프롬프트 편집, 테스트, 가이드라인 문서 관리",
      },
      {
        href: "/settings/users",
        icon: Users,
        title: "사용자 관리",
        desc: "사용자 초대, 역할 부여, 접근 로그 확인",
      },
      {
        href: "/settings/system",
        icon: Server,
        title: "시스템 설정",
        desc: "API 키 관리, 사용량 모니터링, 처리/보관 정책",
      },
    ],
  },
];

export default function SitemapPage() {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="사이트맵"
        description="AdGuard AI 전체 화면 구조를 확인하고 원하는 페이지로 이동합니다"
      />

      {/* Flow diagram */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
          핵심 플로우
        </p>
        <div className="flex items-center justify-center gap-2 text-sm">
          {["대시보드", "신규 검수", "분석 처리", "결과 상세", "판정", "검수 이력"].map(
            (step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  className="rounded-lg px-3 py-1.5 text-xs font-medium"
                  style={{
                    background: i === 0 || i === 3 ? "var(--color-primary-light)" : "var(--color-secondary-50)",
                    color: i === 0 || i === 3 ? "var(--color-primary)" : "var(--color-text-secondary)",
                  }}
                >
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                )}
              </span>
            )
          )}
        </div>
      </div>

      {/* Groups */}
      {sitemapGroups.map((group) => (
        <div key={group.label}>
          <div className="mb-3">
            <h2 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
              {group.label}
            </h2>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {group.description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "group flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-md",
                    isActive && "ring-2"
                  )}
                  style={{
                    background: "var(--color-card)",
                    borderColor: isActive ? "var(--color-primary)" : "var(--color-border)",
                    ...(isActive ? { ringColor: "var(--color-primary-light)" } : {}),
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors"
                    style={{
                      background: isActive ? "var(--color-primary-light)" : "var(--color-secondary-50)",
                    }}
                  >
                    <item.icon
                      className="h-5 w-5"
                      style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)" }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                        {item.title}
                      </span>
                      <ArrowRight
                        className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        style={{ color: "var(--color-primary)" }}
                      />
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                      {item.desc}
                    </p>
                    <span className="mt-1.5 inline-block text-[11px] font-mono" style={{ color: "var(--color-text-muted)" }}>
                      {item.href}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
