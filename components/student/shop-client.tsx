"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Coins, Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStoredSession } from "@/lib/auth/mock-auth";
import {
  createId,
  getInitialPlatformState,
  getRewardWallet,
  loadPlatformState,
  PlatformState,
  savePlatformState,
  shopCategories
} from "@/lib/learning-store";
import { cn } from "@/lib/utils";

export function ShopClient() {
  const [state, setState] = useState<PlatformState>(getInitialPlatformState());
  const [studentId, setStudentId] = useState("student-demo");
  const [category, setCategory] = useState("全部");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setState(loadPlatformState());
    setStudentId(getStoredSession()?.studentId || "student-demo");
  }, []);

  const wallet = getRewardWallet(state, studentId);
  const visibleItems = state.shopItems.filter((item) => item.active && (item.category === category || category === "全部"));
  const myOrders = state.redemptionOrders.filter((order) => order.studentId === studentId);

  function redeem(itemId: string) {
    const item = state.shopItems.find((shopItem) => shopItem.id === itemId);
    if (!item) return;
    if (item.stock <= 0) {
      setMessage("库存不足，暂时不能兑换。");
      return;
    }
    if (wallet.coins < item.price) {
      setMessage("金币不足，先去完成关卡赚金币。");
      return;
    }
    const next: PlatformState = {
      ...state,
      redemptionOrders: [
        {
          id: createId("order"),
          studentId,
          itemId: item.id,
          itemName: item.name,
          price: item.price,
          status: "待确认",
          createdAt: new Date().toISOString()
        },
        ...state.redemptionOrders
      ]
    };
    setState(next);
    savePlatformState(next);
    setMessage(`${item.name} 已提交兑换申请，等待老师确认。`);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <section className="game-card p-5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="yellow">金币可兑换 · 老师确认后扣除</Badge>
            <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">国雅奖励商城</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
              这里显示老师后台上架的商品。提交兑换后先生成订单，老师确认时才会扣金币。
            </p>
          </div>
          <div className="rounded-3xl bg-orange-100 px-5 py-3 text-brand-orange">
            <div className="text-xs font-black">当前金币</div>
            <div className="flex items-center gap-2 text-2xl font-black">
              <Coins size={24} /> {wallet.coins}
            </div>
          </div>
        </div>

        {message ? <div className="mt-5 rounded-3xl bg-yellow-100 p-4 text-sm font-black text-yellow-800">{message}</div> : null}

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

        {visibleItems.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <div key={item.id} className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-1">
                <div className="grid aspect-[1.2] place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-orange-300 to-yellow-300">
                  {item.imageDataUrl ? <img src={item.imageDataUrl} alt={item.name} className="h-full w-full object-cover" /> : <Package className="text-white drop-shadow" size={58} strokeWidth={2.5} />}
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-950">{item.name}</h3>
                    <p className="mt-1 text-xs font-bold text-slate-500">库存 {item.stock}</p>
                  </div>
                  <Badge variant={item.stock > 0 ? "green" : "gray"}>{item.stock > 0 ? "可兑换" : "无库存"}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-lg font-black text-brand-orange">
                    <Coins size={20} /> {item.price}
                  </div>
                  <Button size="sm" disabled={item.stock <= 0 || wallet.coins < item.price} onClick={() => redeem(item.id)}>
                    兑换
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[32px] bg-white p-8 text-center text-sm font-black text-slate-500 shadow-sm">
            老师还没有上架商品。
          </div>
        )}
      </section>

      <aside className="grid content-start gap-5">
        <div className="game-card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-brand-green">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">订单流程</h2>
              <p className="text-xs font-bold text-slate-500">老师确认后才扣金币</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {["学生点击兑换", "生成订单：待老师确认", "老师确认后扣金币并减库存", "拒绝不扣金币"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-3xl bg-slate-50 p-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-black text-slate-600">{index + 1}</div>
                <div className="text-sm font-black text-slate-700">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="game-card bg-gradient-to-br from-white to-lime-50 p-5">
          <CheckCircle2 className="text-brand-green" size={30} />
          <h2 className="mt-3 text-xl font-black text-slate-950">我的订单</h2>
          <div className="mt-3 grid gap-3">
            {myOrders.length ? myOrders.slice(0, 6).map((order) => (
              <div key={order.id} className="rounded-3xl bg-white p-3 text-sm font-black text-slate-700 shadow-sm">
                {order.itemName}
                <div className="mt-1 text-xs text-slate-500">{order.price}金币 · {order.status}</div>
              </div>
            )) : <p className="text-sm font-bold leading-7 text-slate-600">暂无兑换订单。</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
