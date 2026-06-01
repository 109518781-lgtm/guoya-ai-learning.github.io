import Link from "next/link";
import { ChevronRight, CircleHelp, Gift, Lock, Play, Star, Trophy } from "lucide-react";
import { StudentShell } from "@/components/student/student-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { learningLevels, todayTasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const colorMap = {
  green: "from-lime-300 to-green-400 border-lime-200 text-lime-800",
  yellow: "from-yellow-200 to-orange-300 border-yellow-200 text-yellow-800",
  blue: "from-blue-300 to-cyan-400 border-blue-200 text-blue-800",
  purple: "from-purple-300 to-violet-400 border-purple-200 text-purple-800",
  orange: "from-orange-300 to-amber-400 border-orange-200 text-orange-800",
  red: "from-red-300 to-pink-400 border-red-200 text-red-800"
};

export default function StudentHomePage() {
  return (
    <StudentShell active="/student">
      <div className="grid gap-5 xl:grid-cols-[1.6fr_.9fr]">
        <section className="game-card relative overflow-hidden p-5 sm:p-8">
          <div className="absolute left-10 top-20 h-28 w-28 rounded-full bg-brand-yellow/25 blur-2xl" />
          <div className="absolute bottom-16 right-8 h-36 w-36 rounded-full bg-brand-blue/20 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="green">Unit 3 · Daily English</Badge>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">今日学习地图</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
                单词障碍 → 短语理解 → 句型掌握 → 语法判断 → 阅读拆解 → 原题训练 → 错题修复。
                当前环节 100% 正确后自动解锁下一关。
              </p>
            </div>
            <Button asChild size="lg" variant="blue">
              <Link href="/student/practice">
                继续挑战 <Play size={20} />
              </Link>
            </Button>
          </div>

          <div className="relative z-10 mt-8 grid gap-5 lg:grid-cols-7">
            {learningLevels.map((level, index) => {
              const Icon = level.icon;
              const isCurrent = level.status === "current";
              const isLocked = level.status === "locked";
              return (
                <div
                  key={level.id}
                  className={cn(
                    "relative min-h-56 rounded-[32px] border-2 bg-gradient-to-br p-4 shadow-soft transition hover:-translate-y-1",
                    colorMap[level.color],
                    isLocked && "from-slate-100 to-slate-200 text-slate-500",
                    isCurrent && "ring-4 ring-brand-blue/30"
                  )}
                >
                  {index < learningLevels.length - 1 ? (
                    <div className="absolute -right-5 top-1/2 hidden h-3 w-8 rounded-full bg-white/70 lg:block" />
                  ) : null}
                  <div className="flex items-center justify-between">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/70 shadow-sm">
                      {isLocked ? <Lock size={28} /> : <Icon size={30} />}
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          size={17}
                          className={starIndex < level.stars ? "fill-brand-yellow text-yellow-600" : "text-white/70"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-black">{level.name}</h3>
                    <p className="mt-2 text-sm font-bold opacity-80">{level.description}</p>
                    <Progress value={level.accuracy} className="mt-5 bg-white/60" />
                    <div className="mt-3 text-xs font-black">
                      {isCurrent ? "继续挑战" : isLocked ? "未解锁" : "已完成"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="text-brand-yellow" /> 今日任务
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {todayTasks.map((task) => {
                const Icon = task.icon;
                return (
                  <div key={task.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-green shadow-sm">
                        <Icon size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-slate-900">{task.title}</div>
                        <div className="text-xs font-bold text-slate-500">{task.reward}</div>
                      </div>
                      <ChevronRight size={18} className="text-slate-400" />
                    </div>
                    <Progress value={task.progress} className="mt-3 h-3" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-lime-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleHelp className="text-brand-red" /> 错题修复
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold leading-7 text-slate-600">
                3 道题进入错题库，其中 2 道来自句型排序。独立做对才算真正修复。
              </p>
              <Button asChild className="mt-5 w-full" variant="red">
                <Link href="/student/practice">开始修复</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="text-brand-orange" /> 奖励入口
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Button asChild variant="yellow">
                <Link href="/student/shop">金币商城</Link>
              </Button>
              <Button asChild variant="blue">
                <Link href="/student/cards">抽卡收藏</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </StudentShell>
  );
}
