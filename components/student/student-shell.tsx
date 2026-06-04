"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { Bell, Coins, Flame, Settings, ShoppingBag, Sparkles, Star } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { getStoredSession } from "@/lib/auth/mock-auth";
import { getInitialPlatformState, getRewardWallet, loadPlatformState, PlatformState } from "@/lib/learning-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/student", label: "学习地图" },
  { href: "/student/practice", label: "今日练习" },
  { href: "/student/shop", label: "商城" },
  { href: "/student/cards", label: "抽卡收藏" }
];

export function StudentShell({
  children,
  active
}: {
  children: React.ReactNode;
  active: string;
}) {
  const [state, setState] = useState<PlatformState>(getInitialPlatformState());
  const [studentId, setStudentId] = useState("student-demo");

  useEffect(() => {
    setState(loadPlatformState());
    setStudentId(getStoredSession()?.studentId || "student-demo");
  }, []);

  const student = state.students.find((item) => item.id === studentId) || state.students[0];
  const wallet = student ? getRewardWallet(state, student.id) : { stars: 0, coins: 0, streakDays: 0, badges: [] };

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAFC]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,217,61,.28),transparent_24rem),radial-gradient(circle_at_80%_12%,rgba(77,150,255,.22),transparent_26rem),linear-gradient(180deg,#F8FAFC,#EEFDF0)]" />
      <header className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <BrandLogo compact />
        <nav className="flex gap-2 overflow-x-auto rounded-full border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-black text-slate-500 transition",
                active === item.href && "bg-brand-green text-white shadow-[0_4px_0_#3f9500]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="通知">
            <Bell size={20} />
          </Button>
          <Button variant="outline" size="icon" aria-label="设置">
            <Settings size={20} />
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/login/student">退出</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-[1.2fr_1.8fr]">
        <div className="game-card flex items-center gap-4 p-4">
          <div className="relative grid h-20 w-20 place-items-center rounded-[28px] border-4 border-brand-yellow bg-gradient-to-br from-lime-300 to-blue-300 text-2xl font-black text-white shadow-game">
            雅
            <span className="absolute -right-2 -top-2 rounded-full bg-brand-purple px-2 py-1 text-xs text-white">
              勇者
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-500">真实姓名由老师管理</p>
            <h1 className="truncate text-2xl font-black text-slate-950">{student?.name || "学生"}</h1>
            <p className="mt-1 text-sm font-bold text-slate-500">
              {student?.grade || "未设置年级"} · {student?.className || "未设置班级"} · {student?.group || "未设置小组"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatusPill icon={<Flame size={22} />} label="连续学习" value={`${wallet.streakDays}天`} color="bg-red-100 text-brand-red" />
          <StatusPill icon={<Star size={22} />} label="星星" value={wallet.stars} color="bg-yellow-100 text-yellow-700" />
          <StatusPill icon={<Coins size={22} />} label="金币" value={wallet.coins} color="bg-orange-100 text-brand-orange" />
          <StatusPill icon={<Sparkles size={22} />} label="徽章" value={wallet.badges.length} color="bg-purple-100 text-brand-purple" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">{children}</div>

      <div className="fixed bottom-4 right-4 hidden rounded-3xl bg-white p-3 shadow-soft lg:block">
        <Link href="/student/shop" className="flex items-center gap-2 text-sm font-black text-slate-700">
          <ShoppingBag className="text-brand-green" size={20} /> 商城兑换
        </Link>
      </div>
    </main>
  );
}

function StatusPill({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="game-card flex min-h-24 items-center gap-3 p-4">
      <div className={cn("grid h-12 w-12 place-items-center rounded-2xl", color)}>{icon}</div>
      <div>
        <p className="text-xs font-black text-slate-500">{label}</p>
        <p className="text-xl font-black text-slate-950">{value}</p>
      </div>
    </div>
  );
}
