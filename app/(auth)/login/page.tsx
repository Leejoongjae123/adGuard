"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!employeeId || !password) {
      setError("사번/이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    // TODO: integrate real auth
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1200);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #EFF6FF 0%, #F1F5F9 50%, #EEF2FF 100%)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-8 shadow-lg"
        style={{
          background: "var(--color-card, #FFFFFF)",
          borderColor: "var(--color-border, #E2E8F0)",
        }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ background: "var(--color-primary, #2563EB)" }}
          >
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--color-text, #1E293B)" }}
            >
              AdGuard AI
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-secondary, #64748B)" }}
            >
              광고 소재 검수 AI 솔루션
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--color-text, #1E293B)" }}
            >
              사번 / 이메일
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: "var(--color-text-muted, #94A3B8)" }}
              />
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="사번 또는 이메일을 입력하세요"
                className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  borderColor: "var(--color-border, #E2E8F0)",
                  color: "var(--color-text, #1E293B)",
                  background: "var(--color-bg, #F8FAFC)",
                }}
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--color-text, #1E293B)" }}
            >
              비밀번호
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: "var(--color-text-muted, #94A3B8)" }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  borderColor: "var(--color-border, #E2E8F0)",
                  color: "var(--color-text, #1E293B)",
                  background: "var(--color-bg, #F8FAFC)",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--color-primary, #2563EB)" }}
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-xs transition-colors hover:underline"
            style={{ color: "var(--color-text-muted, #94A3B8)" }}
          >
            로그인에 문제가 있으신가요? 관리자에게 문의
          </a>
        </div>
      </div>
    </div>
  );
}
