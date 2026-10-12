"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * A text glitch: colour channels tear apart, horizontal slices jump sideways, then it snaps back.
 *
 * It fires on its own every few seconds, and runs continuously while you hover. Two coloured
 * copies sit behind the real text, so it reads on light and dark backgrounds alike.
 */
export function GlitchText({
  children,
  trigger = "both",
  intensity = 6,
  red = "#ff2d6f",
  cyan = "#12d8ff",
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** The text. Keep it a plain string. */
  children: string;
  /** `auto` glitches by itself, `hover` only under the pointer, `both` does both. */
  trigger?: "auto" | "hover" | "both";
  /** How far the slices jump, in px. */
  intensity?: number;
  red?: string;
  cyan?: string;
}) {
  const root = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-layer]"));
    const base = el.querySelector<HTMLElement>("[data-base]")!;
    let hovering = false;
    let timer = 0;
    let visible = true;
    let alive = true;

    // One burst: each layer gets its own run of slices, offsets and flashes.
    const burst = (ms: number) => {
      layers.forEach((l, li) => {
        const frames = Array.from({ length: 9 }, (_, i) => {
          const top = rand(0, 80);
          const height = rand(6, 30);
          const dx = rand(-1, 1) * intensity * (li === 0 ? 1 : -1);
          return {
            offset: i / 8,
            clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - height)}% 0)`,
            transform: `translate3d(${dx}px, ${rand(-1, 1) * 1.5}px, 0)`,
            opacity: i === 8 ? 0 : 0.95,
          };
        });
        l.animate(frames, { duration: ms, easing: "steps(1, end)" });
      });
      base.animate(
        [
          { transform: "translate3d(0,0,0)" },
          {
            transform: `translate3d(${rand(-1, 1) * intensity * 0.35}px, 0, 0) skewX(${rand(-4, 4)}deg)`,
            offset: 0.2,
          },
          { transform: "translate3d(0,0,0)", offset: 0.4 },
          { transform: `translate3d(${rand(-1, 1) * intensity * 0.25}px, 0, 0)`, offset: 0.7 },
          { transform: "translate3d(0,0,0)" },
        ],
        { duration: ms, easing: "steps(1, end)" },
      );
    };

    const loop = () => {
      if (!alive) return;
      if (hovering) {
        burst(260);
        timer = window.setTimeout(loop, 230);
      } else if ((trigger === "auto" || trigger === "both") && visible) {
        burst(rand(220, 420));
        timer = window.setTimeout(loop, rand(1800, 4200));
      } else timer = window.setTimeout(loop, 600);
    };
    timer = window.setTimeout(loop, 900);

    const enter = () => {
      if (trigger === "auto") return;
      hovering = true;
    };
    const leave = () => {
      hovering = false;
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    return () => {
      alive = false;
      window.clearTimeout(timer);
      io.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [children, trigger, intensity]);

  return (
    <span
      role="img"
      aria-label={children}
      {...props}
      ref={root}
      className={cn("relative inline-block whitespace-pre", className)}
    >
      <span
        data-layer
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{ color: red }}
      >
        {children}
      </span>
      <span
        data-layer
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{ color: cyan }}
      >
        {children}
      </span>
      <span data-base aria-hidden className="relative inline-block">
        {children}
      </span>
    </span>
  );
}
