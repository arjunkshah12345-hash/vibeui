"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Marker highlight that sweeps across the text when it enters the viewport. */
export function HighlightText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.8 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <mark
      ref={ref}
      className={cn(
        "rounded-[3px] px-1 py-0.5 text-ink transition-[background-size] duration-[900ms] ease-out [box-decoration-break:clone]",
        className,
      )}
      style={{
        backgroundColor: "transparent",
        backgroundImage: "linear-gradient(var(--accent-soft), var(--accent-soft))",
        backgroundRepeat: "no-repeat",
        backgroundSize: on ? "100% 100%" : "0% 100%",
      }}
    >
      {children}
    </mark>
  );
}
