"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Card that leans toward the cursor in perspective. */
export function HoverTilt({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const card = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrap}
      className={cn("[perspective:800px]", className)}
      onMouseMove={(e) => {
        const r = wrap.current?.getBoundingClientRect();
        const el = card.current;
        if (!r || !el) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.transition = "transform 0.1s linear";
        el.style.transform = `rotateX(${(py - 0.5) * -12}deg) rotateY(${(px - 0.5) * 12}deg)`;
      }}
      onMouseLeave={() => {
        const el = card.current;
        if (!el) return;
        el.style.transition = "transform 0.6s var(--ease-out)";
        el.style.transform = "rotateX(0) rotateY(0)";
      }}
    >
      <div
        ref={card}
        className="rounded-lg border border-line bg-surface p-5 shadow-quiet will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
