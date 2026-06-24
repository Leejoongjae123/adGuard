"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  FilePlus,
  History,
  BookOpen,
  Database,
  Settings,
  Users,
  Server,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

const menuGroups = [
  {
    label: "검수",
    items: [
      { href: "/", icon: LayoutDashboard, label: "대시보드" },
      { href: "/review/new", icon: FilePlus, label: "신규 검수" },
      { href: "/review/history", icon: History, label: "검수 이력" },
    ],
  },
  {
    label: "데이터 관리",
    items: [
      { href: "/data/keywords", icon: BookOpen, label: "금지 키워드 사전" },
      { href: "/data/rag", icon: Database, label: "승인/비승인 히스토리" },
    ],
  },
  {
    label: "설정",
    items: [
      { href: "/settings/guidelines", icon: FileSearch, label: "가이드라인 관리" },
      { href: "/settings/users", icon: Users, label: "사용자 관리" },
      { href: "/settings/system", icon: Server, label: "시스템 설정" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-40 flex h-screen flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
      style={{ background: "var(--color-sidebar)" }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4 border-b border-white/10">
        <Shield className="h-7 w-7 shrink-0 text-blue-400" />
        {!collapsed && (
          <span className="text-sm font-bold text-white tracking-tight">
            AdGuard AI
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-blue-600/20 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && !collapsed && (
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-blue-400" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User / Collapse */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <div className="mb-3 flex items-center gap-2.5 rounded-lg bg-white/5 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              관
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">관리자</p>
              <p className="truncate text-[11px] text-slate-400">admin@company.com</p>
            </div>
            <LogOut className="ml-auto h-4 w-4 shrink-0 cursor-pointer text-slate-400 hover:text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg py-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
