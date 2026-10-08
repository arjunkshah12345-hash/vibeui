"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Rises and fades its children in the first time they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds before this block animates, for staggering siblings. */
  delay?: number;
  as?: "div" | "section" | "li" | "header";
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={{ transitionDelay: on ? `${delay}ms` : "0ms" }}
      // The resting state has no transform at all, so fixed-position
      // descendants (popovers, previews) keep resolving against the viewport.
      className={cn(
        "transition-[opacity,translate] duration-[900ms] ease-out",
        on ? "" : "translate-y-7 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
