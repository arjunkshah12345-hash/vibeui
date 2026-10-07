"use client";

import * as React from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function MagneticLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const [o, setO] = React.useState({ x: 0, y: 0 });

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium text-ink",
        className,
      )}
      style={{
        transform: `translate(${o.x}px, ${o.y}px)`,
        transition: "transform 0.15s var(--ease-out)",
      }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setO({
          x: ((e.clientX - (r.left + r.width / 2)) / r.width) * 12,
          y: ((e.clientY - (r.top + r.height / 2)) / r.height) * 12,
        });
      }}
      onMouseLeave={() => setO({ x: 0, y: 0 })}
    >
      {children}
      <ArrowUpRight size={14} weight="bold" />
    </a>
  );
}
