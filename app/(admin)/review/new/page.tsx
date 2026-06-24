"use client";

import { useState, useRef } from "react";
import { Upload, FileVideo, FileImage, Info, Loader2 } from "lucide-react";
import PageHeader from "../../../components/PageHeader";

interface QueuedFile {
  name: string;
  size: string;
  progress: number;
  status: "대기" | "업로드중" | "완료" | "오류";
}

const sampleFiles: QueuedFile[] = [
  { name: "Summer_Campaign_15s_v3.mp4", size: "124.5 MB", progress: 100, status: "완료" },
  { name: "Display_Banner_1200x628.jpg", size: "2.3 MB", progress: 67, status: "업로드중" },
  { name: "Brand_Intro_30s_final.mov", size: "287.1 MB", progress: 0, status: "대기" },
];

export default function ReviewNewPage() {
  const [files] = useState<QueuedFile[]>(sampleFiles);
  const [campaign, setCampaign] = useState("");
  const [media, setMedia] = useState("");
  const [adFormat, setAdFormat] = useState("");
  const [memo, setMemo] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="신규 검수"
        description="광고 소재를 업로드하고 AI 검수를 시작합니다"
      />

      {/* Upload Drop Zone */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept=".mp4,.mov,.jpg,.png"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            alert(`${e.target.files.length}개 파일이 선택되었습니다.`);
          }
        }}
      />
      <div
        className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-colors hover:border-blue-400 ${isDragOver ? "border-blue-400 bg-blue-50/50" : ""}`}
        style={{ borderColor: isDragOver ? undefined : "var(--color-border)", background: isDragOver ? undefined : "var(--color-card)" }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            alert(`${e.dataTransfer.files.length}개 파일이 드롭되었습니다.`);
          }
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "var(--color-primary-50)" }}
        >
          <Upload className="h-8 w-8" style={{ color: "var(--color-primary)" }} />
        </div>
        <div className="text-center">
          <p className="text-base font-medium" style={{ color: "var(--color-text)" }}>
            소재 파일을 끌어다 놓거나 클릭하여 선택하세요
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            MP4, MOV, JPG, PNG (최대 500MB)
          </p>
        </div>
        <button
          className="rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          파일 선택
        </button>
      </div>

      {/* Meta Input Section */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h3 className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
          소재 정보 입력
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 캠페인명 */}
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              캠페인명
            </label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="캠페인명을 입력하세요"
              className="h-9 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
            />
          </div>

          {/* 매체 */}
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              매체
            </label>
            <select
              value={media}
              onChange={(e) => setMedia(e.target.value)}
              className="h-9 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:border-blue-400"
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
            >
              <option value="">매체를 선택하세요</option>
              <option value="유튜브">유튜브</option>
              <option value="구글디스플레이">구글디스플레이</option>
              <option value="네이버">네이버</option>
              <option value="카카오">카카오</option>
              <option value="메타">메타</option>
            </select>
          </div>

          {/* 광고 형식 */}
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              광고 형식
            </label>
            <select
              value={adFormat}
              onChange={(e) => setAdFormat(e.target.value)}
              className="h-9 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:border-blue-400"
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
            >
              <option value="">형식을 선택하세요</option>
              <option value="범퍼광고">범퍼광고 (6초)</option>
              <option value="인스트림">인스트림 (15~30초)</option>
              <option value="디스커버리">디스커버리</option>
            </select>
          </div>

          {/* 메모 */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              메모
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="검수 관련 메모를 입력하세요"
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
            />
          </div>
        </div>
      </div>

      {/* Upload Queue Table */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <div className="border-b px-5 py-3" style={{ borderColor: "var(--color-border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
            업로드 대기 목록
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
              <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>파일명</th>
              <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-text-secondary)", width: "100px" }}>용량</th>
              <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-text-secondary)", width: "200px" }}>진행률</th>
              <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-text-secondary)", width: "100px" }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                <td className="px-5 py-3" style={{ color: "var(--color-text)" }}>
                  <div className="flex items-center gap-2">
                    {file.name.match(/\.(mp4|mov)$/i) ? (
                      <FileVideo className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileImage className="h-4 w-4 text-blue-500" />
                    )}
                    {file.name}
                  </div>
                </td>
                <td className="px-5 py-3" style={{ color: "var(--color-text-secondary)" }}>{file.size}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          file.progress === 100 ? "bg-blue-600" : "bg-blue-400"
                        }`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {file.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      file.status === "완료"
                        ? "bg-blue-50 text-blue-700"
                        : file.status === "업로드중"
                        ? "bg-blue-100 text-blue-600"
                        : file.status === "오류"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    {file.status === "업로드중" && <Loader2 className="h-3 w-3 animate-spin" />}
                    {file.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <Info className="h-4 w-4" />
          <span>분석은 백그라운드에서 진행되며, 완료 시 알림을 보내드립니다</span>
        </div>
        <button
          className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
          onClick={() => alert("검수가 시작되었습니다. 분석이 완료되면 알림을 보내드립니다.")}
        >
          검수 시작
        </button>
      </div>
    </div>
  );
}
