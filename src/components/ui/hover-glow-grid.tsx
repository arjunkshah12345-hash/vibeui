"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// A ring is a filled shape with its middle cut out: mask the padding box against the full box.
const RING = {
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
} as const;

/**
 * A grid of cards lit by one light: it follows the pointer across the whole group, catching each card's edge as it passes.
 *
 * Cards near the light glow along their borders and pick up a soft wash inside; the ones far away
 * stay quiet. Wrap `GlowCard`s, or anything with a `data-glow` attribute.
 */
export function HoverGlowGrid({
  children,
  columns = 3,
  gap = 14,
  color = "var(--accent)",
  size = 320,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Columns on wide screens. */
  columns?: number;
  /** Space between cards, in px. */
  gap?: number;
  /** Colour of the light. */
  color?: string;
  /** Radius of the light, in px. */
  size?: number;
}) {
  const box = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    let raf = 0;
    let at: { x: number; y: number } | null = null;
    const paint = () => {
      raf = 0;
      for (const c of el.querySelectorAll<HTMLElement>("[data-glow]")) {
        if (!at) {
          c.style.setProperty("--glow-on", "0");
          continue;
        }
        const r = c.getBoundingClientRect();
        c.style.setProperty("--gx", `${at.x - r.left}px`);
        c.style.setProperty("--gy", `${at.y - r.top}px`);
        c.style.setProperty("--glow-on", "1");
      }
    };
    const move = (e: PointerEvent) => {
      at = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => {
      at = null;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      {...props}
      ref={box}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]",
        className,
      )}
      style={
        {
          gap,
          "--glow": color,
          "--glow-size": `${size}px`,
          "--cols": columns,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

/** One card in a `HoverGlowGrid`. */
export function GlowCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-glow
      {...props}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-surface p-6 [--glow-on:0]",
        className,
      )}
    >
      {/* the wash inside the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--glow-on)",
          background:
            "radial-gradient(var(--glow-size) circle at var(--gx, 50%) var(--gy, 50%), color-mix(in oklab, var(--glow) 12%, transparent), transparent 70%)",
        }}
      />
      {/* the light catching the edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px transition-opacity duration-300"
        style={{
          opacity: "var(--glow-on)",
          background:
            "radial-gradient(calc(var(--glow-size) * 0.7) circle at var(--gx, 50%) var(--gy, 50%), var(--glow), transparent 70%)",
          ...RING,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
