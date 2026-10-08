"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const placement = {
  top: "bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 origin-bottom translate-y-1 group-hover/tip:translate-y-0 group-focus-within/tip:translate-y-0",
  bottom:
    "top-[calc(100%+8px)] left-1/2 -translate-x-1/2 origin-top -translate-y-1 group-hover/tip:translate-y-0 group-focus-within/tip:translate-y-0",
  left: "right-[calc(100%+8px)] top-1/2 -translate-y-1/2 origin-right translate-x-1 group-hover/tip:translate-x-0 group-focus-within/tip:translate-x-0",
  right:
    "left-[calc(100%+8px)] top-1/2 -translate-y-1/2 origin-left -translate-x-1 group-hover/tip:translate-x-0 group-focus-within/tip:translate-x-0",
} as const;

/** Hover and focus tooltip: pure CSS, short open delay, scales and slides in. */
export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: keyof typeof placement;
  className?: string;
}) {
  const id = React.useId();

  return (
    <span aria-describedby={id} className={cn("group/tip relative inline-flex", className)}>
      {children}
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-30 w-max max-w-[220px] scale-95 rounded-[7px] bg-ink px-2.5 py-1.5 text-[12px] font-medium leading-snug text-surface opacity-0 shadow-lift transition-[opacity,transform] duration-200 ease-out group-hover/tip:scale-100 group-hover/tip:opacity-100 group-hover/tip:delay-300 group-focus-within/tip:scale-100 group-focus-within/tip:opacity-100",
          placement[side],
        )}
      >
        {content}
      </span>
    </span>
  );
}
