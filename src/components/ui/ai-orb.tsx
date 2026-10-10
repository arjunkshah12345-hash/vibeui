"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

const QUERY = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return React.useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

// Where each state settles: swirl speed (deg/s), how far the blobs roam, and glow strength.
const TARGET: Record<OrbState, { speed: number; spread: number; glow: number; breathe: number }> = {
  idle: { speed: 12, spread: 0.5, glow: 0.35, breathe: 0.025 },
  listening: { speed: 34, spread: 0.68, glow: 0.55, breathe: 0.02 },
  thinking: { speed: 120, spread: 0.92, glow: 0.45, breathe: 0.01 },
  speaking: { speed: 52, spread: 0.8, glow: 0.7, breathe: 0.01 },
};

const BLOBS = [
  { size: 74, k: 1, r: 1, mix: 6 },
  { size: 64, k: -1.35, r: 0.85, mix: 20 },
  { size: 58, k: 1.8, r: 1.1, mix: 10 },
  { size: 52, k: -0.8, r: 0.7, mix: 34 },
] as const;

/**
 * A living orb for voice and AI moments that swirls faster as it moves from idle to speaking.
 *
 * It swells with `level` and is tinted by `--accent`, so it retints with your theme.
 */
export function AiOrb({
  state = "idle",
  level = 0,
  size = 168,
  label,
  className,
}: {
  /** What the assistant is doing. Changes are eased, never snapped. */
  state?: OrbState;
  /** Live loudness from 0 to 1 (microphone or voice output). It swells the orb. */
  level?: number;
  /** Diameter in px. */
  size?: number;
  /** Accessible description. Defaults to the state. */
  label?: string;
  className?: string;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const want = React.useRef({ state, level });

  React.useEffect(() => {
    want.current = { state, level };
  }, [state, level]);

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const now0 = TARGET[want.current.state];
    const cur = { speed: now0.speed, spread: now0.spread, glow: now0.glow, lvl: 0, angle: 0 };
    const paint = (breathing: number) => {
      el.style.setProperty("--a", `${cur.angle}deg`);
      el.style.setProperty("--sp", cur.spread.toFixed(3));
      el.style.setProperty("--gl", cur.glow.toFixed(3));
      el.style.setProperty("--sc", (1 + cur.lvl * 0.14 + breathing).toFixed(4));
    };
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const want_ = want.current;
      const goal = TARGET[want_.state];
      const ease = (rate: number) => 1 - Math.exp(-dt * rate);
      cur.speed += (goal.speed - cur.speed) * ease(2.2);
      cur.spread += (goal.spread - cur.spread) * ease(2.2);
      cur.glow += (goal.glow - cur.glow) * ease(2.2);
      cur.lvl += (Math.min(Math.max(want_.level, 0), 1) - cur.lvl) * ease(14);
      cur.angle = (cur.angle + dt * cur.speed) % 36000;
      paint(Math.sin(t / 1000 / 1.4) * goal.breathe);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // With reduced motion there is no loop: hold the pose for the current state and level.
  React.useEffect(() => {
    const el = root.current;
    if (!el || !reduce) return;
    const goal = TARGET[state];
    el.style.setProperty("--a", "0deg");
    el.style.setProperty("--sp", String(goal.spread));
    el.style.setProperty("--gl", String(goal.glow));
    el.style.setProperty("--sc", String(1 + Math.min(Math.max(level, 0), 1) * 0.14));
  }, [reduce, state, level]);

  const a = "var(--accent)";
  return (
    <div
      ref={root}
      role="img"
      aria-label={label ?? `Assistant ${state}`}
      className={cn("relative shrink-0", className)}
      style={
        {
          width: size,
          height: size,
          "--a": "0deg",
          "--sp": TARGET[state].spread,
          "--gl": TARGET[state].glow,
          "--sc": 1,
        } as React.CSSProperties
      }
    >
      {/* halo */}
      <div
        aria-hidden
        className="absolute rounded-full blur-2xl"
        style={{
          inset: "-16%",
          opacity: "var(--gl)",
          background: `radial-gradient(closest-side, color-mix(in oklab, ${a} 70%, transparent), transparent)`,
          transform: "scale(var(--sc))",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          transform: "scale(var(--sc))",
          background: `radial-gradient(circle at 50% 40%, color-mix(in oklab, ${a} 88%, var(--canvas)), color-mix(in oklab, ${a} 96%, black) 78%)`,
          boxShadow: `0 26px 56px -20px color-mix(in oklab, ${a} 65%, transparent), inset 0 0 0 1px rgb(255 255 255 / 0.18), inset 0 -14px 30px rgb(0 0 0 / 0.28), inset 0 10px 22px rgb(255 255 255 / 0.2)`,
        }}
      >
        {BLOBS.map((b) => (
          <span
            key={b.size}
            className="absolute rounded-full"
            style={{
              width: `${b.size}%`,
              height: `${b.size}%`,
              left: `${(100 - b.size) / 2}%`,
              top: `${(100 - b.size) / 2}%`,
              background: `radial-gradient(circle, color-mix(in oklab, ${a} ${b.mix}%, var(--canvas)) 0%, transparent 68%)`,
              filter: "blur(10px)",
              opacity: 1,
              transform: `rotate(calc(var(--a) * ${b.k})) translateX(calc(var(--sp) * ${b.r * 34}%))`,
            }}
          />
        ))}

        {/* a slow caustic that sweeps across while it thinks */}
        <span
          className="absolute inset-0 rounded-full mix-blend-soft-light"
          style={{
            background:
              "conic-gradient(from var(--a), transparent 0%, rgb(255 255 255 / 0.55) 14%, transparent 34%, transparent 62%, rgb(255 255 255 / 0.3) 76%, transparent 92%)",
            filter: "blur(6px)",
          }}
        />

        {/* glass highlight */}
        <span
          className="absolute rounded-full"
          style={{
            left: "14%",
            top: "7%",
            width: "52%",
            height: "34%",
            background:
              "radial-gradient(ellipse at 40% 35%, rgb(255 255 255 / 0.7), transparent 70%)",
            filter: "blur(5px)",
            transform: "rotate(-24deg)",
          }}
        />
      </div>
    </div>
  );
}
