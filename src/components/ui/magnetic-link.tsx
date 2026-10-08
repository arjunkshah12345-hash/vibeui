"use client";

import * as React from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Link that drifts toward the cursor, with an arrow that nudges out. */
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

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm font-medium text-ink will-change-transform",
        className,
      )}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.transition = "transform 0.12s linear";
        el.style.transform = `translate(${((e.clientX - (r.left + r.width / 2)) / r.width) * 14}px, ${((e.clientY - (r.top + r.height / 2)) / r.height) * 10}px)`;
      }}
      onMouseLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = "transform 0.5s var(--ease-spring)";
        el.style.transform = "translate(0,0)";
      }}
    >
      <span className="border-b border-line-strong pb-px transition-colors duration-200 group-hover:border-accent group-hover:text-accent">
        {children}
      </span>
      <ArrowUpRight
        size={14}
        weight="bold"
        className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
      />
    </a>
  );
}
