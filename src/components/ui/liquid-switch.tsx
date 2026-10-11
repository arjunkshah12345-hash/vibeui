"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TRACK_W = 74;
const TRACK_H = 40;
const PAD = 3;
const THUMB_H = TRACK_H - PAD * 2;
const THUMB_REST = 42;
const THUMB_HELD = 56;

/**
 * Toggle with a liquid-glass thumb that stretches under your finger and settles with a squish.
 *
 * It turns see-through while held, follows a drag, and works controlled or uncontrolled.
 */
export function LiquidSwitch({
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  name,
  className,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> & {
  /** Controlled state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state after a tap, drag or key press. */
  onCheckedChange?: (checked: boolean) => void;
  /** Submit the state with a form under this name. */
  name?: string;
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = controlled ?? inner;
  const [held, setHeld] = React.useState(false);
  const [drag, setDrag] = React.useState<number | null>(null);
  const gesture = React.useRef<{
    x: number;
    t: number;
    cur: number;
    moved: boolean;
    scale: number;
  } | null>(null);
  const swallowClick = React.useRef(false);

  const commit = (next: boolean) => {
    if (controlled === undefined) setInner(next);
    onCheckedChange?.(next);
  };

  const travel = TRACK_W - PAD * 2 - THUMB_HELD;
  const width = held ? THUMB_HELD : THUMB_REST;
  const t = drag ?? (on ? 1 : 0);
  const left = PAD + t * (TRACK_W - PAD * 2 - width);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    props.onPointerDown?.(e);
    if (disabled || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = {
      x: e.clientX,
      t: on ? 1 : 0,
      cur: on ? 1 : 0,
      moved: false,
      scale:
        e.currentTarget.getBoundingClientRect().width / (e.currentTarget.offsetWidth || 1) || 1,
    };
    setHeld(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    props.onPointerMove?.(e);
    const g = gesture.current;
    if (!g) return;
    const dx = (e.clientX - g.x) / g.scale;
    if (Math.abs(dx) > 3) g.moved = true;
    if (!g.moved) return;
    g.cur = Math.min(1, Math.max(0, g.t + dx / travel));
    setDrag(g.cur);
  };

  const release = (e: React.PointerEvent<HTMLButtonElement>, cancelled: boolean) => {
    const g = gesture.current;
    gesture.current = null;
    setHeld(false);
    setDrag(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (g?.moved) {
      swallowClick.current = true;
      if (!cancelled) commit(g.cur > 0.5);
    }
  };

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        {...props}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => {
          props.onPointerUp?.(e);
          release(e, false);
        }}
        onPointerCancel={(e) => {
          props.onPointerCancel?.(e);
          release(e, true);
        }}
        onClick={(e) => {
          props.onClick?.(e);
          if (swallowClick.current) {
            swallowClick.current = false;
            return;
          }
          commit(!on);
        }}
        className={cn(
          "relative inline-block shrink-0 touch-none select-none rounded-full outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50",
          on ? "bg-accent" : "bg-ink/15",
          className,
        )}
        style={{ width: TRACK_W, height: TRACK_H, ...props.style }}
      >
        <span
          aria-hidden
          className="absolute top-[3px] block rounded-full"
          style={{
            width,
            height: THUMB_H,
            left,
            transition: [
              drag === null ? "left 0.5s var(--ease-spring)" : "left 0s",
              "width 0.5s var(--ease-spring)",
              "background-color 0.3s ease-out",
              "box-shadow 0.3s ease-out",
              "backdrop-filter 0.3s ease-out",
            ].join(", "),
            background: held ? "rgb(255 255 255 / 0.38)" : "rgb(255 255 255 / 0.96)",
            backdropFilter: held ? "blur(3px) saturate(1.8)" : "none",
            WebkitBackdropFilter: held ? "blur(3px) saturate(1.8)" : "none",
            boxShadow: held
              ? "inset 0 0 0 1px rgb(255 255 255 / 0.55), inset 1.5px 1.5px 0 -0.5px rgb(255 255 255 / 0.9), inset -1.5px -1.5px 0 -0.5px rgb(255 255 255 / 0.4), 0 6px 18px -4px rgb(0 0 0 / 0.35)"
              : "inset 0 -1px 0 rgb(0 0 0 / 0.06), 0 2px 6px rgb(0 0 0 / 0.22), 0 0 0 0.5px rgb(0 0 0 / 0.06)",
          }}
        />
      </button>
      {name && <input type="hidden" name={name} value={on ? "on" : "off"} />}
    </>
  );
}
