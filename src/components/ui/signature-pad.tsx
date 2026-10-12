"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Dot = { x: number; y: number; w: number };
type Stroke = Dot[];

export type SignaturePadHandle = {
  // Remove every stroke.
  clear: () => void;
  // Remove the last stroke.
  undo: () => void;
  // Whether anything has been drawn.
  isEmpty: () => boolean;
  // A transparent PNG of the signature. Pass a colour to ink it for light or dark paper.
  toDataURL: (color?: string) => string;
};

/**
 * A signature field with real ink: the line thins as you move fast and swells as you slow down, with no corners.
 *
 * Strokes are smoothed into curves as you draw, respond to pen pressure where there is some, and
 * redraw crisply at any size. Undo and clear are built in.
 */
export function SignaturePad({
  ref,
  onChange,
  maxWidth = 3.4,
  minWidth = 0.9,
  controls = true,
  guide = true,
  placeholder = "Sign here",
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "ref"> & {
  ref?: React.Ref<SignaturePadHandle>;
  /** Called after each stroke, undo and clear, with a PNG data URL or null when empty. */
  onChange?: (dataUrl: string | null) => void;
  /** Widest the ink gets, in px. */
  maxWidth?: number;
  /** Thinnest the ink gets, in px. */
  minWidth?: number;
  /** Show Undo and Clear. */
  controls?: boolean;
  /** Show the baseline and the cross. */
  guide?: boolean;
  /** Faint prompt shown while empty. */
  placeholder?: string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const strokes = React.useRef<Stroke[]>([]);
  const redraw = React.useRef<() => void>(() => {});
  const cfg = React.useRef({ maxWidth, minWidth, onChange });
  const [empty, setEmpty] = React.useState(true);

  React.useEffect(() => {
    cfg.current = { maxWidth, minWidth, onChange };
  }, [maxWidth, minWidth, onChange]);

  // Lay dots along the curve through three points; their size carries the changing width.
  const paint = (ctx: CanvasRenderingContext2D, a: Dot, b: Dot, c: Dot) => {
    const m1 = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, w: (a.w + b.w) / 2 };
    const m2 = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2, w: (b.w + c.w) / 2 };
    const len = Math.hypot(m2.x - m1.x, m2.y - m1.y) + Math.hypot(b.x - m1.x, b.y - m1.y);
    const steps = Math.max(2, Math.ceil(len / 0.8));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const u = 1 - t;
      const x = u * u * m1.x + 2 * u * t * b.x + t * t * m2.x;
      const y = u * u * m1.y + 2 * u * t * b.y + t * t * m2.y;
      const w = u * u * m1.w + 2 * u * t * b.w + t * t * m2.w;
      ctx.beginPath();
      ctx.arc(x, y, w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawStroke = (ctx: CanvasRenderingContext2D, s: Stroke) => {
    if (s.length === 1) {
      ctx.beginPath();
      ctx.arc(s[0].x, s[0].y, s[0].w / 2 + 0.4, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    for (let i = 0; i < s.length - 1; i++) {
      // Pad the ends so the curve starts and finishes exactly on the first and last points.
      paint(ctx, s[Math.max(i - 1, 0)], s[i], s[i + 1]);
    }
    paint(ctx, s[s.length - 2], s[s.length - 1], s[s.length - 1]);
  };

  const render = (
    target: HTMLCanvasElement,
    w: number,
    h: number,
    scale: number,
    color: string,
  ) => {
    const ctx = target.getContext("2d")!;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    for (const s of strokes.current) drawStroke(ctx, s);
  };

  React.useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    if (!el || !cv) return;

    let dpr = 1;
    const inkColour = () => getComputedStyle(cv).color;
    redraw.current = () => render(cv, el.offsetWidth, el.offsetHeight, dpr, inkColour());
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      cv.width = Math.round(el.offsetWidth * dpr);
      cv.height = Math.round(el.offsetHeight * dpr);
      redraw.current();
    };
    size();

    let current: Stroke | null = null;
    let lastT = 0;
    let speed = 0;
    let id = -1;
    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const k = el.offsetWidth / (r.width || 1);
      return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    };
    const widthFor = (e: PointerEvent, v: number) => {
      const { maxWidth: hi, minWidth: lo } = cfg.current;
      // A pen reports pressure; a mouse does not, so speed stands in for it.
      const byPressure = e.pointerType === "pen" && e.pressure > 0 ? e.pressure : null;
      const byspeed = 1 - Math.min(1, v / 2.6);
      return lo + (hi - lo) * (byPressure ?? byspeed);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      el.setPointerCapture(e.pointerId);
      id = e.pointerId;
      const { x, y } = local(e);
      speed = 0;
      lastT = performance.now();
      current = [{ x, y, w: widthFor(e, 0) }];
      strokes.current.push(current);
      const ctx = cv.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = inkColour();
      drawStroke(ctx, current);
      setEmpty(false);
    };
    const onMove = (e: PointerEvent) => {
      if (!current || e.pointerId !== id) return;
      const ctx = cv.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = inkColour();
      // Pointers can report several positions per frame; take them all for a smoother line.
      const samples = e.getCoalescedEvents?.() ?? [e];
      for (const s of samples.length ? samples : [e]) {
        const { x, y } = local(s);
        const prev = current[current.length - 1];
        const dist = Math.hypot(x - prev.x, y - prev.y);
        if (dist < 1.2) continue;
        const now = performance.now();
        const v = dist / Math.max(now - lastT, 1); // px per ms
        lastT = now;
        speed = speed * 0.7 + v * 0.3; // smoothed so the width changes gently
        const dot = { x, y, w: widthFor(s, speed) };
        // Ease the width so it never jumps between neighbours.
        dot.w = prev.w * 0.6 + dot.w * 0.4;
        current.push(dot);
        if (current.length >= 3) {
          const n = current.length;
          paint(ctx, current[n - 3], current[n - 2], current[n - 1]);
        }
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!current || e.pointerId !== id) return;
      current = null;
      id = -1;
      cfg.current.onChange?.(cv.toDataURL("image/png"));
      redraw.current(); // redraw once so the last bit of the line is exactly the curve it should be
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    const ro = new ResizeObserver(size);
    ro.observe(el);
    const mo = new MutationObserver(() => redraw.current());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
    // `render`, `paint` and `drawStroke` only read refs, so they are safe to leave out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const api = React.useMemo<SignaturePadHandle>(
    () => ({
      clear: () => {
        strokes.current = [];
        setEmpty(true);
        redraw.current();
        cfg.current.onChange?.(null);
      },
      undo: () => {
        strokes.current.pop();
        setEmpty(strokes.current.length === 0);
        redraw.current();
        cfg.current.onChange?.(
          strokes.current.length ? canvas.current!.toDataURL("image/png") : null,
        );
      },
      isEmpty: () => strokes.current.length === 0,
      toDataURL: (color) => {
        const el = box.current!;
        const out = document.createElement("canvas");
        const scale = 2;
        out.width = el.offsetWidth * scale;
        out.height = el.offsetHeight * scale;
        render(out, el.offsetWidth, el.offsetHeight, scale, color ?? getComputedStyle(el).color);
        return out.toDataURL("image/png");
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  React.useImperativeHandle(ref, () => api, [api]);

  return (
    <div
      {...props}
      className={cn(
        "relative h-44 w-full overflow-hidden rounded-2xl border border-line bg-surface text-ink",
        className,
      )}
    >
      {guide && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 bottom-12 border-b border-dashed border-line-strong"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[3.35rem] left-6 font-display text-2xl leading-none text-muted"
          >
            ×
          </span>
        </>
      )}
      {empty && (
        <span className="pointer-events-none absolute inset-x-0 top-[38%] text-center text-sm text-muted/70">
          {placeholder}
        </span>
      )}
      <div
        ref={box}
        role="img"
        aria-label="Signature drawing area. Draw with a pointer or a finger."
        className="absolute inset-0 cursor-crosshair touch-none select-none"
      >
        <canvas ref={canvas} className="absolute inset-0 size-full" />
      </div>
      {controls && (
        <div className="absolute bottom-2.5 right-3 flex gap-1 text-xs">
          <button
            type="button"
            disabled={empty}
            onClick={api.undo}
            className="rounded-full px-2.5 py-1 text-muted transition-colors enabled:hover:bg-surface-muted enabled:hover:text-ink disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            disabled={empty}
            onClick={api.clear}
            className="rounded-full px-2.5 py-1 text-muted transition-colors enabled:hover:bg-surface-muted enabled:hover:text-ink disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
