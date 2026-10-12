"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Text set along a curve that runs and bends: an arc you can pull with the pointer, a travelling wave, or a ring.
 *
 * The line scrolls along the path like a ticker, and the arc and wave follow your pointer up and
 * down with a spring. The words are real text, so they can be selected and read aloud.
 */
export function CurveText({
  children,
  shape = "arc",
  height = 240,
  fontSize = 44,
  speed = 60,
  interactive = true,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The words. They repeat to fill the path. */
  children: string;
  shape?: "arc" | "wave" | "circle";
  /** Height of the drawing area, in px. */
  height?: number;
  /** Size of the letters, in px. */
  fontSize?: number;
  /** How fast the text travels along the path, in px per second. 0 holds it still. */
  speed?: number;
  /** Let the pointer bend the arc and shape the wave. */
  interactive?: boolean;
}) {
  const id = React.useId();
  const box = React.useRef<HTMLDivElement>(null);
  const path = React.useRef<SVGPathElement>(null);
  const run = React.useRef<SVGTextPathElement>(null);
  const unit = React.useRef<SVGTextElement>(null);
  const live = React.useRef({ shape, speed, interactive, height });
  const phrase = `${children}   ✦   `;

  React.useEffect(() => {
    live.current = { shape, speed, interactive, height };
  }, [shape, speed, interactive, height]);

  React.useEffect(() => {
    const el = box.current;
    const p = path.current;
    const r = run.current;
    const u = unit.current;
    if (!el || !p || !r || !u) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = el.offsetWidth;
    let loop = 1;
    let travelled = 0;
    let bend = 0.35;
    let aim = 0.35;
    let phase = 0;
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const geometry = () => {
      const { shape: s, height: H } = live.current;
      const pad = 24;
      if (s === "circle") {
        const rad = Math.min(W, H) / 2 - fontSize * 0.7;
        const cx = W / 2;
        const cy = H / 2;
        return `M ${cx} ${cy - rad} a ${rad} ${rad} 0 1 1 0 ${2 * rad} a ${rad} ${rad} 0 1 1 0 ${-2 * rad}`;
      }
      if (s === "wave") {
        const pts: string[] = [];
        const amp = H * (0.08 + 0.22 * Math.abs(bend));
        const n = 72;
        for (let i = 0; i <= n; i++) {
          const x = pad + ((W - pad * 2) * i) / n;
          const y = H / 2 + Math.sin((i / n) * Math.PI * 3 + phase) * amp;
          pts.push(`${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        return pts.join(" ");
      }
      const y = H * 0.78;
      return `M ${pad} ${y} Q ${W / 2} ${y - bend * H * 1.5} ${W - pad} ${y}`;
    };

    const measure = () => {
      W = el.offsetWidth;
      loop = Math.max(40, u.getComputedTextLength());
      p.setAttribute("d", geometry());
    };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      bend += (aim - bend) * (1 - Math.exp(-dt * 7));
      phase += dt * 1.6;
      travelled = (travelled + live.current.speed * dt) % loop;
      p.setAttribute("d", geometry());
      r.setAttribute("startOffset", String(-travelled));
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (raf || calm) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      if (!live.current.interactive) return;
      const b = el.getBoundingClientRect();
      aim = Math.max(-0.9, Math.min(0.9, (b.top + b.height / 2 - e.clientY) / (b.height * 0.9)));
    };
    const leave = () => {
      aim = 0.35;
    };

    measure();
    r.setAttribute("startOffset", "0");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    document.fonts?.ready.then(measure);
    start();
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [phrase, fontSize]);

  return (
    <div
      {...props}
      ref={box}
      className={cn("relative w-full select-none", className)}
      style={{ height, ...props.style }}
    >
      <svg
        width="100%"
        height={height}
        className="absolute inset-0 overflow-visible"
        role="img"
        aria-label={children}
      >
        <defs>
          <path id={`${id}-p`} ref={path} fill="none" />
        </defs>
        {/* an unseen copy, only here to be measured */}
        <text ref={unit} className="invisible font-display" style={{ fontSize }} aria-hidden>
          {phrase}
        </text>
        <text className="fill-current font-display" style={{ fontSize }} aria-hidden>
          <textPath ref={run} href={`#${id}-p`}>
            {phrase.repeat(8)}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
