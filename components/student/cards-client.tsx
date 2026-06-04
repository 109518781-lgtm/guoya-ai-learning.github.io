"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Award, Coins, Crown, Medal, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStoredSession } from "@/lib/auth/mock-auth";
import {
  badgeDefinitions,
  getInitialPlatformState,
  getRewardWallet,
  loadPlatformState,
  PlatformState,
  titleDefinitions
} from "@/lib/learning-store";
import { cn } from "@/lib/utils";

export function CardsClient() {
  const [state, setState] = useState<PlatformState>(getInitialPlatformState());
  const [studentId, setStudentId] = useState("student-demo");

  useEffect(() => {
    setState(loadPlatformState());
    setStudentId(getStoredSession()?.studentId || "student-demo");
  }, []);

  const student = state.students.find((item) => item.id === studentId);
  const wallet = getRewardWallet(state, studentId);
  const coinRecords = state.coinTransactions.filter((record) => record.studentId === studentId);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
      <section className="game-card relative overflow-hidden p-5 sm:p-8">
        <div className="absolute right-8 top-8 grid h-28 w-28 place-items-center rounded-[36px] bg-yellow-100 text-yellow-700 shadow-soft">
          <Crown size={58} />
        </div>
        <Badge variant="purple">我的成长档案</Badge>
        <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">{student?.name || "学生"}的徽章墙</h1>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
          星星代表学习成就，金币用于商城兑换；徽章和称号记录你的通关里程碑。
        </p>

        <div className="mt-8 rounded-[40px] bg-gradient-to-br from-yellow-100 via-white to-lime-100 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-black text-slate-500">当前称号</div>
              <div className="mt-2 flex items-center gap-3 text-3xl font-black text-slate-950">
                <Crown className="text-brand-yellow" /> {wallet.title || "英语冒险家"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat icon={<Sparkles />} label="星星" value={wallet.stars} />
              <Stat icon={<Coins />} label="金币" value={wallet.coins} />
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-black text-slate-950">已获得徽章</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badgeDefinitions.map((badge) => {
            const unlocked = wallet.badges.includes(badge);
            return (
              <div key={badge} className={cn("rounded-[32px] border p-4 shadow-soft transition", unlocked ? "border-lime-200 bg-white" : "border-slate-200 bg-slate-100 grayscale")}>
                <div className={cn("grid h-16 w-16 place-items-center rounded-[24px] text-white shadow-[0_5px_0_rgba(0,0,0,.15)]", unlocked ? "bg-brand-green" : "bg-slate-400")}>
                  <Medal size={34} />
                </div>
                <div className="mt-4 font-black text-slate-950">{badge}</div>
                <p className="mt-1 text-xs font-bold text-slate-500">{unlocked ? "已点亮" : "继续闯关解锁"}</p>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="grid content-start gap-5">
        <div className="game-card p-5">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950"><Award className="text-brand-purple" /> 称号列表</h2>
          <div className="mt-4 grid gap-3">
            {titleDefinitions.map((title) => {
              const unlocked = wallet.titles.includes(title);
              return (
                <div key={title} className={cn("rounded-3xl p-4 text-sm font-black", unlocked ? "bg-purple-50 text-purple-700" : "bg-slate-50 text-slate-400")}>
                  {title}
                  <div className="mt-1 text-xs font-bold">{unlocked ? "已获得" : "未解锁"}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="game-card p-5">
          <h2 className="text-xl font-black text-slate-950">金币记录</h2>
          <div className="mt-4 grid gap-3">
            {coinRecords.length ? coinRecords.slice(0, 10).map((record) => (
              <div key={record.id} className="rounded-3xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-600">
                <span className="font-black text-slate-800">{record.type}</span> · {record.amount > 0 ? "+" : ""}{record.amount}
                <br />{record.before} → {record.after} · {record.reason}
                <br />{new Date(record.createdAt).toLocaleString("zh-CN")}
              </div>
            )) : <p className="text-sm font-bold text-slate-500">暂无金币记录。</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-2xl bg-yellow-100 text-yellow-700">{icon}</div>
      <div className="mt-2 text-xs font-black text-slate-500">{label}</div>
      <div className="text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}
