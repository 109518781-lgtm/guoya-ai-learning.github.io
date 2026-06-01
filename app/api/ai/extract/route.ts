import { NextResponse } from "next/server";
import { aiProvider } from "@/lib/ai/provider";

export async function POST() {
  const result = await aiProvider.extractLearningTask({
    knowledgeFileIds: ["mock-knowledge-file"],
    questionFileIds: ["mock-question-file"],
    subject: "english"
  });

  return NextResponse.json({
    provider: aiProvider.name,
    mode: "mock",
    result
  });
}
