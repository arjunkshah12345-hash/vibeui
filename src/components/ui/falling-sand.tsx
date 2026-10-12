"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const PALETTE = ["#f2d49b", "#e9a25b", "#d4673f", "#a8405a", "#5b4a8f", "#3f7f93", "#7fb685"];

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * Grains of sand that fall, slide down each other and pile up at the natural angle of repose.
 *
 * Press and drag to pour more. A stream trickles from the top on its own, changing colour as it
 * goes, so the heap builds up in bands.
 */
export function FallingSand({
  cell = 4,
  palette = PALETTE,
  stream = true,
  bandMs = 1400,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Size of one grain, in CSS px. */
  cell?: number;
  /** Colours of the bands, as hex. */
  palette?: string[];
  /** Pour a slow stream from the top while idle. */
  stream?: boolean;
  /** How long each colour pours before the next, in ms. */
  bandMs?: number;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ cell, palette, stream, bandMs });

  React.useEffect(() => {
    live.current = { cell, palette, stream, bandMs };
  }, [cell, palette, stream, bandMs]);

  React.useEffect(() => {
    const box = host.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!box || !cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0;
    let rows = 0;
    // 0 is empty. Otherwise the grain's colour band + 1, and its own random shade.
    let grid = new Uint8Array(0);
    let shade = new Uint8Array(0);
    let img: ImageData | null = null;
    const off = document.createElement("canvas");
    const octx = off.getContext("2d")!;

    const pour = { x: 0, y: 0, down: false };
    let raf = 0;
    let running = false;
    let visible = true;
    let frame = 0;
    let quiet = 0;
    let band = 0;
    let bandAt = performance.now();
    let sweep = 0;

    const resize = () => {
      const c = Math.max(2, live.current.cell);
      const nc = Math.max(8, Math.floor(box.offsetWidth / c));
      const nr = Math.max(8, Math.floor(box.offsetHeight / c));
      if (nc === cols && nr === rows) return;
      const og = grid;
      const os = shade;
      const oc = cols;
      const or = rows;
      cols = nc;
      rows = nr;
      grid = new Uint8Array(cols * rows);
      shade = new Uint8Array(cols * rows);
      // Keep the heap: copy what fits, anchored to the floor.
      for (let y = 0; y < Math.min(or, rows); y++)
        for (let x = 0; x < Math.min(oc, cols); x++) {
          const from = (or - 1 - y) * oc + x;
          const to = (rows - 1 - y) * cols + x;
          grid[to] = og[from];
          shade[to] = os[from];
        }
      off.width = cols;
      off.height = rows;
      img = octx.createImageData(cols, rows);
      cv.width = cols;
      cv.height = rows;
      render();
      wake();
    };

    const put = (x: number, y: number, kind: number) => {
      if (x < 0 || x >= cols || y < 0 || y >= rows) return;
      const i = y * cols + x;
      if (grid[i]) return;
      grid[i] = kind;
      shade[i] = (Math.random() * 40) | 0;
    };
    const spray = (cx: number, cy: number, r: number, amount: number) => {
      const kind = (band % live.current.palette.length) + 1;
      for (let n = 0; n < amount; n++) {
        const a = Math.random() * Math.PI * 2;
        const d = Math.sqrt(Math.random()) * r;
        put(Math.round(cx + Math.cos(a) * d), Math.round(cy + Math.sin(a) * d), kind);
      }
    };

    // One pass of the rules, bottom up so a grain only moves once.
    const step = () => {
      const lean = frame++ & 1; // alternate the preferred side so heaps stay symmetrical
      let moved = 0;
      for (let y = rows - 2; y >= 0; y--) {
        for (let k = 0; k < cols; k++) {
          const x = lean ? k : cols - 1 - k;
          const i = y * cols + x;
          const v = grid[i];
          if (!v) continue;
          const below = i + cols;
          let to = -1;
          if (!grid[below]) to = below;
          else {
            const l = x > 0 && !grid[below - 1];
            const r = x < cols - 1 && !grid[below + 1];
            if (l && r) to = Math.random() < 0.5 ? below - 1 : below + 1;
            else if (l) to = below - 1;
            else if (r) to = below + 1;
          }
          if (to >= 0) {
            grid[to] = v;
            shade[to] = shade[i];
            grid[i] = 0;
            moved++;
          }
        }
      }
      return moved;
    };

    const render = () => {
      if (!img) return;
      const d = img.data;
      const pal = live.current.palette.map(hexToRgb);
      for (let i = 0; i < grid.length; i++) {
        const v = grid[i];
        const o = i * 4;
        if (!v) {
          d[o + 3] = 0;
          continue;
        }
        const c = pal[(v - 1) % pal.length];
        const s = 1 - (shade[i] / 255) * 0.42;
        d[o] = c[0] * s;
        d[o + 1] = c[1] * s;
        d[o + 2] = c[2] * s;
        d[o + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, cols, rows);
      ctx.drawImage(off, 0, 0);
    };

    const tick = (t: number) => {
      if (t - bandAt > live.current.bandMs) {
        band++;
        bandAt = t;
      }
      let busy = pour.down;
      if (pour.down) spray(pour.x, pour.y, 3, 7);
      if (live.current.stream && !calm) {
        // A stream that sways slowly back and forth across the top.
        sweep += 0.012;
        const sx = Math.round(cols * (0.5 + 0.28 * Math.sin(sweep)));
        for (let n = 0; n < 2; n++)
          put(sx + (n ? 1 : 0), 0, (band % live.current.palette.length) + 1);
        busy = grid[sx] === 0 || busy;
      }
      let moved = 0;
      for (let s = 0; s < 2; s++) moved += step();
      render();
      quiet = moved || busy ? 0 : quiet + 1;
      if (quiet > 30 || !visible) {
        running = false;
        raf = 0;
      } else raf = requestAnimationFrame(tick);
    };
    function wake() {
      quiet = 0;
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }

    const at = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      pour.x = Math.floor(((e.clientX - r.left) / r.width) * cols);
      pour.y = Math.floor(((e.clientY - r.top) / r.height) * rows);
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      box.setPointerCapture(e.pointerId);
      at(e);
      pour.down = true;
      // A fresh colour for each pour makes the layers easy to see.
      band++;
      bandAt = performance.now();
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!pour.down) return;
      at(e);
      wake();
    };
    const onUp = () => {
      pour.down = false;
    };

    resize();
    if (calm) {
      // No animation: build the heap instantly so there is something to see.
      for (let n = 0; n < 900; n++) {
        band = Math.floor(n / 130);
        spray(Math.round(cols * (0.5 + 0.25 * Math.sin(n * 0.07))), 0, 2, 3);
        for (let s = 0; s < 4; s++) step();
      }
      for (let s = 0; s < rows * 2; s++) step();
      render();
    }
    box.addEventListener("pointerdown", onDown);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerup", onUp);
    box.addEventListener("pointercancel", onUp);
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !calm) wake();
    });
    io.observe(box);
    const onVisibility = () => {
      if (!document.hidden && !calm) wake();
    };
    document.addEventListener("visibilitychange", onVisibility);
    if (!calm) wake();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      box.removeEventListener("pointerdown", onDown);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerup", onUp);
      box.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      {...props}
      ref={host}
      className={cn(
        "relative h-72 w-full cursor-crosshair touch-none select-none overflow-hidden rounded-2xl border border-line bg-surface-muted",
        className,
      )}
    >
      <canvas
        ref={canvas}
        role="img"
        aria-label="Falling sand. Press and drag to pour."
        className="absolute inset-0 size-full [image-rendering:pixelated]"
      />
    </div>
  );
}
