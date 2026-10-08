"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Rich preview card that opens on hover or keyboard focus. */
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
    timer.current = window.setTimeout(() => setOpen(true), 120);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 140);
  };

  React.useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

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
            "absolute left-1/2 top-[calc(100%+10px)] z-30 block w-72 -translate-x-1/2 animate-pop-in rounded-md border border-line bg-surface p-4 text-left shadow-lift",
            className,
          )}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
