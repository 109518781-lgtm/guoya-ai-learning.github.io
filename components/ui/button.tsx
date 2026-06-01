"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-black transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/25 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-brand-green text-white shadow-[0_7px_0_#3f9500] hover:-translate-y-0.5 hover:shadow-[0_9px_0_#3f9500] active:translate-y-1 active:shadow-[0_3px_0_#3f9500]",
        blue:
          "bg-brand-blue text-white shadow-[0_7px_0_#2f65bd] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#2f65bd]",
        yellow:
          "bg-brand-yellow text-brand-ink shadow-[0_7px_0_#d6a51e] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#d6a51e]",
        red:
          "bg-brand-red text-white shadow-[0_7px_0_#c94b4b] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#c94b4b]",
        outline:
          "border-2 border-slate-200 bg-white text-slate-800 shadow-sm hover:border-brand-green hover:bg-lime-50",
        ghost: "text-slate-600 hover:bg-slate-100"
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
