"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Soft aurora colours, in the order they sweep around the edge.
const AURORA = ["#bc82f3", "#f5b9ea", "#8d9fff", "#aa6eee", "#ff6778", "#ffba71", "#c686ff"];

// A ring is a filled shape with its middle cut out: mask the padding box against the full box.
const RING_MASK = {
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
} as const;

/**
 * A glowing, colour-shifting border that runs around its content: the look of an assistant that is thinking.
 *
 * A crisp ring sits over a soft halo of the same colours. Switch `active` to fade it in and out.
 */
export function AuraBorder({
  children,
  active = true,
  radius = 20,
  thickness = 2,
  glow = 22,
  speed = 0.12,
  colors = AURORA,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Show the glow. Fades in and out. */
  active?: boolean;
  /** Corner radius of the content, in px. The glow follows it. */
  radius?: number;
  /** Width of the crisp ring, in px. */
  thickness?: number;
  /** How far the soft halo spreads, in px. */
  glow?: number;
  /** Laps per second around the edge. */
  speed?: number;
  /** CSS colours, swept around the edge in order. */
  colors?: string[];
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const lap = React.useRef(speed);

  React.useEffect(() => {
    lap.current = speed;
  }, [speed]);

  // The sweep only runs while the glow is on, on screen, and motion is allowed.
  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 40;
    let raf = 0;
    let last = performance.now();
    let running = false;
    let visible = true;

    const paint = () => el.style.setProperty("--aura", `${angle}deg`);
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      angle = (angle + dt * lap.current * 360) % 360;
      paint();
      raf = running ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (running || calm || !active) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    paint();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(el);
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    start();
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  const stops = [...colors, colors[0]].join(", ");
  const sweep = `conic-gradient(from var(--aura, 0deg) at 50% 50%, ${stops})`;

  return (
    <div
      {...props}
      ref={root}
      className={cn("relative", className)}
      style={{ borderRadius: radius, ...style }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute transition-opacity duration-700 ease-out"
        style={{ inset: -thickness, borderRadius: radius + thickness, opacity: active ? 1 : 0 }}
      >
        {/* the far halo: wide and soft */}
        <div
          className="absolute"
          style={{
            inset: -glow * 0.2,
            borderRadius: radius + thickness + glow * 0.2,
            padding: thickness * 5,
            background: sweep,
            filter: `blur(${glow * 1.7}px)`,
            opacity: 0.8,
            ...RING_MASK,
          }}
        />
        {/* the near halo: tighter and brighter, hugging the edge */}
        <div
          className="absolute"
          style={{
            inset: -glow * 0.05,
            borderRadius: radius + thickness,
            padding: thickness * 3,
            background: sweep,
            filter: `blur(${glow * 0.55}px)`,
            opacity: 0.95,
            ...RING_MASK,
          }}
        />
        {/* the ring: sharp and bright */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: radius + thickness,
            padding: thickness,
            background: sweep,
            ...RING_MASK,
          }}
        />
      </div>
      <div className="relative" style={{ borderRadius: radius }}>
        {children}
      </div>
    </div>
  );
}
