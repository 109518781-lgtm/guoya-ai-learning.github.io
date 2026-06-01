import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  green: "bg-lime-100 text-lime-700 border-lime-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  red: "bg-red-100 text-red-700 border-red-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  gray: "bg-slate-100 text-slate-600 border-slate-200"
};

export function Badge({
  className,
  variant = "green",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-black",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
