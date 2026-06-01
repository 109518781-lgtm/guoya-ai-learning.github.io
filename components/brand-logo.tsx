import Link from "next/link";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-green text-lg font-black text-white shadow-[0_6px_0_#3f9500]">
        雅
      </div>
      <div>
        <div className="text-xl font-black tracking-tight text-slate-950">赢未来国雅</div>
        {!compact ? (
          <div className="text-xs font-bold text-slate-500">AI自适应学习平台</div>
        ) : null}
      </div>
    </Link>
  );
}
