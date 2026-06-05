import { NextResponse } from "next/server";
import { DeepSeekJsonParseError, parseLearningMaterialWithDeepSeek } from "@/lib/ai/deepseek";

export async function POST(req: Request) {
  console.log("AI parse route called");
  try {
    const body = await req.json();
    const knowledgeText = String(body.knowledgeText || "").trim();
    const questionText = body.questionText ? String(body.questionText) : "";
    const mode = body.mode;
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "未配置 DEEPSEEK_API_KEY，请在 .env.local 中添加" },
        { status: 500 }
      );
    }

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
    if (error instanceof DeepSeekJsonParseError) {
      return NextResponse.json(
        { error: error.message, rawContent: error.rawContent },
        { status: 502 }
      );
    }
    const message = error instanceof Error ? error.message : "AI解析失败";
    const status = message.includes("DEEPSEEK_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
