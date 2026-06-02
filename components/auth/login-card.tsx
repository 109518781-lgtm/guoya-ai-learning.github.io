"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, KeyRound, Lock, UserRound } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthRole, authStorageKey, getRoleHome, mockSignIn } from "@/lib/auth/mock-auth";
import { cn } from "@/lib/utils";

const roleCopy = {
  student: {
    title: "学生登录",
    subtitle: "学生档案由老师创建。学生不能修改真实姓名、账号或密码。",
    demo: "演示账号：student / 123456",
    badge: "学生端",
    accent: "green",
    icon: UserRound,
    notes: ["真实姓名由老师管理", "账号和密码由老师创建", "忘记密码请找老师重置"]
  },
  teacher: {
    title: "教师登录",
    subtitle: "教师可管理学生档案、重置学生密码，后续支持修改自己的密码。",
    demo: "演示账号：teacher / 123456",
    badge: "教师端",
    accent: "blue",
    icon: GraduationCap,
    notes: ["创建和管理学生账号", "可重置学生密码", "后续支持教师修改自己的密码"]
  }
};

export function LoginCard({ role }: { role: AuthRole }) {
  const router = useRouter();
  const copy = roleCopy[role];
  const Icon = copy.icon;
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await mockSignIn(account.trim(), password, role);
      window.localStorage.setItem(authStorageKey, JSON.stringify(session));
      router.push(getRoleHome(role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="soft-grid flex min-h-screen items-center justify-center p-4 sm:p-6">
      <section className="grid w-full max-w-5xl gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="space-y-6">
          <BrandLogo />
          <div>
            <Badge variant={role === "student" ? "green" : "blue"}>{copy.badge}</Badge>
            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-xl text-base font-semibold leading-8 text-slate-600">
              {copy.subtitle}
            </p>
          </div>
          <div className="grid gap-3">
            {copy.notes.map((note) => (
              <div key={note} className="flex items-center gap-3 rounded-3xl bg-white/80 p-4 shadow-sm">
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-2xl",
                    role === "student" ? "bg-lime-100 text-brand-green" : "bg-blue-100 text-brand-blue"
                  )}
                >
                  <Lock size={18} />
                </div>
                <span className="text-sm font-black text-slate-700">{note}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-3">
          <CardContent className="p-5 sm:p-8">
            <div
              className={cn(
                "mb-7 grid h-20 w-20 place-items-center rounded-[28px] text-white shadow-game",
                role === "student" ? "bg-brand-green" : "bg-brand-blue"
              )}
            >
              <Icon size={42} strokeWidth={2.5} />
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">账号</span>
                <div className="flex items-center gap-3 rounded-3xl border-2 border-slate-200 bg-white px-4 py-3 focus-within:border-brand-green">
                  <UserRound className="text-slate-400" size={20} />
                  <input
                    value={account}
                    onChange={(event) => setAccount(event.target.value)}
                    required
                    className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none"
                    placeholder={role === "student" ? "student" : "teacher"}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">密码</span>
                <div className="flex items-center gap-3 rounded-3xl border-2 border-slate-200 bg-white px-4 py-3 focus-within:border-brand-green">
                  <KeyRound className="text-slate-400" size={20} />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    type="password"
                    className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none"
                    placeholder="123456"
                  />
                </div>
              </label>

              {error ? (
                <div className="rounded-3xl bg-red-50 p-4 text-sm font-black text-red-600">{error}</div>
              ) : null}

              <Button type="submit" size="lg" variant={role === "student" ? "default" : "blue"} className="w-full">
                {loading ? "登录中..." : "登录"}
                <ArrowRight size={20} />
              </Button>
            </form>

            <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm font-bold leading-7 text-slate-600">
              {copy.demo}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-black">
              <Link href="/" className="text-slate-500 hover:text-slate-900">
                返回首页
              </Link>
              <Link
                href={role === "student" ? "/login/teacher" : "/login/student"}
                className={role === "student" ? "text-brand-blue" : "text-brand-green"}
              >
                切换到{role === "student" ? "教师" : "学生"}登录
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
