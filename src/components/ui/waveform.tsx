"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const QUERY = "(prefers-reduced-motion: reduce)";

// A rounded rectangle path that works in every browser (ctx.roundRect is newer than our support floor).
function pill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const k = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + k, y);
  ctx.arcTo(x + w, y, x + w, y + h, k);
  ctx.arcTo(x + w, y + h, x, y + h, k);
  ctx.arcTo(x, y + h, x, y, k);
  ctx.arcTo(x, y, x + w, y, k);
  ctx.closePath();
}

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

/**
 * A live audio waveform: rounded bars that dance to a loudness level or to any Web Audio analyser.
 *
 * Feed it `level` (0 to 1) or an `AnalyserNode`. With neither it idles in a calm ripple.
 */
export function Waveform({
  level = 0,
  analyser,
  bars = 48,
  active = true,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Loudness from 0 to 1. Ignored while an `analyser` is given. */
  level?: number;
  /** A Web Audio analyser, for example from a microphone. Its frequency data drives the bars. */
  analyser?: AnalyserNode | null;
  /** How many bars to draw. */
  bars?: number;
  /** Set false to settle the bars flat. */
  active?: boolean;
  className?: string;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const live = React.useRef({ level, analyser, bars, active });

  React.useEffect(() => {
    live.current = { level, analyser, bars, active };
  }, [level, analyser, bars, active]);

  React.useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!host || !cv || !ctx) return;

    let w = 1;
    let h = 1;
    let dpr = 1;
    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(r.width, 1);
      h = Math.max(r.height, 1);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    };

    // Each bar eases toward its target so the motion stays liquid, never jittery.
    const shown: number[] = [];
    let data: Uint8Array<ArrayBuffer> | null = null;
    let color = "";
    let colorKey = "";

    const draw = (t: number, dt: number) => {
      const cfg = live.current;
      const n = Math.max(cfg.bars, 4);
      const key = document.documentElement.className;
      if (key !== colorKey) {
        colorKey = key;
        color = getComputedStyle(host).color;
      }

      const targets = new Array<number>(n).fill(0);
      if (cfg.active) {
        if (cfg.analyser) {
          const size = cfg.analyser.frequencyBinCount;
          if (!data || data.length !== size) data = new Uint8Array(size);
          cfg.analyser.getByteFrequencyData(data);
          // Voices live in the lower bins, so sample the first ~60% across the bars.
          const usable = Math.floor(size * 0.6);
          for (let i = 0; i < n; i++) {
            const mid = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2);
            const v = data[Math.floor((i / n) * usable)] / 255;
            targets[i] = v * (1 - mid * 0.35);
          }
        } else {
          const amp = 0.14 + Math.min(Math.max(cfg.level, 0), 1) * 0.86;
          for (let i = 0; i < n; i++) {
            const x = i / (n - 1);
            const mid = 1 - Math.abs(x - 0.5) * 1.5;
            const wave =
              0.55 * Math.sin(x * 9 + t / 330) +
              0.3 * Math.sin(x * 21 - t / 210) +
              0.15 * Math.sin(x * 4 + t / 700);
            targets[i] = amp * Math.max(mid, 0.18) * (0.55 + 0.45 * (wave * 0.5 + 0.5));
          }
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const gap = Math.max(w / n / 3.2, 2);
      const bw = (w - gap * (n - 1)) / n;
      const mid = h / 2;
      ctx.fillStyle = color;
      for (let i = 0; i < n; i++) {
        const k = 1 - Math.exp(-dt * (targets[i] > (shown[i] ?? 0) ? 22 : 9));
        shown[i] = (shown[i] ?? 0) + (targets[i] - (shown[i] ?? 0)) * k;
        const bh = Math.max(bw, shown[i] * h * 0.92);
        const x = i * (bw + gap);
        ctx.globalAlpha = 0.35 + 0.65 * Math.min(1, shown[i] * 1.6);
        ctx.beginPath();
        pill(ctx, x, mid - bh / 2, bw, bh, bw / 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = performance.now();
    let running = false;
    let visible = true;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(now, dt);
      raf = running ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0, 1);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now(), 1);
    });
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(host);
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return (
    <div
      {...props}
      ref={wrap}
      role="img"
      aria-label={props["aria-label"] ?? (active ? "Audio waveform" : "Audio waveform, paused")}
      className={cn("relative h-16 w-full text-ink", className)}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
