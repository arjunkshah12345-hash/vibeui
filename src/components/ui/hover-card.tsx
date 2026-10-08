"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Rich preview card that opens on hover or focus and animates in and out. */
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
  // Stay mounted until the exit animation has played.
  const [present, setPresent] = React.useState(false);
  if (open && !present) setPresent(true);
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
      {present ? (
        <span
          data-state={open ? "open" : "closed"}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && !open) setPresent(false);
          }}
          className={cn(
            "absolute left-1/2 top-[calc(100%+10px)] z-30 block w-72 -translate-x-1/2 rounded-md border border-line bg-surface p-4 text-left shadow-lift data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in",
            className,
          )}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
