"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

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
      style={{ background: "var(--color-bg)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-8 shadow-sm"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: "var(--color-primary)" }}
          >
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
              AdGuard AI
            </h1>
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              광고 소재 검수 AI 솔루션
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="employeeId" style={{ color: "var(--color-text)" }}>
              사번 / 이메일
            </Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--color-text-muted)" }}
              />
              <Input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="사번 또는 이메일을 입력하세요"
                className="h-10 pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" style={{ color: "var(--color-text)" }}>
              비밀번호
            </Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--color-text-muted)" }}
              />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="h-10 pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 w-full gap-2"
            style={{ background: "var(--color-primary)" }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-xs transition-colors hover:underline"
            style={{ color: "var(--color-text-muted)" }}
          >
            로그인에 문제가 있으신가요? 관리자에게 문의
          </a>
        </div>
      </div>
    </div>
  );
}
