"use client";

import PageHeader from "../../../components/PageHeader";
import DataTable from "../../../components/DataTable";
import type { Column } from "../../../components/DataTable";
import StatusBadge from "../../../components/StatusBadge";

interface UserRow extends Record<string, unknown> {
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  action: string;
}

interface AccessLog extends Record<string, unknown> {
  time: string;
  user: string;
  activity: string;
  ip: string;
}

const users: UserRow[] = [
  { name: "김영수", email: "yskim@company.com", role: "관리자", status: "활성", lastLogin: "2024-01-10 09:32", action: "" },
  { name: "박지영", email: "jypark@company.com", role: "마케터", status: "활성", lastLogin: "2024-01-10 08:15", action: "" },
  { name: "이민호", email: "mhlee@company.com", role: "마케터", status: "활성", lastLogin: "2024-01-09 17:45", action: "" },
  { name: "최수연", email: "sychoi@company.com", role: "관리자", status: "활성", lastLogin: "2024-01-09 14:20", action: "" },
  { name: "정대현", email: "dhjung@company.com", role: "마케터", status: "비활성", lastLogin: "2023-12-28 10:05", action: "" },
  { name: "한소희", email: "shhan@company.com", role: "마케터", status: "활성", lastLogin: "2024-01-10 07:50", action: "" },
];

const accessLogs: AccessLog[] = [
  { time: "2024-01-10 09:32:15", user: "김영수", activity: "로그인", ip: "192.168.1.101" },
  { time: "2024-01-10 09:28:43", user: "박지영", activity: "소재 열람 (CR-2024-0156)", ip: "192.168.1.105" },
  { time: "2024-01-10 09:15:22", user: "이민호", activity: "키워드 수정 (KW-광고001)", ip: "192.168.1.110" },
  { time: "2024-01-10 08:55:10", user: "한소희", activity: "심사 결과 승인 (CR-2024-0152)", ip: "192.168.1.108" },
  { time: "2024-01-10 08:15:33", user: "박지영", activity: "로그인", ip: "192.168.1.105" },
];

const roleBadge = (role: string) => {
  const isAdmin = role === "관리자";
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        background: isAdmin ? "#DBEAFE" : "#F1F5F9",
        color: isAdmin ? "#1D4ED8" : "#334155",
      }}
    >
      {role}
    </span>
  );
};

const userColumns: Column<UserRow>[] = [
  { key: "name", header: "이름", width: "14%" },
  { key: "email", header: "이메일", width: "22%" },
  {
    key: "role",
    header: "역할",
    width: "12%",
    render: (row) => roleBadge(row.role as string),
  },
  {
    key: "status",
    header: "상태",
    width: "12%",
    render: (row) => <StatusBadge status={row.status as string} />,
  },
  { key: "lastLogin", header: "마지막 로그인", width: "20%" },
  {
    key: "action",
    header: "액션",
    width: "20%",
    render: () => (
      <div className="flex items-center gap-3">
        <button className="text-xs font-medium" style={{ color: "var(--color-primary)" }} onClick={() => alert("사용자 정보 수정 모달이 열립니다.")}>
          수정
        </button>
        <button className="text-xs font-medium text-slate-500" onClick={() => alert("사용자가 비활성화되었습니다.")}>비활성화</button>
      </div>
    ),
  },
];

const logColumns: Column<AccessLog>[] = [
  { key: "time", header: "시간", width: "25%" },
  { key: "user", header: "사용자", width: "15%" },
  { key: "activity", header: "활동", width: "40%" },
  { key: "ip", header: "IP 주소", width: "20%" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="사용자 관리"
        description="시스템 사용자 및 권한을 관리합니다"
        actions={
          <button
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ background: "var(--color-primary)" }}
            onClick={() => alert("사용자 초대 모달이 열립니다.")}
          >
            + 사용자 초대
          </button>
        }
      />

      <DataTable columns={userColumns} data={users} totalCount={6} />

      {/* 접근 로그 */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h2 className="mb-4 text-base font-semibold" style={{ color: "var(--color-text)" }}>
          최근 접근 로그
        </h2>
        <DataTable columns={logColumns} data={accessLogs} totalCount={1243} />
      </div>
    </div>
  );
}
