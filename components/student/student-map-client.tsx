"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Castle, Factory, Flag, Lock, Mountain, Star, TentTree, TowerControl, Trees, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getActiveTask,
  getInitialPlatformState,
  getStageProgress,
  isStageUnlocked,
  loadPlatformState,
  PlatformState,
  stages
} from "@/lib/learning-store";
import { cn } from "@/lib/utils";

const sceneIcons = {
  vocab: Trees,
  phrase: TentTree,
  sentence: Factory,
  grammar: Castle,
  reading: Waves,
  exam: Flag,
  wrong: TowerControl
};

const nodePositions = [
  "left-[8%] top-[18%]",
  "left-[30%] top-[34%]",
  "left-[54%] top-[16%]",
  "left-[75%] top-[36%]",
  "left-[58%] top-[63%]",
  "left-[34%] top-[72%]",
  "left-[10%] top-[58%]"
];

export function StudentMapClient() {
  const [state, setState] = useState<PlatformState>(getInitialPlatformState());

  useEffect(() => {
    setState(loadPlatformState());
  }, []);

  const task = useMemo(() => getActiveTask(state), [state]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.55fr_.8fr]">
      <section className="relative min-h-[720px] overflow-hidden rounded-[40px] border border-lime-200 bg-gradient-to-br from-[#DDF9C8] via-[#BEEFB5] to-[#9DE8FF] p-5 shadow-game">
        <MapDecorations />

        <div className="relative z-20 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge variant="green">当前任务 · {task?.title || "等待老师发布"}</Badge>
            <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-5xl">冒险学习地图</h1>
            <p className="mt-3 max-w-2xl text-sm font-black leading-7 text-slate-700/80">
              沿着小路通关英语考试：每一关 100% 正确后，下一关才会点亮。
            </p>
          </div>
          <Button asChild size="lg" variant="blue">
            <Link href="/student/practice">继续冒险</Link>
          </Button>
        </div>

        <svg className="absolute inset-0 z-10 h-full w-full" viewBox="0 0 1000 720" preserveAspectRatio="none">
          <path
            d="M120 170 C230 285 315 235 400 335 C520 475 740 230 810 370 C895 540 690 585 585 535 C435 465 360 665 225 575 C110 500 115 365 230 338"
            fill="none"
            stroke="rgba(255,255,255,.92)"
            strokeLinecap="round"
            strokeWidth="30"
          />
          <path
            d="M120 170 C230 285 315 235 400 335 C520 475 740 230 810 370 C895 540 690 585 585 535 C435 465 360 665 225 575 C110 500 115 365 230 338"
            fill="none"
            stroke="rgba(88,204,2,.45)"
            strokeDasharray="12 18"
            strokeLinecap="round"
            strokeWidth="6"
          />
        </svg>

        <div className="absolute inset-0 z-20">
          {stages.map((stage, index) => {
            const unlocked = task ? isStageUnlocked(stage.id, task, state.progress) : false;
            const percent = task ? getStageProgress(stage.id, task, state.progress) : 0;
            const completed = percent === 100;
            const current = state.progress.currentStage === stage.id;
            const Icon = sceneIcons[stage.id];
            return (
              <Link
                key={stage.id}
                href={unlocked ? "/student/practice" : "#"}
                className={cn(
                  "absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-[32px] border-4 bg-white/90 p-3 text-center shadow-game transition hover:scale-105 sm:w-40",
                  nodePositions[index],
                  completed && "border-brand-green bg-lime-50",
                  current && "border-brand-blue ring-8 ring-blue-300/35",
                  !unlocked && "border-slate-200 bg-slate-100 grayscale"
                )}
              >
                <div className={cn(
                  "mx-auto grid h-16 w-16 place-items-center rounded-[24px] text-white shadow-[0_6px_0_rgba(0,0,0,.16)]",
                  completed ? "bg-brand-green" : current ? "bg-brand-blue" : unlocked ? "bg-brand-yellow text-slate-900" : "bg-slate-400"
                )}>
                  {unlocked ? <Icon size={34} strokeWidth={2.6} /> : <Lock size={30} />}
                </div>
                <h3 className="mt-3 text-base font-black text-slate-950">{stage.name}</h3>
                <div className="mt-2 flex justify-center gap-1">
                  {Array.from({ length: 3 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={15}
                      className={completed ? "fill-brand-yellow text-yellow-600" : "text-slate-300"}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs font-black text-slate-500">
                  {completed ? "已点亮" : current ? "发光挑战中" : unlocked ? "可挑战" : "未解锁"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <aside className="grid content-start gap-5">
        <Card>
          <CardHeader>
            <CardTitle>今日任务</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {stages.slice(0, 4).map((stage) => (
              <div key={stage.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="mb-2 flex justify-between text-sm font-black text-slate-700">
                  <span>{stage.name}</span>
                  <span>{task ? getStageProgress(stage.id, task, state.progress) : 0}%</span>
                </div>
                <Progress value={task ? getStageProgress(stage.id, task, state.progress) : 0} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-yellow-50">
          <CardHeader>
            <CardTitle>奖励状态</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Reward label="星星" value={state.progress.stars} />
            <Reward label="金币" value={state.progress.coins} />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-red-50">
          <CardHeader>
            <CardTitle>错题修复</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-bold leading-7 text-slate-600">
              当前错题 {state.progress.wrongQuestionIds.length} 道，修复 {state.progress.repairedQuestionIds.length} 道。
            </p>
            <Button asChild variant="red" className="mt-4 w-full">
              <Link href="/student/practice">进入错题Boss塔</Link>
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function MapDecorations() {
  return (
    <>
      <div className="absolute left-[3%] top-[6%] grid h-16 w-16 place-items-center rounded-full bg-lime-300 text-lime-800 shadow-soft">
        <Trees size={34} />
      </div>
      <div className="absolute right-[10%] top-[10%] grid h-20 w-20 place-items-center rounded-full bg-white/70 text-slate-500 shadow-soft">
        <Mountain size={42} />
      </div>
      <div className="absolute bottom-[8%] right-[10%] h-32 w-56 rounded-[50%] bg-brand-blue/35 shadow-inner" />
      <div className="absolute bottom-[20%] right-[24%] h-8 w-24 rotate-[-8deg] rounded-full bg-amber-300 shadow-[0_5px_0_#d89424]" />
      <div className="absolute bottom-[24%] right-[30%] h-4 w-4 rounded-full bg-amber-700" />
      <div className="absolute bottom-[23%] right-[18%] h-4 w-4 rounded-full bg-amber-700" />
      <div className="absolute left-[47%] top-[45%] h-10 w-3 rounded-full bg-amber-700" />
      <div className="absolute left-[48%] top-[44%] h-7 w-9 rounded-r-full bg-brand-red" />
    </>
  );
}

function Reward({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
      <div className="text-xs font-black text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-black text-slate-950">{value}</div>
    </div>
  );
}
