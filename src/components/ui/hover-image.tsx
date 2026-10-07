"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function HoverImage({
  label,
  src,
  className,
}: {
  label: string;
  src: string;
  className?: string;
}) {
  const [pos, setPos] = React.useState({ x: 0, y: 0, show: false });

  return (
    <span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setPos((p) => ({ ...p, show: true }))}
      onMouseLeave={() => setPos((p) => ({ ...p, show: false }))}
      onMouseMove={(e) => {
        setPos({ x: e.clientX, y: e.clientY, show: true });
      }}
    >
      <span className="cursor-default border-b border-line-strong text-ink transition-colors hover:border-ink">
        {label}
      </span>
      {pos.show ? (
        <span
          className="pointer-events-none fixed z-50 overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface shadow-[var(--shadow-lift)]"
          style={{
            left: pos.x + 16,
            top: pos.y + 16,
            width: 180,
            height: 120,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="size-full object-cover" />
        </span>
      ) : null}
    </span>
  );
}
