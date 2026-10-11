"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A button you press and hold to confirm: it fills as you hold, shakes if you let go too soon, and fires when full.
 *
 * Built for actions that should never happen by accident. Works with the mouse, touch, and holding Space or Enter.
 */
export function HoldButton({
  children,
  holdMs = 900,
  onConfirm,
  confirmedLabel = "Done",
  resetMs = 2200,
  tone = "ink",
  disabled,
  className,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  /** What the button says before it is confirmed. */
  children: React.ReactNode;
  /** How long to hold, in ms. */
  holdMs?: number;
  /** Called once the hold completes. */
  onConfirm?: () => void;
  /** Shown after confirming. */
  confirmedLabel?: React.ReactNode;
  /** After this many ms the button returns to its start state. 0 keeps it confirmed. */
  resetMs?: number;
  /** `danger` fills with red for destructive actions. */
  tone?: "ink" | "danger";
}) {
  const btn = React.useRef<HTMLButtonElement>(null);
  const [done, setDone] = React.useState(false);
  const progress = React.useRef(0);
  const holding = React.useRef(false);
  const raf = React.useRef(0);
  const last = React.useRef(0);
  const doneRef = React.useRef(false);

  const paint = React.useCallback(() => {
    btn.current?.style.setProperty("--hold", progress.current.toFixed(4));
  }, []);

  const finish = React.useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    holding.current = false;
    progress.current = 1;
    paint();
    setDone(true);
    navigator.vibrate?.(14);
    onConfirm?.();
    if (resetMs > 0) {
      window.setTimeout(() => {
        doneRef.current = false;
        progress.current = 0;
        paint();
        setDone(false);
      }, resetMs);
    }
  }, [onConfirm, paint, resetMs]);

  // The animation loop lives in a ref so it can schedule itself without referring to a variable not yet declared.
  const loop = React.useRef<FrameRequestCallback>(() => {});
  React.useEffect(() => {
    loop.current = (t: number) => {
      const dt = Math.min((t - last.current) / 1000, 0.05);
      last.current = t;
      if (holding.current) {
        progress.current = Math.min(1, progress.current + (dt * 1000) / holdMs);
        paint();
        if (progress.current >= 1) {
          finish();
          return;
        }
      } else if (progress.current > 0) {
        // Let go early: drain back quickly, so the fill visibly gives up.
        progress.current = Math.max(0, progress.current - dt * 3.2);
        paint();
      }
      if (holding.current || progress.current > 0)
        raf.current = requestAnimationFrame(loop.current);
      else raf.current = 0;
    };
  }, [finish, holdMs, paint]);

  const press = () => {
    if (disabled || doneRef.current || holding.current) return;
    holding.current = true;
    last.current = performance.now();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(loop.current);
  };

  const release = () => {
    if (!holding.current) return;
    holding.current = false;
    // Too soon: a small shake says "not yet".
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm && progress.current > 0.06 && progress.current < 1) {
      btn.current?.animate(
        [
          { translate: "0 0" },
          { translate: "-5px 0" },
          { translate: "4px 0" },
          { translate: "-3px 0" },
          { translate: "0 0" },
        ],
        { duration: 300, easing: "ease-out" },
      );
    }
    last.current = performance.now();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(loop.current);
  };

  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const fill = tone === "danger" ? "bg-[#e5484d]" : "bg-ink";
  const fillText = tone === "danger" ? "text-white" : "text-surface";

  return (
    <>
      <button
        {...props}
        ref={btn}
        type="button"
        disabled={disabled}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          press();
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            press();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") release();
        }}
        onBlur={release}
        onContextMenu={(e) => e.preventDefault()}
        className={cn(
          "relative inline-flex h-11 select-none items-center justify-center overflow-hidden rounded-lg border border-line bg-surface px-6 text-[15px] font-medium text-ink shadow-quiet outline-none [-webkit-touch-callout:none] [touch-action:none] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50",
          className,
        )}
        style={{ ["--hold" as string]: 0 }}
      >
        {/* the label as it looks on the plain button */}
        <span
          className={cn(
            "relative inline-flex items-center gap-2 transition-opacity",
            done && "opacity-0",
          )}
        >
          {children}
        </span>
        {/* the fill, clipped to how far you have held, with its own inverted copy of the label */}
        <span
          aria-hidden
          className={cn("absolute inset-0 flex items-center justify-center", fill, fillText)}
          style={{ clipPath: "inset(0 calc(100% - var(--hold) * 100%) 0 0)" }}
        >
          <span
            className={cn("inline-flex items-center gap-2 transition-opacity", done && "opacity-0")}
          >
            {children}
          </span>
        </span>
        {/* shown once the hold completes */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-2 transition-[opacity,transform] duration-300",
            fill,
            fillText,
            done ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3.5 8.5l3 3 6-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {confirmedLabel}
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {done ? "Confirmed" : ""}
      </span>
    </>
  );
}
