"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function ArrowFillButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-[var(--radius-sm)] border border-ink px-5 text-sm font-medium text-ink transition-colors duration-300",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100"
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-surface">
        {children}
      </span>
      <ArrowRight
        size={16}
        weight="bold"
        className="relative z-10 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-surface"
      />
    </button>
  );
}
