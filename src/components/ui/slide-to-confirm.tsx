"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const HANDLE = 52; // handle diameter in px
const PAD = 4;

/**
 * The slide-to-unlock control: drag the handle across to confirm, and it springs back if you stop short.
 *
 * The label shimmers as an invitation and fades as you pull. Keyboard users press the arrow keys or End.
 */
export function SlideToConfirm({
  children = "Slide to confirm",
  confirmedLabel = "Confirmed",
  onConfirm,
  threshold = 0.92,
  resetMs = 2400,
  disabled,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> & {
  /** The invitation printed on the track. */
  children?: React.ReactNode;
  /** Shown after confirming. */
  confirmedLabel?: React.ReactNode;
  /** Called once the handle reaches the end. */
  onConfirm?: () => void;
  /** How far across (0 to 1) counts as done. */
  threshold?: number;
  /** After this many ms the control resets. 0 leaves it confirmed. */
  resetMs?: number;
  disabled?: boolean;
}) {
  const track = React.useRef<HTMLDivElement>(null);
  const [p, setP] = React.useState(0); // 0 to 1
  const [dragging, setDragging] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const drag = React.useRef<{ x: number; p: number; room: number } | null>(null);

  const [width, setWidth] = React.useState(280);
  React.useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const room = Math.max(width - HANDLE - PAD * 2, 1);

  const finish = React.useCallback(() => {
    setDone(true);
    setP(1);
    navigator.vibrate?.(16);
    onConfirm?.();
    if (resetMs > 0) {
      window.setTimeout(() => {
        setDone(false);
        setP(0);
      }, resetMs);
    }
  }, [onConfirm, resetMs]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || done || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = track.current?.getBoundingClientRect();
    const scale = (track.current?.offsetWidth ?? 1) / (r?.width || 1);
    drag.current = { x: e.clientX, p, room: room / scale };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    setP(clamp(d.p + (e.clientX - d.x) / d.room, 0, 1));
  };
  const end = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    if (p >= threshold) finish();
    else setP(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || done) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = clamp(p + 0.25, 0, 1);
      if (next >= threshold) finish();
      else setP(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setP(clamp(p - 0.25, 0, 1));
    } else if (e.key === "End" || e.key === "Enter") {
      e.preventDefault();
      finish();
    } else if (e.key === "Home" || e.key === "Escape") {
      setP(0);
    }
  };

  const x = p * room;
  const spring =
    "transform 0.5s cubic-bezier(0.34, 1.4, 0.64, 1), width 0.5s cubic-bezier(0.34, 1.4, 0.64, 1)";
  return (
    <div
      {...props}
      ref={track}
      className={cn(
        "relative h-[60px] w-full max-w-xs select-none overflow-hidden rounded-full border border-line bg-surface-muted shadow-[inset_0_2px_6px_rgb(0_0_0/0.06)]",
        disabled && "opacity-50",
        className,
      )}
    >
      {/* the fill grows behind the handle */}
      <div
        aria-hidden
        className="absolute rounded-full bg-ink"
        style={{
          left: PAD,
          top: PAD,
          height: HANDLE,
          width: HANDLE + x,
          transition: dragging ? "none" : spring,
        }}
      />
      {/* the invitation: shimmering, and gone by the time you are halfway */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center pl-[56px] text-[15px] font-medium"
        style={{ opacity: clamp(1 - p * 2.2, 0, 1) }}
      >
        <span className="animate-shimmer bg-[linear-gradient(110deg,var(--muted)_35%,var(--ink)_50%,var(--muted)_65%)] bg-[length:250%_100%] bg-clip-text text-transparent">
          {children}
        </span>
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-[15px] font-medium text-surface transition-opacity duration-300"
        style={{ opacity: done ? 1 : 0 }}
      >
        {confirmedLabel}
      </span>

      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={typeof children === "string" ? children : "Slide to confirm"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(p * 100)}
        aria-valuetext={done ? "Confirmed" : `${Math.round(p * 100)}%`}
        aria-disabled={disabled}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={onKeyDown}
        className={cn(
          "absolute top-1/2 grid touch-none place-items-center rounded-full bg-surface text-ink shadow-[0_4px_14px_-2px_rgb(0_0_0/0.35),0_0_0_1px_rgb(0_0_0/0.05)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{
          left: PAD,
          width: HANDLE,
          height: HANDLE,
          transform: `translate(${x}px, -50%) scale(${dragging ? 1.05 : 1})`,
          transition: dragging ? "none" : spring,
        }}
      >
        {done ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M5 11.5l4 4 8-9"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            aria-hidden
            style={{ transform: `translateX(${p * 3}px)` }}
          >
            <path
              d="M4 11h13M12 5.5l5.5 5.5L12 16.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {done ? "Confirmed" : ""}
      </span>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}
