"use client";

import { useState } from "react";
import { CheckCircle2, Coins, Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shopCategories, shopItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ShopClient() {
  const [category, setCategory] = useState("零食");
  const [pendingItem, setPendingItem] = useState("森林地图主题");
  const visibleItems = shopItems.filter((item) => item.category === category || category === "全部");

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <section className="game-card p-5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="yellow">金币可兑换 · 老师确认后扣除</Badge>
            <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">国雅奖励商城</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
              商品不是表格，而是像游戏商店一样展示。学生提交兑换后生成订单，状态为“待老师确认”。
            </p>
          </div>
          <div className="rounded-3xl bg-orange-100 px-5 py-3 text-brand-orange">
            <div className="text-xs font-black">当前金币</div>
            <div className="flex items-center gap-2 text-2xl font-black">
              <Coins size={24} /> 1280
            </div>
          </div>
        </div>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {["全部", ...shopCategories].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black transition",
                category === item
                  ? "border-brand-green bg-brand-green text-white shadow-[0_4px_0_#3f9500]"
                  : "border-slate-200 bg-white text-slate-500"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <div key={item.name} className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-1">
              <div className={cn("grid aspect-[1.2] place-items-center rounded-[28px] bg-gradient-to-br", item.gradient)}>
                <Package className="text-white drop-shadow" size={58} strokeWidth={2.5} />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-950">{item.name}</h3>
                  <p className="mt-1 text-xs font-bold text-slate-500">库存 {item.stock}</p>
                </div>
                <Badge variant={item.status === "可兑换" ? "green" : "yellow"}>{item.status}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-lg font-black text-brand-orange">
                  <Coins size={20} /> {item.price}
                </div>
                <Button
                  size="sm"
                  variant={item.status === "可兑换" ? "default" : "outline"}
                  onClick={() => setPendingItem(item.name)}
                >
                  兑换
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="grid gap-5">
        <div className="game-card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-brand-green">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">订单流程</h2>
              <p className="text-xs font-bold text-slate-500">MVP mock 状态</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {["学生点击兑换", "生成订单：待老师确认", "老师确认后扣金币", "拒绝或取消不扣金币"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-3xl bg-slate-50 p-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-black text-slate-600">{index + 1}</div>
                <div className="text-sm font-black text-slate-700">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="game-card bg-gradient-to-br from-white to-lime-50 p-5">
          <CheckCircle2 className="text-brand-green" size={30} />
          <h2 className="mt-3 text-xl font-black text-slate-950">当前订单</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
            {pendingItem} 已生成兑换申请，状态为 <span className="font-black text-yellow-700">待老师确认</span>。
          </p>
        </div>
      </aside>
    </div>
  );
}
