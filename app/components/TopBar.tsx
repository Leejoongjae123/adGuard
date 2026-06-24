"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";

const pathLabels: Record<string, string> = {
  "": "대시보드",
  "review": "소재 검수",
  "review/new": "신규 검수",
  "review/history": "검수 이력",
  "data": "데이터 관리",
  "data/keywords": "금지 키워드 사전",
  "data/rag": "승인/비승인 히스토리",
  "settings": "설정",
  "settings/guidelines": "가이드라인 관리",
  "settings/users": "사용자 관리",
  "settings/system": "시스템 설정",
};

export default function TopBar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: { label: string; href: string }[] = [
    { label: "Admin", href: "/" },
  ];

  let accumulated = "";
  for (const seg of segments) {
    accumulated += (accumulated ? "/" : "") + seg;
    const label = pathLabels[accumulated] || seg;
    crumbs.push({ label, href: "/" + accumulated });
  }

  if (segments.length === 0) {
    crumbs.push({ label: "대시보드", href: "/" });
  }

  return (
    <header
      className="flex h-12 items-center justify-between border-b px-6"
      style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
    >
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href + i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
            {i < crumbs.length - 1 ? (
              <Link href={crumb.href} className="text-slate-400 hover:text-slate-600 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium" style={{ color: "var(--color-text)" }}>
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      <Badge
        variant="secondary"
        className="text-xs font-medium"
        style={{ background: "var(--color-primary-light)", color: "#1D4ED8" }}
      >
        관리자
      </Badge>
    </header>
  );
}
