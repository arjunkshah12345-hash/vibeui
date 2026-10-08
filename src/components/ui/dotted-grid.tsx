"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Dot-matrix surface that lights up under the cursor. */
export function DottedGrid({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group/dots relative overflow-hidden rounded-lg border border-line bg-surface p-8 [--x:50%] [--y:50%]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--line-strong) 1px, transparent 1.2px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/dots:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--accent) 1.3px, transparent 1.6px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(160px circle at var(--x) var(--y), #000, transparent)",
          WebkitMaskImage:
            "radial-gradient(160px circle at var(--x) var(--y), #000, transparent)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
