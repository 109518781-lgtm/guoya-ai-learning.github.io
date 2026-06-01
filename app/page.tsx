import Link from "next/link";
import { ArrowRight, GraduationCap, Gamepad2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="soft-grid flex min-h-screen items-center justify-center p-4 sm:p-6">
      <section className="w-full max-w-5xl">
        <div className="mb-10 flex justify-center">
          <BrandLogo />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex rounded-full border border-lime-200 bg-white px-5 py-2 text-sm font-black text-lime-700 shadow-sm">
            英语第一阶段 · 自适应闯关学习系统
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
            从单词障碍到错题修复，一路通关英语考试
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
            老师上传资料，系统拆解任务；学生沿着游戏地图闯关，逐步完成单词、短语、句型、语法、阅读、原题和错题修复。
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          <Card className="group p-6">
            <div className="mb-8 grid h-20 w-20 place-items-center rounded-[28px] bg-lime-100 text-brand-green">
              <Gamepad2 size={42} strokeWidth={2.6} />
            </div>
            <h2 className="text-2xl font-black text-slate-950">学生入口</h2>
            <p className="mt-3 min-h-16 text-sm font-semibold leading-7 text-slate-500">
              进入任天堂风格的学习地图，挑战关卡、获得星星金币、兑换奖励与抽卡收藏。
            </p>
            <Button asChild size="lg" className="mt-7 w-full">
              <Link href="/student">
                进入学生端 <ArrowRight size={20} />
              </Link>
            </Button>
          </Card>

          <Card className="group p-6">
            <div className="mb-8 grid h-20 w-20 place-items-center rounded-[28px] bg-blue-100 text-brand-blue">
              <GraduationCap size={42} strokeWidth={2.6} />
            </div>
            <h2 className="text-2xl font-black text-slate-950">教师入口</h2>
            <p className="mt-3 min-h-16 text-sm font-semibold leading-7 text-slate-500">
              创建学生档案、上传资料、审核AI提取内容、发布任务并追踪学习画像。
            </p>
            <Button asChild size="lg" variant="blue" className="mt-7 w-full">
              <Link href="/teacher">
                进入教师端 <ArrowRight size={20} />
              </Link>
            </Button>
          </Card>
        </div>
      </section>
    </main>
  );
}
