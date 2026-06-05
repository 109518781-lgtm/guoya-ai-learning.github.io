import { NextRequest, NextResponse } from "next/server";
import { parseLearningMaterialWithDeepSeek } from "@/lib/ai/deepseek";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const knowledgeText = String(body.knowledgeText || "").trim();
    const questionText = body.questionText ? String(body.questionText) : "";
    const mode = body.mode;

    if (mode !== "generate_from_material") {
      return NextResponse.json({ error: "mode 必须为 generate_from_material" }, { status: 400 });
    }
    if (!knowledgeText && !questionText.trim()) {
      return NextResponse.json({ error: "请先上传或粘贴学习资料" }, { status: 400 });
    }

    const result = await parseLearningMaterialWithDeepSeek({
      knowledgeText,
      questionText,
      mode
    });

    return NextResponse.json({
      provider: "deepseek",
      mode,
      result
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI解析失败";
    const status = message.includes("DEEPSEEK_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
