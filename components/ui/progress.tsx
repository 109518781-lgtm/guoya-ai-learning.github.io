import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  indicatorClassName
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  return (
    <div className={cn("h-4 overflow-hidden rounded-full bg-slate-100 shadow-inner", className)}>
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-brand-green to-brand-yellow transition-all",
          indicatorClassName
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
