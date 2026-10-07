"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function HoverCard({
  trigger,
  children,
  className,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  const show = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {trigger}
      {open ? (
        <span
          className={cn(
            "absolute left-1/2 top-[calc(100%+10px)] z-30 w-64 -translate-x-1/2 rounded-[var(--radius-md)] border border-line bg-surface p-4 text-left shadow-[var(--shadow-lift)] animate-fade-up",
            className,
          )}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
