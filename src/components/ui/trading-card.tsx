"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TradingCard({
  title,
  subtitle,
  meta,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-64 w-full max-w-[240px] [perspective:900px]",
        className,
      )}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        setTilt({ x: (py - 0.5) * -16, y: (px - 0.5) * 16 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        className="relative h-full overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[var(--shadow-quiet)] transition-transform duration-200 ease-[var(--ease-out)]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${50 + tilt.x * 2}%, color-mix(in oklab, var(--ink) 12%, transparent), transparent 55%)`,
          }}
        />
        {meta ? (
          <p className="relative font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
            {meta}
          </p>
        ) : null}
        <h3 className="relative mt-6 text-xl font-medium tracking-[-0.03em] text-ink">
          {title}
        </h3>
        {subtitle ? (
          <p className="relative mt-2 text-sm leading-relaxed text-muted">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="relative mt-auto pt-6">{children}</div> : null}
      </div>
    </div>
  );
}
