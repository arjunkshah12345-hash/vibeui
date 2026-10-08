"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Inline link that reveals a floating image preview following the cursor. */
export function HoverImage({
  label,
  src,
  className,
}: {
  label: string;
  src: string;
  className?: string;
}) {
  const card = React.useRef<HTMLSpanElement>(null);
  const [show, setShow] = React.useState(false);

  return (
    <span
      className={cn("inline-block", className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onMouseMove={(e) => {
        const el = card.current;
        if (!el) return;
        el.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 18}px)`;
      }}
    >
      <span className="cursor-default border-b border-dashed border-faint font-medium text-ink transition-colors hover:border-accent hover:text-accent">
        {label}
      </span>
      <span
        ref={card}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-50 h-[130px] w-[190px] overflow-hidden rounded-md border border-line bg-surface shadow-lift transition-opacity duration-200",
          show ? "opacity-100" : "opacity-0",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="size-full object-cover" />
      </span>
    </span>
  );
}
