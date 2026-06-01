"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { CheckCircle2, Coins, HelpCircle, RotateCcw, Sparkles, Star, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { practiceQuestion } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PracticeClient() {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [bank, setBank] = useState(practiceQuestion.blocks);
  const [feedback, setFeedback] = useState("");
  const [guided, setGuided] = useState(false);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const builtSentence = selectedBlocks.join(" ");
  const currentGuidance = practiceQuestion.guidance[step];

  const progress = useMemo(() => {
    if (completed) return 100;
    if (guided) return 55 + step * 15;
    return Math.round((selectedBlocks.length / practiceQuestion.blocks.length) * 50);
  }, [completed, guided, selectedBlocks.length, step]);

  function pickBlock(block: string, index: number) {
    setSelectedBlocks((items) => [...items, block]);
    setBank((items) => items.filter((_, itemIndex) => itemIndex !== index));
    setFeedback("");
  }

  function reset() {
    setSelectedBlocks([]);
    setBank(practiceQuestion.blocks);
    setFeedback("");
    setGuided(false);
    setStep(0);
    setCompleted(false);
  }

  function check() {
    if (builtSentence === practiceQuestion.target) {
      setCompleted(true);
      setFeedback("你又变强了！星星和金币已经飞入账户，下一关即将解锁。");
      return;
    }
    setFeedback("还差一点。可以先进入分步引导，但最终答案仍然要你自己完成。");
  }

  function startGuidance() {
    setGuided(true);
    setFeedback("分步引导已开启。这里不会直接给出最终答案。");
  }

  function answerGuidance(answer: string) {
    if (answer !== currentGuidance.answer) {
      setFeedback("这一步还不对，再看看关键词。");
      return;
    }
    if (step < practiceQuestion.guidance.length - 1) {
      setStep((value) => value + 1);
      setFeedback("这一步答对了，继续下一步思考。");
      return;
    }
    setGuided(false);
    setFeedback("引导完成。现在回到原题，请你自己排列最终答案。");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.35fr_.75fr]">
      <section className="game-card relative min-h-[620px] overflow-hidden p-5 sm:p-8">
        {completed ? <CelebrationLayer /> : null}
        <div className="relative z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700">
                {practiceQuestion.levelName} · {practiceQuestion.type}
              </div>
              <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">{practiceQuestion.prompt}</h1>
              <p className="mt-3 text-base font-bold text-slate-500">{practiceQuestion.chinese}</p>
            </div>
            <div className="min-w-40">
              <div className="mb-2 flex justify-between text-xs font-black text-slate-500">
                <span>本题进度</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>

          <div className="mt-8 rounded-[32px] border-2 border-dashed border-blue-200 bg-white/75 p-4">
            <div className="mb-3 text-xs font-black text-slate-500">你的答案</div>
            <div className="flex min-h-20 flex-wrap gap-3">
              {selectedBlocks.length ? (
                selectedBlocks.map((block, index) => (
                  <button
                    key={`${block}-${index}`}
                    className="rounded-2xl bg-blue-100 px-4 py-3 text-lg font-black text-blue-800 shadow-sm"
                    onClick={() => {
                      setSelectedBlocks((items) => items.filter((_, itemIndex) => itemIndex !== index));
                      setBank((items) => [...items, block]);
                    }}
                  >
                    {block}
                  </button>
                ))
              ) : (
                <div className="flex items-center text-sm font-bold text-slate-400">点击下方词块组成句子</div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {bank.map((block, index) => (
              <button
                key={`${block}-${index}`}
                onClick={() => pickBlock(block, index)}
                className="rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-black text-slate-800 shadow-[0_6px_0_#CBD5E1] transition hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_#CBD5E1]"
              >
                {block}
              </button>
            ))}
          </div>

          {guided ? (
            <div className="mt-8 rounded-[32px] border-2 border-purple-200 bg-purple-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-black text-purple-700">
                <WandSparkles size={20} /> 分步引导 {step + 1}/{practiceQuestion.guidance.length}
              </div>
              <h2 className="text-xl font-black text-slate-950">{currentGuidance.prompt}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {currentGuidance.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => answerGuidance(option)}
                    className="rounded-2xl bg-white p-4 text-left text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-1"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={check} size="lg" className="flex-1">
              检查答案 <CheckCircle2 size={20} />
            </Button>
            <Button onClick={startGuidance} size="lg" variant="yellow" className="flex-1">
              不会做 <HelpCircle size={20} />
            </Button>
            <Button onClick={reset} size="lg" variant="outline">
              <RotateCcw size={20} /> 重排
            </Button>
          </div>

          {feedback ? (
            <div
              className={cn(
                "mt-5 rounded-3xl p-4 text-sm font-black",
                completed ? "bg-lime-100 text-lime-700" : "bg-yellow-100 text-yellow-800"
              )}
            >
              {feedback}
            </div>
          ) : null}
        </div>
      </section>

      <aside className="grid gap-5">
        <Card>
          <CardHeader>
            <CardTitle>本题结束总结</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <SummaryItem label="关键突破口" value={practiceQuestion.summary.breakthrough} />
            <SummaryItem label="同类题方法" value={practiceQuestion.summary.method} />
            <SummaryItem label="易错提醒" value={practiceQuestion.summary.warning} />
            <SummaryItem label="知识点" value={practiceQuestion.summary.knowledge} />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-yellow-50">
          <CardHeader>
            <CardTitle>通关奖励</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <RewardBox icon={<Star />} label="星星" value="+3" />
            <RewardBox icon={<Coins />} label="金币" value="+60" />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-black text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-bold leading-6 text-slate-800">{value}</div>
    </div>
  );
}

function RewardBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-yellow-100 text-yellow-700">{icon}</div>
      <div className="mt-2 text-xs font-black text-slate-500">{label}</div>
      <div className="text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}

function CelebrationLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {["bg-brand-green", "bg-brand-yellow", "bg-brand-blue", "bg-brand-red", "bg-brand-purple"].map((color, index) => (
        <span
          key={color}
          className={cn("confetti-dot", color)}
          style={{ left: `${18 + index * 16}%`, top: `${64 - index * 7}%`, animationDelay: `${index * 0.18}s` }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 w-[min(88%,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[36px] border-4 border-brand-yellow bg-white p-7 text-center shadow-game">
        <Sparkles className="mx-auto text-brand-yellow" size={42} />
        <h2 className="mt-3 text-3xl font-black text-slate-950">你又变强了！</h2>
        <p className="mt-3 text-sm font-bold text-slate-500">解锁下一关：语法迷宫</p>
      </div>
    </div>
  );
}
