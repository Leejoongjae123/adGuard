"use client";

import { useState } from "react";
import { Key, Server, HardDrive } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Progress } from "../../../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

interface ApiService {
  name: string;
  icon: React.ReactNode;
  status: string;
  maskedKey: string;
}

const apiServices: ApiService[] = [
  { name: "Vision API", icon: <Server className="h-5 w-5" />, status: "연결됨", maskedKey: "sk-****...1234" },
  { name: "Whisper API", icon: <HardDrive className="h-5 w-5" />, status: "연결됨", maskedKey: "sk-****...5678" },
  { name: "LLM (GPT-4)", icon: <Key className="h-5 w-5" />, status: "연결됨", maskedKey: "sk-****...9012" },
  { name: "임베딩 모델", icon: <Server className="h-5 w-5" />, status: "연결됨", maskedKey: "sk-****...3456" },
];

const apiUsage = [
  { name: "Vision", cost: 820000, color: "#3B82F6" },
  { name: "Whisper", cost: 450000, color: "#60A5FA" },
  { name: "LLM", cost: 980000, color: "#1E40AF" },
  { name: "Embedding", cost: 200000, color: "#93C5FD" },
];

const totalCost = 2450000;
const budget = 5000000;
const budgetPercent = Math.round((totalCost / budget) * 100);

export default function SystemPage() {
  const [uploadLimit, setUploadLimit] = useState(500);
  const [concurrency, setConcurrency] = useState(5);
  const [timeout, setTimeout_] = useState(300);
  const [retryCount, setRetryCount] = useState(3);
  const [retentionPeriod, setRetentionPeriod] = useState("90");
  const [autoDelete, setAutoDelete] = useState(true);

  const maxCost = Math.max(...apiUsage.map((u) => u.cost));

  return (
    <div className="space-y-6">
      <PageHeader
        title="시스템 설정"
        description="API 키 및 시스템 운영 정책을 관리합니다"
      />

      {/* API 연결 상태 */}
      <div>
        <h2 className="mb-4 text-base font-semibold" style={{ color: "var(--color-text)" }}>
          API 연결 상태
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {apiServices.map((service) => (
            <div
              key={service.name}
              className="rounded-xl border p-5"
              style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
                >
                  {service.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    {service.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                    <span className="text-xs text-slate-600">{service.status}</span>
                  </div>
                </div>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <Key className="h-3.5 w-3.5" style={{ color: "var(--color-text-muted)" }} />
                <span className="font-mono text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {service.maskedKey}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => alert(`${service.name} 연결 테스트 성공`)}
              >
                연결 테스트
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* API 사용량 */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h2 className="mb-5 text-base font-semibold" style={{ color: "var(--color-text)" }}>
          API 사용량
        </h2>

        <div className="space-y-4">
          {apiUsage.map((item) => (
            <div key={item.name} className="flex items-center gap-4">
              <span
                className="w-20 text-sm font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {item.name}
              </span>
              <div className="flex-1">
                <div
                  className="h-6 overflow-hidden rounded-md"
                  style={{ background: "var(--color-bg)" }}
                >
                  <div
                    className="flex h-full items-center rounded-md px-2"
                    style={{
                      width: `${(item.cost / maxCost) * 100}%`,
                      background: item.color,
                      minWidth: "40px",
                    }}
                  >
                    <span className="text-xs font-medium text-white">
                      ₩{item.cost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
              총 사용량
            </span>
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              ₩{totalCost.toLocaleString()} / ₩{budget.toLocaleString()} (예산)
            </span>
          </div>
          <Progress value={budgetPercent} className="h-3" />
          <p className="mt-1 text-right text-xs" style={{ color: "var(--color-text-muted)" }}>
            {budgetPercent}% 사용
          </p>
        </div>
      </div>

      {/* 처리 정책 */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h2 className="mb-5 text-base font-semibold" style={{ color: "var(--color-text)" }}>
          처리 정책
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div className="space-y-1.5">
            <Label style={{ color: "var(--color-text-secondary)" }}>업로드 용량 제한</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={uploadLimit}
                onChange={(e) => setUploadLimit(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>MB</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: "var(--color-text-secondary)" }}>동시 처리 수</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={concurrency}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>건</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: "var(--color-text-secondary)" }}>타임아웃</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={timeout}
                onChange={(e) => setTimeout_(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>초</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: "var(--color-text-secondary)" }}>재시도 횟수</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={retryCount}
                onChange={(e) => setRetryCount(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>회</span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Button
            style={{ background: "var(--color-primary)" }}
            onClick={() => alert("설정이 저장되었습니다.")}
          >
            저장
          </Button>
        </div>
      </div>

      {/* 데이터 보관 정책 */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h2 className="mb-5 text-base font-semibold" style={{ color: "var(--color-text)" }}>
          데이터 보관 정책
        </h2>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label style={{ color: "var(--color-text-secondary)" }}>소재 보관 기간</Label>
            <Select value={retentionPeriod} onValueChange={(v) => { if (v !== null) setRetentionPeriod(v); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30일</SelectItem>
                <SelectItem value="60">60일</SelectItem>
                <SelectItem value="90">90일</SelectItem>
                <SelectItem value="180">180일</SelectItem>
                <SelectItem value="365">365일</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Label style={{ color: "var(--color-text-secondary)" }}>자동 삭제</Label>
            <Switch checked={autoDelete} onCheckedChange={setAutoDelete} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {autoDelete ? "활성" : "비활성"}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <Button
            style={{ background: "var(--color-primary)" }}
            onClick={() => alert("설정이 저장되었습니다.")}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
