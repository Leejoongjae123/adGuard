"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileVideo,
  FileImage,
  ImageIcon,
  Info,
  Loader2,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Play,
} from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Progress } from "../../../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

const API_BASE = "/api";

/* ── Shared types ───────────────────────────────────────── */
interface QueuedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "대기" | "업로드중" | "완료" | "오류";
}

interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
}

interface SttResult {
  filename: string;
  language: string;
  duration: number;
  text: string;
  segments: Segment[];
}

interface OcrResult {
  filename: string;
  text: string;
}

type AnalysisStatus = "idle" | "processing" | "done" | "error";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ── Component ──────────────────────────────────────────── */
export default function ReviewNewPage() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [campaign, setCampaign] = useState("");
  const [media, setMedia] = useState("");
  const [adFormat, setAdFormat] = useState("");
  const [memo, setMemo] = useState("");

  /* ── Queue helpers ──────────────────────────────────── */
  const videoQueueId = useRef<string | null>(null);
  const imageQueueId = useRef<string | null>(null);
  const progressTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const addToQueue = (id: string, file: File) => {
    setFiles(prev => [...prev, {
      id,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      progress: 0,
      status: "대기",
    }]);
  };

  const startProgress = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "업로드중", progress: 0 } : f));
    const timer = setInterval(() => {
      setFiles(prev => prev.map(f =>
        f.id === id && f.progress < 85
          ? { ...f, progress: Math.min(85, f.progress + Math.random() * 12) }
          : f
      ));
    }, 400);
    progressTimers.current.set(id, timer);
  };

  const finishProgress = (id: string, success: boolean) => {
    const timer = progressTimers.current.get(id);
    if (timer) { clearInterval(timer); progressTimers.current.delete(id); }
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, status: success ? "완료" : "오류", progress: success ? 100 : f.progress } : f
    ));
  };

  const removeFromQueue = (id: string) => {
    const timer = progressTimers.current.get(id);
    if (timer) { clearInterval(timer); progressTimers.current.delete(id); }
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  /* ── Video analysis state ───────────────────────────── */
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<AnalysisStatus>("idle");
  const [sttResult, setSttResult] = useState<SttResult | null>(null);
  const [videoError, setVideoError] = useState("");
  const [videoDragOver, setVideoDragOver] = useState(false);

  /* ── Image analysis state ───────────────────────────── */
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<AnalysisStatus>("idle");
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [imageError, setImageError] = useState("");
  const [imageDragOver, setImageDragOver] = useState(false);

  /* ── Video handlers ─────────────────────────────────── */
  const handleVideoSelect = (file: File) => {
    if (!/\.(mp4|avi|mkv|mov|wmv|flv|webm)$/i.test(file.name)) {
      setVideoError("지원하지 않는 형식입니다. (MP4, AVI, MKV, MOV, WMV, FLV, WEBM)");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setVideoError("파일 크기가 500MB를 초과합니다.");
      return;
    }
    // remove previous video entry from queue
    if (videoQueueId.current) removeFromQueue(videoQueueId.current);
    const id = `video-${Date.now()}`;
    videoQueueId.current = id;
    addToQueue(id, file);
    setVideoError("");
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setSttResult(null);
    setVideoStatus("idle");
  };

  const handleVideoAnalyze = async () => {
    if (!videoFile) return;
    const id = videoQueueId.current;
    if (!id) return;
    setVideoStatus("processing");
    setVideoError("");
    startProgress(id);
    try {
      const fd = new FormData();
      fd.append("file", videoFile);
      const res = await fetch(`${API_BASE}/transcribe?language=ko`, { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "서버 오류" }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data: SttResult = await res.json();
      finishProgress(id, true);
      setSttResult(data);
      setVideoStatus("done");
    } catch (e) {
      finishProgress(id, false);
      setVideoError(e instanceof Error ? e.message : "분석 중 오류가 발생했습니다.");
      setVideoStatus("error");
    }
  };

  /* ── Image handlers ─────────────────────────────────── */
  const handleImageSelect = (file: File) => {
    if (!/\.(png|jpg|jpeg|gif|bmp|webp|tiff)$/i.test(file.name)) {
      setImageError("지원하지 않는 형식입니다. (PNG, JPG, GIF, BMP, WEBP, TIFF)");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setImageError("파일 크기가 20MB를 초과합니다.");
      return;
    }
    if (imageQueueId.current) removeFromQueue(imageQueueId.current);
    const id = `image-${Date.now()}`;
    imageQueueId.current = id;
    addToQueue(id, file);
    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setOcrResult(null);
    setImageStatus("idle");
  };

  const handleImageAnalyze = async () => {
    if (!imageFile) return;
    const id = imageQueueId.current;
    if (!id) return;
    setImageStatus("processing");
    setImageError("");
    startProgress(id);
    try {
      const fd = new FormData();
      fd.append("file", imageFile);
      const res = await fetch(`${API_BASE}/ocr?language=ko`, { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "서버 오류" }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data: OcrResult = await res.json();
      finishProgress(id, true);
      setOcrResult(data);
      setImageStatus("done");
    } catch (e) {
      finishProgress(id, false);
      setImageError(e instanceof Error ? e.message : "분석 중 오류가 발생했습니다.");
      setImageStatus("error");
    }
  };

  /* ── Drag helpers ───────────────────────────────────── */
  const analysisDropProps = (
    onFile: (f: File) => void,
    setDrag: (v: boolean) => void
  ) => ({
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDrag(true); },
    onDragLeave: () => setDrag(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(f);
    },
  });

  /* ── Status UI ──────────────────────────────────────── */
  const StatusIndicator = ({ status }: { status: AnalysisStatus }) => {
    if (status === "processing") return <Loader2 className="h-4 w-4 animate-spin text-slate-500" />;
    if (status === "done") return <CheckCircle className="h-4 w-4 text-slate-500" />;
    if (status === "error") return <AlertCircle className="h-4 w-4 text-slate-500" />;
    return null;
  };

  const statusLabel: Record<AnalysisStatus, string> = {
    idle: "", processing: "AI 분석 중...", done: "분석 완료", error: "오류 발생",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="신규 검수"
        description="광고 소재를 업로드하고 AI 검수를 시작합니다"
      />

      {/* ━━━ 영상 / 이미지 텍스트 분석 (2컬럼) ━━━━━━━━━━ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ── 영상 소재 (STT) ─────────────────────────── */}
        <div className="rounded-xl border" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-2">
              <FileVideo className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>영상 소재 (STT)</h3>
            </div>
            {videoStatus !== "idle" && (
              <div className="flex items-center gap-1.5">
                <StatusIndicator status={videoStatus} />
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{statusLabel[videoStatus]}</span>
              </div>
            )}
          </div>
          <input ref={videoInputRef} type="file" className="hidden" accept=".mp4,.avi,.mkv,.mov,.wmv,.flv,.webm" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoSelect(f); e.target.value = ""; }} />
          <div className="p-5">
            {!videoFile ? (
              <div onClick={() => videoInputRef.current?.click()} {...analysisDropProps(handleVideoSelect, setVideoDragOver)} className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors" style={{ borderColor: videoDragOver ? "var(--color-primary)" : "var(--color-border)", background: videoDragOver ? "var(--color-primary-50)" : "transparent" }}>
                <Upload className="h-7 w-7" style={{ color: "var(--color-text-muted)" }} />
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>영상 파일을 드래그하거나 클릭</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>MP4, AVI, MKV, MOV 등 (최대 500MB)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video src={videoPreview!} controls className="w-full rounded-lg bg-black" style={{ maxHeight: 260 }} />
                  <button onClick={() => { if (videoQueueId.current) { removeFromQueue(videoQueueId.current); videoQueueId.current = null; } setVideoFile(null); setVideoPreview(null); setSttResult(null); setVideoStatus("idle"); setVideoError(""); }} className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"><X className="h-4 w-4" /></button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileVideo className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate text-sm" style={{ color: "var(--color-text)" }}>{videoFile.name}</span>
                    <span className="shrink-0 text-xs" style={{ color: "var(--color-text-muted)" }}>({(videoFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleVideoAnalyze}
                    disabled={videoStatus === "processing"}
                    className="shrink-0 gap-1.5"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {videoStatus === "processing" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                    {videoStatus === "processing" ? "분석 중..." : "음성 분석"}
                  </Button>
                </div>
                {videoError && <div className="rounded-lg bg-slate-50 px-4 py-2.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>{videoError}</div>}
                {videoStatus === "processing" && (
                  <div className="flex flex-col items-center gap-3 rounded-lg py-8" style={{ background: "var(--color-bg)" }}>
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Whisper AI가 음성을 분석하고 있습니다...</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>영상 길이에 따라 1~3분 소요</p>
                  </div>
                )}
                {sttResult && (
                  <div className="rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
                    <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
                      <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>음성 추출 텍스트</span>
                      <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                        <span>언어: {sttResult.language}</span>
                        <span>길이: {formatTime(sttResult.duration)}</span>
                        <span>{sttResult.segments.length}개 구간</span>
                      </div>
                    </div>
                    <div className="border-b px-4 py-3" style={{ borderColor: "var(--color-border)" }}>
                      <p className="text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>전체 텍스트</p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>{sttResult.text}</p>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {sttResult.segments.map((seg) => (
                        <div key={seg.id} className="flex gap-3 border-b px-4 py-2 last:border-b-0" style={{ borderColor: "var(--color-border)" }}>
                          <div className="flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" style={{ color: "var(--color-text-muted)" }} />
                            <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--color-text-muted)" }}>{formatTime(seg.start)}~{formatTime(seg.end)}</span>
                          </div>
                          <p className="text-sm" style={{ color: "var(--color-text)" }}>{seg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── 썸네일 이미지 (OCR) ─────────────────────── */}
        <div className="rounded-xl border" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>썸네일 이미지 (OCR)</h3>
            </div>
            {imageStatus !== "idle" && (
              <div className="flex items-center gap-1.5">
                <StatusIndicator status={imageStatus} />
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{statusLabel[imageStatus]}</span>
              </div>
            )}
          </div>
          <input ref={imageInputRef} type="file" className="hidden" accept=".png,.jpg,.jpeg,.gif,.bmp,.webp,.tiff" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); e.target.value = ""; }} />
          <div className="p-5">
            {!imageFile ? (
              <div onClick={() => imageInputRef.current?.click()} {...analysisDropProps(handleImageSelect, setImageDragOver)} className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors" style={{ borderColor: imageDragOver ? "var(--color-primary)" : "var(--color-border)", background: imageDragOver ? "var(--color-primary-50)" : "transparent" }}>
                <Upload className="h-7 w-7" style={{ color: "var(--color-text-muted)" }} />
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>이미지 파일을 드래그하거나 클릭</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>PNG, JPG, GIF, BMP, WEBP 등 (최대 20MB)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview!} alt="썸네일 미리보기" className="w-full rounded-lg object-contain" style={{ maxHeight: 260, background: "#f1f5f9" }} />
                  <button onClick={() => { if (imageQueueId.current) { removeFromQueue(imageQueueId.current); imageQueueId.current = null; } setImageFile(null); setImagePreview(null); setOcrResult(null); setImageStatus("idle"); setImageError(""); }} className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"><X className="h-4 w-4" /></button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <ImageIcon className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate text-sm" style={{ color: "var(--color-text)" }}>{imageFile.name}</span>
                    <span className="shrink-0 text-xs" style={{ color: "var(--color-text-muted)" }}>({(imageFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleImageAnalyze}
                    disabled={imageStatus === "processing"}
                    className="shrink-0 gap-1.5"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {imageStatus === "processing" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                    {imageStatus === "processing" ? "분석 중..." : "텍스트 추출"}
                  </Button>
                </div>
                {imageError && <div className="rounded-lg bg-slate-50 px-4 py-2.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>{imageError}</div>}
                {imageStatus === "processing" && (
                  <div className="flex flex-col items-center gap-3 rounded-lg py-8" style={{ background: "var(--color-bg)" }}>
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>OCR AI가 이미지 텍스트를 추출하고 있습니다...</p>
                  </div>
                )}
                {ocrResult && (
                  <div className="rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
                    <div className="border-b px-4 py-2.5" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
                      <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>이미지 추출 텍스트</span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>{ocrResult.text}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ━━━ 소재 정보 입력 ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-xl border p-6" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
        <h3 className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text)" }}>소재 정보 입력</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>캠페인명</Label>
            <Input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="캠페인명을 입력하세요"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>매체</Label>
            <Select value={media} onValueChange={(v) => { if (v !== null) setMedia(v); }}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="매체를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="유튜브">유튜브</SelectItem>
                <SelectItem value="구글디스플레이">구글디스플레이</SelectItem>
                <SelectItem value="네이버">네이버</SelectItem>
                <SelectItem value="카카오">카카오</SelectItem>
                <SelectItem value="메타">메타</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>광고 형식</Label>
            <Select value={adFormat} onValueChange={(v) => { if (v !== null) setAdFormat(v); }}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="형식을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="범퍼광고">범퍼광고 (6초)</SelectItem>
                <SelectItem value="인스트림">인스트림 (15~30초)</SelectItem>
                <SelectItem value="디스커버리">디스커버리</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>메모</Label>
            <Textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="검수 관련 메모를 입력하세요"
              className="h-20 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ━━━ 업로드 대기 목록 ━━━━━━━━━━━━━━━━━━━ */}
      <div className="overflow-hidden rounded-xl border" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
        <div className="border-b px-5 py-3" style={{ borderColor: "var(--color-border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>업로드 대기 목록</h3>
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
                    {file.name.match(/\.(mp4|mov)$/i) ? <FileVideo className="h-4 w-4 text-slate-400" /> : <FileImage className="h-4 w-4 text-slate-400" />}
                    {file.name}
                  </div>
                </td>
                <td className="px-5 py-3" style={{ color: "var(--color-text-secondary)" }}>{file.size}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Progress value={file.progress} className="h-2 flex-1" />
                    <span className="w-10 text-right text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {file.progress.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${file.status === "오류" ? "bg-slate-100 text-slate-700" : "bg-slate-100 text-slate-600"}`}>
                    {file.status === "업로드중" && <Loader2 className="h-3 w-3 animate-spin" />}
                    {file.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ━━━ 하단 액션 ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <Info className="h-4 w-4" />
          <span>분석은 백그라운드에서 진행되며, 완료 시 알림을 보내드립니다</span>
        </div>
        <Button
          className="rounded-xl px-8 py-3 text-sm font-semibold"
          style={{ background: "var(--color-primary)" }}
          onClick={() => alert("검수가 시작되었습니다. 분석이 완료되면 알림을 보내드립니다.")}
        >
          검수 시작
        </Button>
      </div>
    </div>
  );
}
