"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Number that eases up from zero the first time it scrolls into view. */
export function CountUp({
  value,
  duration = 1400,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(value * (1 - Math.pow(1 - t, 4)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value, duration]);

  return (
    <span
      ref={ref}
      aria-label={`${prefix}${value}${suffix}`}
      className={cn("font-medium tabular-nums tracking-[-0.04em] text-ink", className)}
    >
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
