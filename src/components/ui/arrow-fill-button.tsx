"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Outlined button that floods with ink on hover while the arrow slides. */
export function ArrowFillButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-md border border-ink px-6 text-[15px] font-medium text-ink transition-colors duration-300 active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-surface">
        {children}
      </span>
      <span className="relative z-10 flex size-5 items-center justify-center overflow-hidden text-current transition-colors duration-300 group-hover:text-surface">
        <ArrowRight
          size={16}
          weight="bold"
          className="transition-transform duration-500 ease-out group-hover:translate-x-[150%]"
        />
        <ArrowRight
          size={16}
          weight="bold"
          className="absolute -translate-x-[150%] transition-transform duration-500 ease-out group-hover:translate-x-0"
        />
      </span>
    </button>
  );
}
