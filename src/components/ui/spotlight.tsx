"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface with a soft accent light that follows the cursor. */
export function Spotlight({
  children,
  className,
}: {
  children: React.ReactNode;
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
        "group/spot relative overflow-hidden rounded-lg border border-line bg-surface p-6 shadow-quiet [--x:50%] [--y:0%]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x) var(--y), color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          padding: 1,
          background:
            "radial-gradient(240px circle at var(--x) var(--y), color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%)",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
