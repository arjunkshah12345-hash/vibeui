"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Collectible card that tilts in 3D and catches a glare under the cursor. */
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

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transition = "transform 0.1s linear";
    el.style.transform = `rotateX(${(py - 0.5) * -14}deg) rotateY(${(px - 0.5) * 14}deg) scale(1.02)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.6s var(--ease-out)";
    el.style.transform = "rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <div
      className={cn("w-full max-w-[250px] [perspective:900px]", className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={ref}
        className="group/card relative flex aspect-[5/7] flex-col overflow-hidden rounded-lg border border-line-strong bg-surface p-5 shadow-lift [--gx:50%] [--gy:30%] [transform-style:preserve-3d]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at var(--gx) var(--gy), color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover/card:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--gx) var(--gy), rgb(255 255 255 / 0.7), transparent 40%)",
          }}
        />
        <div className="relative flex items-center justify-between">
          {meta ? (
            <span className="font-mono text-[11px] text-muted">{meta}</span>
          ) : (
            <span />
          )}
          <span className="size-2 rounded-full bg-accent" />
        </div>
        <div className="relative mt-auto [transform:translateZ(30px)]">
          <h3 className="font-display text-[34px] leading-none tracking-[-0.01em] text-ink">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              {subtitle}
            </p>
          ) : null}
          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
