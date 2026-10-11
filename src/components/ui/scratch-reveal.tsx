"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A scratch-off foil over your content that you drag away to reveal what is underneath.
 *
 * Once enough is clear it melts the rest and calls `onReveal`. Keyboard users get a "Reveal" button on focus.
 */
export function ScratchReveal({
  children,
  cover = "Scratch to reveal",
  brush = 30,
  threshold = 0.5,
  onReveal,
  className,
}: {
  /** What hides underneath. It stays in the DOM, so screen readers can read it. */
  children: React.ReactNode;
  /** Text printed on the foil. */
  cover?: string;
  /** Brush width in px. */
  brush?: number;
  /** Fraction of the foil (0–1) that must be cleared to reveal everything. */
  threshold?: number;
  onReveal?: () => void;
  className?: string;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const touched = React.useRef(false);
  const [done, setDone] = React.useState(false);

  const paintFoil = React.useCallback(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Layout size, not getBoundingClientRect: that would shrink under a CSS-scaled parent.
    const width = host.offsetWidth;
    const height = host.offsetHeight;
    cv.width = Math.max(Math.round(width * dpr), 1);
    cv.height = Math.max(Math.round(height * dpr), 1);
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#c8c4bb");
    g.addColorStop(0.28, "#f1efe9");
    g.addColorStop(0.52, "#b9b5ab");
    g.addColorStop(0.78, "#ebe8e1");
    g.addColorStop(1, "#c2beb4");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // brushed grain
    for (let i = 0; i < Math.round(width * height * 0.012); i++) {
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "255,255,255" : "27,26,23"},${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.4, 1.4);
    }
    // diagonal sheen
    const sheen = ctx.createLinearGradient(0, 0, width, 0);
    sheen.addColorStop(0, "rgba(255,255,255,0)");
    sheen.addColorStop(0.5, "rgba(255,255,255,0.5)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.save();
    ctx.translate(width * 0.32, 0);
    ctx.transform(1, 0, -0.45, 1, 0, 0);
    ctx.fillStyle = sheen;
    ctx.fillRect(-width * 0.12, 0, width * 0.24, height);
    ctx.restore();

    // embossed label
    const font = getComputedStyle(host).fontFamily;
    ctx.font = `500 15px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText(cover.toUpperCase().split("").join(" "), width / 2, height / 2 + 1);
    ctx.fillStyle = "rgba(27,26,23,0.5)";
    ctx.fillText(cover.toUpperCase().split("").join(" "), width / 2, height / 2);
  }, [cover]);

  React.useEffect(() => {
    paintFoil();
    const host = wrap.current;
    if (!host) return;
    const ro = new ResizeObserver(() => {
      if (!touched.current) paintFoil();
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [paintFoil]);

  const revealed = React.useRef(false);
  const finish = React.useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    setDone(true);
    onReveal?.();
  }, [onReveal]);

  const cleared = () => {
    const cv = canvas.current;
    if (!cv) return 0;
    const sw = 40;
    const sh = Math.max(Math.round((cv.height / cv.width) * sw), 1);
    const probe = document.createElement("canvas");
    probe.width = sw;
    probe.height = sh;
    const pc = probe.getContext("2d");
    if (!pc) return 0;
    pc.drawImage(cv, 0, 0, sw, sh);
    const data = pc.getImageData(0, 0, sw, sh).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] < 90) clear++;
    return clear / (sw * sh);
  };

  const last = React.useRef<{ x: number; y: number } | null>(null);
  const strokes = React.useRef(0);

  // Pointer position in the canvas's own CSS pixels, whatever the page zoom, display density or parent scale.
  const point = (cv: HTMLCanvasElement, e: React.PointerEvent) => {
    const r = cv.getBoundingClientRect();
    const fx = cv.offsetWidth / (r.width || 1);
    const fy = cv.offsetHeight / (r.height || 1);
    return { x: (e.clientX - r.left) * fx, y: (e.clientY - r.top) * fy };
  };

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || !last.current) return;
    const { x, y } = point(cv, e);
    // Draw in CSS pixels: map them to the bitmap (device pixels) here, every time.
    const k = cv.width / (cv.offsetWidth || 1);
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brush;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };
    if (++strokes.current % 6 === 0 && cleared() >= threshold) finish();
  };

  return (
    <div ref={wrap} className={cn("relative overflow-hidden rounded-lg", className)}>
      <div className="relative">{children}</div>
      <canvas
        ref={canvas}
        aria-hidden
        onPointerDown={(e) => {
          const cv = e.currentTarget;
          cv.setPointerCapture(e.pointerId);
          touched.current = true;
          last.current = point(cv, e);
          scratch(e);
        }}
        onPointerMove={scratch}
        onPointerUp={() => {
          last.current = null;
          if (cleared() >= threshold) finish();
        }}
        onPointerCancel={() => (last.current = null)}
        className={cn(
          "absolute inset-0 size-full cursor-crosshair touch-none transition-opacity duration-700",
          done && "pointer-events-none opacity-0",
        )}
      />
      {!done && (
        <button
          type="button"
          onClick={finish}
          className="absolute bottom-2 right-2 rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-surface opacity-0 outline-none focus-visible:opacity-100"
        >
          Reveal
        </button>
      )}
    </div>
  );
}
