"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function HoverTilt({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [t, setT] = React.useState({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className={cn("[perspective:800px]", className)}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        setT({ x: (py - 0.5) * -10, y: (px - 0.5) * 10 });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
    >
      <div
        className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 transition-transform duration-200 ease-[var(--ease-out)]"
        style={{ transform: `rotateX(${t.x}deg) rotateY(${t.y}deg)` }}
      >
        {children}
      </div>
    </div>
  );
}
