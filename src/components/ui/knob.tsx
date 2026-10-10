"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const SWEEP = 270; // degrees of travel; the gap sits at the bottom
const START = -SWEEP / 2;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  return `M${x1} ${y1} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
}

/**
 * A rotary dial with ticks: drag it up and down, scroll over it, use the arrow keys, double-click to reset.
 *
 * The cap eases toward its value, so it turns smoothly even when the value jumps.
 */
export function Knob({
  value: controlled,
  defaultValue = 50,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  size = 132,
  ticks = 28,
  label,
  format = (v) => String(Math.round(v)),
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /** Controlled value. */
  value?: number;
  /** Initial value when uncontrolled. Double-click returns to it. */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Smallest change. Values snap to it. */
  step?: number;
  /** Diameter in px. */
  size?: number;
  /** How many tick marks to draw around the dial. */
  ticks?: number;
  /** Shown under the dial, and used as its accessible name. */
  label?: string;
  /** Turns the value into the text shown in the middle. */
  format?: (value: number) => string;
}) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = controlled ?? inner;
  const drag = React.useRef<{ y: number; x: number; v: number; scale: number } | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const cap = React.useRef<HTMLDivElement>(null);
  const shown = React.useRef(value);
  const goal = React.useRef(value);
  const [display, setDisplay] = React.useState(value);

  const commit = React.useCallback(
    (raw: number) => {
      const snapped = clamp(Math.round((raw - min) / step) * step + min, min, max);
      const v = Number(snapped.toFixed(6));
      if (controlled === undefined) setInner(v);
      onValueChange?.(v);
    },
    [controlled, max, min, onValueChange, step],
  );

  // The cap eases to its value on its own clock, so the dial feels weighty.
  React.useEffect(() => {
    goal.current = value;
    let raf = 0;
    let last = performance.now();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      shown.current += (goal.current - shown.current) * (calm ? 1 : 1 - Math.exp(-dt * 16));
      const done = Math.abs(goal.current - shown.current) < (max - min) * 0.0004;
      if (done) shown.current = goal.current;
      const deg = START + ((shown.current - min) / (max - min || 1)) * SWEEP;
      if (cap.current) cap.current.style.transform = `rotate(${deg}deg)`;
      setDisplay(shown.current);
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, min, max]);

  const pct = (v: number) => (clamp(v, min, max) - min) / (max - min || 1);
  const c = 60;
  const ringR = 52;
  const tickR1 = 56;
  const tickR2 = 59;
  const progress = START + pct(display) * SWEEP;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    drag.current = {
      y: e.clientY,
      x: e.clientX,
      v: value,
      scale: e.currentTarget.offsetWidth / (r.width || 1),
    };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    // Up and right raise the value; holding Shift slows it for fine control.
    const travel = (d.y - e.clientY + (e.clientX - d.x)) * d.scale;
    const speed = e.shiftKey ? 0.25 : 1;
    commit(d.v + (travel / 220) * (max - min) * speed);
  };
  const end = () => {
    drag.current = null;
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const big = (max - min) / 10;
    const delta: Record<string, number> = {
      ArrowUp: step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowLeft: -step,
      PageUp: big,
      PageDown: -big,
    };
    if (e.key in delta) {
      e.preventDefault();
      commit(value + delta[e.key] * (e.shiftKey ? 0.2 : 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      commit(min);
    } else if (e.key === "End") {
      e.preventDefault();
      commit(max);
    }
  };

  return (
    <div
      {...props}
      className={cn("inline-flex select-none flex-col items-center gap-2", className)}
    >
      <div
        role="slider"
        tabIndex={0}
        aria-label={label ?? "Knob"}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={format(value)}
        aria-orientation="vertical"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={onKeyDown}
        onDoubleClick={() => commit(defaultValue)}
        onWheel={(e) => {
          // Only steal the wheel while the dial has focus, so the page still scrolls past it.
          if (document.activeElement !== e.currentTarget) return;
          e.preventDefault();
          commit(value + (e.deltaY < 0 ? step : -step));
        }}
        className={cn(
          "relative touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-canvas",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 120 120" className="absolute inset-0 size-full" aria-hidden>
          {Array.from({ length: ticks }, (_, i) => {
            const t = i / (ticks - 1);
            const deg = START + t * SWEEP;
            const [x1, y1] = polar(c, c, tickR1, deg);
            const [x2, y2] = polar(c, c, i % 5 === 0 ? tickR2 + 1.5 : tickR2, deg);
            const lit = deg <= progress + 0.5;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={i % 5 === 0 ? 1.8 : 1.1}
                strokeLinecap="round"
                stroke={lit ? "var(--accent)" : "var(--line-strong)"}
                style={{ transition: "stroke 0.2s" }}
              />
            );
          })}
          <path
            d={arc(c, c, ringR, START, START + SWEEP)}
            fill="none"
            stroke="var(--line)"
            strokeWidth={4}
            strokeLinecap="round"
          />
          {pct(display) > 0.003 && (
            <path
              d={arc(c, c, ringR, START, progress)}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* the cap: a machined disc with a marker that turns with the value */}
        <div
          className="absolute rounded-full shadow-[0_6px_16px_-4px_rgb(0_0_0/0.35),0_1px_2px_rgb(0_0_0/0.2),inset_0_1px_0_rgb(255_255_255/0.5),inset_0_-3px_6px_rgb(0_0_0/0.12)]"
          style={{
            inset: "20%",
            background:
              "radial-gradient(circle at 35% 28%, var(--surface), var(--surface-muted) 62%, var(--surface-sunken))",
          }}
        >
          <div
            ref={cap}
            className="absolute inset-0 will-change-transform"
            style={{ transform: `rotate(${START}deg)` }}
          >
            <span className="absolute left-1/2 top-[9%] h-[22%] w-[3.5px] -translate-x-1/2 rounded-full bg-accent" />
          </div>
          <span
            className="absolute inset-0 grid place-items-center font-mono tabular-nums text-ink"
            style={{ fontSize: size * 0.105 }}
          >
            {format(display)}
          </span>
        </div>
      </div>
      {label && (
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
          {label}
        </span>
      )}
    </div>
  );
}
