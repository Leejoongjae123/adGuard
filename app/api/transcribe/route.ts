import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  "https://td8h8vtys3.execute-api.ap-northeast-2.amazonaws.com";

export async function POST(req: NextRequest) {
  const language = req.nextUrl.searchParams.get("language") || "ko";

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ detail: "file is required" }, { status: 400 });
  }

  const body = new FormData();
  body.append("file", file);

  const res = await fetch(`${API_BASE}/transcribe?language=${language}`, {
    method: "POST",
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
