"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// 8×8 ordered-dither thresholds in (0, 1), built the classic way: each size doubles the one before.
const BAYER = (() => {
  let m = [[0]];
  for (let n = 1; n < 8; n *= 2) {
    const s = m.length;
    const next = Array.from({ length: s * 2 }, () => new Array<number>(s * 2).fill(0));
    for (let y = 0; y < s; y++)
      for (let x = 0; x < s; x++) {
        const v = m[y][x] * 4;
        next[y][x] = v;
        next[y][x + s] = v + 2;
        next[y + s][x] = v + 3;
        next[y + s][x + s] = v + 1;
      }
    m = next;
  }
  return m.map((row) => row.map((v) => (v + 0.5) / 64));
})();

// A cheap hash for the dissolving edge of the lens, so it does not line up with the dither grid.
const hash = (x: number, y: number) => {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * A photograph reduced to two colours with ordered dithering, which a lens of full colour dissolves through.
 *
 * Move across it and the picture comes back under the pointer, its edge breaking into the same
 * dither. When nobody is touching it, the lens drifts by itself.
 */
export function DitherImage({
  src,
  alt,
  pixel = 3,
  radius = 110,
  contrast = 1.15,
  fg,
  bg,
  idle = true,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Image address. A data URI or a same-origin or CORS-enabled URL. */
  src: string;
  /** Describes the picture for assistive tech. */
  alt: string;
  /** Size of one dither cell, in CSS px. Bigger is chunkier. */
  pixel?: number;
  /** Radius of the colour lens, in px. */
  radius?: number;
  /** Stretch the tones before dithering. Above 1 is punchier. */
  contrast?: number;
  /** Dark colour of the dither. Defaults to the ink token. */
  fg?: string;
  /** Light colour of the dither. Defaults to the canvas token. */
  bg?: string;
  /** Let the lens wander on its own while the pointer is away. */
  idle?: boolean;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ pixel, radius, contrast, fg, bg, idle });

  React.useEffect(() => {
    live.current = { pixel, radius, contrast, fg, bg, idle };
  }, [pixel, radius, contrast, fg, bg, idle]);

  React.useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!host || !cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0;
    let rows = 0;
    let cell = 3;
    let dpr = 1;
    let rgba: Uint8ClampedArray | null = null; // the picture at dither resolution
    let lum: Float32Array | null = null;
    let base: HTMLCanvasElement | null = null; // the dithered picture, drawn once
    let img: HTMLImageElement | null = null;

    const pointer = { x: 0, y: 0, in: false };
    let lens = { x: 0, y: 0, r: 0 };
    let raf = 0;
    let running = false;
    let visible = true;
    const t0 = performance.now();
    let last = t0;

    const colour = (given: string | undefined, token: string) => {
      const probe = document.createElement("span");
      probe.style.color = given ?? `var(${token})`;
      host.appendChild(probe);
      const c = getComputedStyle(probe).color;
      host.removeChild(probe);
      return c;
    };
    // Rebuild the sampled picture and the dithered base for the current size.
    const build = () => {
      if (!img || !img.naturalWidth) return;
      const W = host.offsetWidth;
      const H = host.offsetHeight;
      if (!W || !H) return;
      cell = Math.max(1, live.current.pixel);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);

      // Cover-fit the picture into the grid.
      const small = document.createElement("canvas");
      small.width = cols;
      small.height = rows;
      const sctx = small.getContext("2d", { willReadFrequently: true })!;
      const k = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
      const dw = img.naturalWidth * k;
      const dh = img.naturalHeight * k;
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
      rgba = sctx.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(cols * rows);
      const c = live.current.contrast;
      for (let i = 0; i < cols * rows; i++) {
        const l =
          (0.2126 * rgba[i * 4] + 0.7152 * rgba[i * 4 + 1] + 0.0722 * rgba[i * 4 + 2]) / 255;
        lum[i] = Math.min(1, Math.max(0, (l - 0.5) * c + 0.5));
      }

      // The dithered picture: pick the dark or the light colour for every cell.
      base = document.createElement("canvas");
      base.width = cv.width;
      base.height = cv.height;
      const b = base.getContext("2d")!;
      const dark = colour(live.current.fg, "--ink");
      const light = colour(live.current.bg, "--canvas");
      b.fillStyle = light;
      b.fillRect(0, 0, base.width, base.height);
      b.fillStyle = dark;
      const px = cell * dpr;
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++)
          if (lum[y * cols + x] < BAYER[y & 7][x & 7]) b.fillRect(x * px, y * px, px, px);
      draw();
    };

    const draw = () => {
      if (!base || !rgba) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(base, 0, 0);
      if (lens.r < 1) return;
      const px = cell * dpr;
      const edge = lens.r * 0.5; // how wide the dissolve is
      const x0 = Math.max(0, Math.floor((lens.x - lens.r) / cell));
      const x1 = Math.min(cols - 1, Math.ceil((lens.x + lens.r) / cell));
      const y0 = Math.max(0, Math.floor((lens.y - lens.r) / cell));
      const y1 = Math.min(rows - 1, Math.ceil((lens.y + lens.r) / cell));
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) {
          const d = Math.hypot((x + 0.5) * cell - lens.x, (y + 0.5) * cell - lens.y);
          // 1 in the middle, falling to 0 across the edge; a cell shows colour when it beats its own random number.
          const show = 1 - smooth(lens.r - edge, lens.r, d);
          if (show <= hash(x, y)) continue;
          const i = (y * cols + x) * 4;
          ctx.fillStyle = `rgb(${rgba[i]} ${rgba[i + 1]} ${rgba[i + 2]})`;
          ctx.fillRect(x * px, y * px, px, px);
        }
    };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const cfg = live.current;
      const W = host.offsetWidth;
      const H = host.offsetHeight;
      let tx = pointer.x;
      let ty = pointer.y;
      let tr = pointer.in ? cfg.radius : 0;
      if (!pointer.in && cfg.idle && !calm) {
        // A slow, looping path that crosses the whole picture.
        const s = (t - t0) / 1000;
        tx = W * (0.5 + 0.34 * Math.sin(s * 0.55));
        ty = H * (0.5 + 0.3 * Math.sin(s * 0.8 + 1.2));
        tr = cfg.radius * 0.85;
      }
      const follow = 1 - Math.exp(-dt * (pointer.in ? 18 : 3));
      if (lens.r < 1 && tr > 0) {
        lens.x = tx;
        lens.y = ty;
      }
      lens = {
        x: lens.x + (tx - lens.x) * follow,
        y: lens.y + (ty - lens.y) * follow,
        r: lens.r + (tr - lens.r) * (1 - Math.exp(-dt * 9)),
      };
      draw();
      const settled = tr === 0 && lens.r < 1;
      if (settled) {
        running = false;
        raf = 0;
      } else raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const local = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const k = host.offsetWidth / (r.width || 1);
      pointer.x = (e.clientX - r.left) * k;
      pointer.y = (e.clientY - r.top) * k;
    };
    const onMove = (e: PointerEvent) => {
      local(e);
      pointer.in = true;
      start();
    };
    const onLeave = () => {
      pointer.in = false;
      start();
    };

    const load = new Image();
    load.crossOrigin = "anonymous";
    load.onload = () => {
      img = load;
      build();
      start();
    };
    load.src = src;

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);
    const ro = new ResizeObserver(() => build());
    ro.observe(host);
    // Redraw in the new colours when the theme flips.
    const mo = new MutationObserver(() => build());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      load.onload = null;
    };
    // The picture is rebuilt whenever the source or the dither settings change.
  }, [src, pixel, contrast, fg, bg]);

  return (
    <div
      {...props}
      ref={wrap}
      role="img"
      aria-label={alt}
      className={cn(
        "relative aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-2xl bg-canvas",
        className,
      )}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
