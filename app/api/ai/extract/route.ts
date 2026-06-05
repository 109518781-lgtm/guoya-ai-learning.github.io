import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    error: "该接口已停用，请使用 /api/ai/parse 调用 DeepSeek 真实解析。"
  }, { status: 410 });
}
