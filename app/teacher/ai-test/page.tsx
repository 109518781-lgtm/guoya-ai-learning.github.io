"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherAiTestPage() {
  const [knowledgeText, setKnowledgeText] = useState("Tom is in the library. He is looking for his English book. He should read carefully.");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [rawContent, setRawContent] = useState("");

  async function testDeepSeek() {
    if (!knowledgeText.trim()) {
      setError("请先粘贴学习资料内容。");
      setResult(null);
      setRawContent("");
      return;
    }
    setIsLoading(true);
    setError("");
    setResult(null);
    setRawContent("");
    try {
      const response = await fetch("/api/ai/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          knowledgeText,
          questionText: "",
          mode: "generate_from_material"
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        setRawContent(payload.rawContent || "");
        throw new Error(payload.error || `请求失败，HTTP ${response.status}`);
      }
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "DeepSeek解析失败");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo />
          <Button asChild variant="outline">
            <Link href="/teacher">返回教师端</Link>
          </Button>
        </header>

        <Card className="hover:translate-y-0">
          <CardHeader>
            <CardTitle>DeepSeek AI解析测试</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <textarea
              value={knowledgeText}
              onChange={(event) => setKnowledgeText(event.target.value)}
              className="min-h-48 w-full rounded-[24px] border-2 border-slate-200 bg-white p-4 text-sm font-bold leading-7 outline-none focus:border-brand-green"
              placeholder="粘贴学习资料内容"
            />
            <Button onClick={testDeepSeek} disabled={isLoading} size="lg" variant="yellow">
              {isLoading ? "解析中..." : "测试DeepSeek解析"}
            </Button>

            {error ? (
              <div className="rounded-3xl bg-red-50 p-4 text-sm font-black leading-7 text-red-700">
                {error}
              </div>
            ) : null}

            {rawContent ? (
              <div className="rounded-3xl bg-yellow-50 p-4">
                <div className="text-sm font-black text-yellow-800">DeepSeek原始返回文本</div>
                <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-xs font-bold leading-6 text-yellow-900">{rawContent}</pre>
              </div>
            ) : null}

            {result ? (
              <div className="rounded-3xl bg-slate-950 p-4 text-white">
                <div className="text-sm font-black text-lime-300">接口返回 JSON</div>
                <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap text-xs leading-6">{JSON.stringify(result, null, 2)}</pre>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
