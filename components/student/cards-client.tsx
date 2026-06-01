"use client";

import { useState } from "react";
import { BookOpen, Box, Coins, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cards } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CardsClient() {
  const [current, setCurrent] = useState(cards[1]);

  function drawCard() {
    const next = cards[Math.floor(Math.random() * cards.length)];
    setCurrent(next);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <section className="game-card relative overflow-hidden p-5 sm:p-8">
        <div className="absolute right-8 top-8 h-40 w-40 rounded-full bg-brand-purple/15 blur-2xl" />
        <Badge variant="purple">抽卡收藏 · MVP mock</Badge>
        <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">开宝箱抽卡</h1>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
          学生花金币抽卡，获得不同稀有度卡牌。卡牌用于收藏展示，未来可与头像框、皮肤、地图主题联动。
        </p>

        <div className="mt-8 grid place-items-center rounded-[40px] bg-gradient-to-br from-yellow-100 via-white to-purple-100 p-8">
          <div className="relative grid h-56 w-56 place-items-center rounded-[52px] bg-gradient-to-br from-brand-yellow to-brand-orange shadow-game animate-floaty">
            <Box className="text-white drop-shadow" size={96} strokeWidth={2.4} />
            <span className="absolute -top-3 rounded-full bg-white px-4 py-2 text-sm font-black text-brand-orange shadow-soft">
              120金币 / 次
            </span>
          </div>
          <Button onClick={drawCard} size="lg" variant="yellow" className="mt-8">
            <Coins size={20} /> 单次抽卡
          </Button>
        </div>
      </section>

      <section className="grid gap-5">
        <div className="game-card p-5 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant={rarityVariant(current.rarity)}>{current.rarity}</Badge>
              <h2 className="mt-3 text-2xl font-black text-slate-950">刚获得的卡牌</h2>
            </div>
            <Sparkles className="text-brand-yellow" size={36} />
          </div>

          <div className={cn("mt-6 rounded-[36px] bg-gradient-to-br p-1 shadow-game", current.color)}>
            <div className="rounded-[32px] bg-white/70 p-6 text-center backdrop-blur">
              <div className="mx-auto grid h-32 w-32 place-items-center rounded-[36px] bg-white/80 text-brand-purple shadow-soft">
                <BookOpen size={64} strokeWidth={2.5} />
              </div>
              <h3 className="mt-5 text-2xl font-black text-slate-950">{current.name}</h3>
              <p className="mt-2 text-sm font-bold text-slate-600">{current.power}</p>
            </div>
          </div>
        </div>

        <div className="game-card p-5">
          <h2 className="text-xl font-black text-slate-950">我的收藏册</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
            {cards.map((card) => (
              <div key={card.name} className={cn("rounded-3xl bg-gradient-to-br p-3", card.color)}>
                <div className="rounded-2xl bg-white/75 p-3">
                  <div className="text-xs font-black text-slate-500">{card.rarity}</div>
                  <div className="mt-2 text-sm font-black leading-5 text-slate-950">{card.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function rarityVariant(rarity: string): "yellow" | "purple" | "blue" | "green" {
  if (rarity === "传说") return "yellow";
  if (rarity === "史诗") return "purple";
  if (rarity === "稀有") return "blue";
  return "green";
}
