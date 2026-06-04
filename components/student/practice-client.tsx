"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Coins, HelpCircle, RotateCcw, Star, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStoredSession } from "@/lib/auth/mock-auth";
import {
  advanceAfterCorrect,
  getAssignedTasks,
  getInitialPlatformState,
  getNextQuestion,
  getOrCreateProgress,
  getRewardWallet,
  getStageProgress,
  LearningQuestion,
  loadPlatformState,
  markWrong,
  PlatformState,
  savePlatformState,
  skipEmptyStage,
  stages
} from "@/lib/learning-store";
import { cn } from "@/lib/utils";

export function PracticeClient() {
  const [state, setState] = useState<PlatformState>(getInitialPlatformState());
  const [studentId, setStudentId] = useState("student-demo");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [bank, setBank] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [guided, setGuided] = useState(false);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const stored = loadPlatformState();
    const id = getStoredSession()?.studentId || "student-demo";
    const task = getAssignedTasks(stored, id)[0];
    if (task) getOrCreateProgress(stored, id, task.id);
    savePlatformState(stored);
    setStudentId(id);
    setState(stored);
  }, []);

  const task = useMemo(() => getAssignedTasks(state, studentId)[0], [state, studentId]);
  const progress = task ? getOrCreateProgress(structuredClone(state) as PlatformState, studentId, task.id) : null;
  const question = task && progress ? getNextQuestion(task, progress) : undefined;
  const currentStage = stages.find((stage) => stage.id === progress?.currentStage) || stages[0];
  const stagePercent = task && progress ? getStageProgress(currentStage.id, task, progress) : 0;
  const wallet = getRewardWallet(state, studentId);
  const currentGuidance = question?.guidance[step];

  useEffect(() => {
    if (question) resetAnswer(question);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  function resetAnswer(activeQuestion = question) {
    setSelectedChoice("");
    setSelectedBlocks([]);
    setBank(activeQuestion?.blocks || []);
    setFeedback("");
    setGuided(false);
    setStep(0);
    setCompleted(false);
  }

  function pickBlock(block: string, index: number) {
    setSelectedBlocks((items) => [...items, block]);
    setBank((items) => items.filter((_, itemIndex) => itemIndex !== index));
    setFeedback("");
  }

  function removeBlock(block: string, index: number) {
    setSelectedBlocks((items) => items.filter((_, itemIndex) => itemIndex !== index));
    setBank((items) => [...items, block]);
  }

  function currentAnswer(activeQuestion: LearningQuestion) {
    if (activeQuestion.mode === "choice") return selectedChoice;
    if (activeQuestion.mode === "letters") return selectedBlocks.join("");
    return selectedBlocks.join(" ");
  }

  function check() {
    if (!question || !task) return;
    if (question.needsAnswer || question.answer === "待老师补充答案") {
      setFeedback("这题还需要老师补充答案，暂时不能判分。");
      return;
    }
    if (!currentAnswer(question)) {
      setFeedback("请先完成作答。");
      return;
    }
    if (normalize(currentAnswer(question)) === normalize(question.answer)) {
      completeQuestion(question);
      return;
    }
    const next = markWrong(state, question.id, studentId, task.id);
    setState(next);
    savePlatformState(next);
    setFeedback("还差一点。分步引导已解锁，但不会直接给最终答案。");
    setGuided(true);
  }

  function completeQuestion(activeQuestion: LearningQuestion) {
    if (!task) return;
    const next = advanceAfterCorrect(state, activeQuestion, studentId, task.id);
    setState(next);
    savePlatformState(next);
    setCompleted(true);
    setGuided(false);
    setFeedback("本题完成。总结已解锁。");
    setShowReward(true);
    window.setTimeout(() => setShowReward(false), 1800);
  }

  function startGuidance() {
    if (!question || !task) return;
    const next = markWrong(state, question.id, studentId, task.id);
    setState(next);
    savePlatformState(next);
    setGuided(true);
    setFeedback("分步引导已开启。最终答案仍需要你自己完成。");
  }

  function answerGuidance(answer: string) {
    if (!currentGuidance) return;
    if (answer !== currentGuidance.answer) {
      setFeedback("这一步还不对，再找关键词。");
      return;
    }
    if (question && step < question.guidance.length - 1) {
      setStep((value) => value + 1);
      setFeedback("这一步答对了，继续下一步。");
      return;
    }
    setGuided(false);
    setFeedback("引导完成。请回到原题，自己完成最终答案。");
  }

  function continueAdventure() {
    resetAnswer();
  }

  function skipStage() {
    if (!task) return;
    setState(skipEmptyStage(state, studentId, task.id));
  }

  if (!task || !progress) {
    return (
      <div className="game-card p-8 text-center">
        <h1 className="text-3xl font-black text-slate-950">老师还没有给你发布学习任务。</h1>
        <p className="mt-3 text-sm font-bold text-slate-500">发布后，你就可以从单词森林开始闯关。</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.35fr_.75fr]">
        <section className="game-card min-h-[460px] p-8">
          <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700">{currentStage.name}</div>
          <h1 className="mt-5 text-3xl font-black text-slate-950">本关暂无内容</h1>
          <p className="mt-3 max-w-xl text-sm font-bold leading-7 text-slate-600">
            这份任务暂时没有解析出{currentStage.short}内容。你可以继续前往下一关，或者请老师在审核区补充内容。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={skipStage} size="lg">继续下一关</Button>
            <Button asChild variant="outline" size="lg"><Link href="/student">返回地图</Link></Button>
          </div>
        </section>
        <Card>
          <CardHeader><CardTitle>当前奖励</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <RewardBox icon={<Star />} label="星星" value={wallet.stars} />
            <RewardBox icon={<Coins />} label="金币" value={wallet.coins} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative grid gap-5 xl:grid-cols-[1.35fr_.75fr]">
      {showReward ? <RewardToast /> : null}
      <section className="game-card relative min-h-[620px] overflow-hidden p-5 sm:p-8">
        <div className="relative z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700">
                {currentStage.name} · {question.title}
              </div>
              <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">{question.prompt}</h1>
              {question.promptHint ? <p className="mt-3 text-base font-bold text-slate-500">{question.promptHint}</p> : null}
            </div>
            <div className="min-w-44">
              <div className="mb-2 flex justify-between text-xs font-black text-slate-500">
                <span>{currentStage.name}进度</span>
                <span>{stagePercent}%</span>
              </div>
              <Progress value={stagePercent} />
            </div>
          </div>

          <AnswerArea
            question={question}
            selectedChoice={selectedChoice}
            setSelectedChoice={setSelectedChoice}
            selectedBlocks={selectedBlocks}
            bank={bank}
            pickBlock={pickBlock}
            removeBlock={removeBlock}
          />

          {guided && currentGuidance ? (
            <div className="mt-8 rounded-[32px] border-2 border-purple-200 bg-purple-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-black text-purple-700">
                <WandSparkles size={20} /> 分步引导 {step + 1}/{question.guidance.length}
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
            {completed ? (
              <Button onClick={continueAdventure} size="lg" className="flex-1">
                继续冒险 <CheckCircle2 size={20} />
              </Button>
            ) : (
              <Button onClick={check} size="lg" className="flex-1">
                检查答案 <CheckCircle2 size={20} />
              </Button>
            )}
            {!completed ? (
              <Button onClick={startGuidance} size="lg" variant="yellow" className="flex-1">
                不会做 <HelpCircle size={20} />
              </Button>
            ) : null}
            <Button onClick={() => resetAnswer()} size="lg" variant="outline">
              <RotateCcw size={20} /> 重排
            </Button>
          </div>

          {feedback ? (
            <div className="mt-5 rounded-3xl bg-yellow-100 p-4 text-sm font-black text-yellow-800">
              {feedback}
            </div>
          ) : null}
        </div>
      </section>

      <aside className="grid content-start gap-5">
        {completed ? (
          <Card>
            <CardHeader><CardTitle>本题结束总结</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <SummaryItem label="这题最关键的突破口" value={question.summary.breakthrough} />
              <SummaryItem label="以后遇到同类题怎么办" value={question.summary.method} />
              <SummaryItem label="易错提醒" value={question.summary.warning} />
              <SummaryItem label="本题知识点" value={question.summary.knowledge} />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-white to-blue-50">
            <CardHeader><CardTitle>独立作答中</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm font-bold leading-7 text-slate-600">
                本题总结会在你最终完成本题后出现。答错或点击“不会做”才会打开分步引导。
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-white to-yellow-50">
          <CardHeader><CardTitle>当前奖励</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <RewardBox icon={<Star />} label="星星" value={wallet.stars} />
            <RewardBox icon={<Coins />} label="金币" value={wallet.coins} />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function AnswerArea({
  question,
  selectedChoice,
  setSelectedChoice,
  selectedBlocks,
  bank,
  pickBlock,
  removeBlock
}: {
  question: LearningQuestion;
  selectedChoice: string;
  setSelectedChoice: (value: string) => void;
  selectedBlocks: string[];
  bank: string[];
  pickBlock: (block: string, index: number) => void;
  removeBlock: (block: string, index: number) => void;
}) {
  if (question.mode === "choice") {
    return (
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {(question.options || []).map((option) => (
          <button
            key={option}
            onClick={() => setSelectedChoice(option)}
            className={cn(
              "rounded-[28px] border-2 bg-white p-5 text-left text-base font-black text-slate-800 shadow-[0_6px_0_#CBD5E1] transition hover:-translate-y-1",
              selectedChoice === option && "border-brand-blue bg-blue-50 text-blue-800"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 rounded-[32px] border-2 border-dashed border-blue-200 bg-white/75 p-4">
        <div className="mb-3 text-xs font-black text-slate-500">你的答案</div>
        <div className="flex min-h-20 flex-wrap gap-3">
          {selectedBlocks.length ? (
            selectedBlocks.map((block, index) => (
              <button
                key={`${block}-${index}`}
                className="rounded-2xl bg-blue-100 px-4 py-3 text-lg font-black text-blue-800 shadow-sm"
                onClick={() => removeBlock(block, index)}
              >
                {block}
              </button>
            ))
          ) : (
            <div className="flex items-center text-sm font-bold text-slate-400">点击下方块组成答案</div>
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
    </>
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

function RewardBox({ icon, label, value }: { icon: React.ReactNode; label: string | number; value: string | number }) {
  return (
    <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-yellow-100 text-yellow-700">{icon}</div>
      <div className="mt-2 text-xs font-black text-slate-500">{label}</div>
      <div className="text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}

function RewardToast() {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 rounded-[28px] border border-lime-200 bg-white/95 p-4 shadow-game backdrop-blur sm:right-8 sm:top-8">
      <div className="text-lg font-black text-slate-950">你又变强了！</div>
      <div className="mt-2 flex gap-3 text-sm font-black">
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">星星 +3</span>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-brand-orange">金币 +60</span>
      </div>
    </div>
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[.?!。！？]/g, "");
}
