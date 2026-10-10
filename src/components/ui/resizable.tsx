"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Split panels with draggable dividers, laid out side by side or stacked.
 *
 * Each child is one panel. The dividers are keyboard-friendly separators: arrows nudge, Home and End jump to the limits.
 */
export function Resizable({
  children,
  direction = "horizontal",
  sizes: controlled,
  defaultSizes,
  minSize = 12,
  onSizesChange,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** One child per panel. */
  children: React.ReactNode;
  /** `horizontal` puts panels side by side, `vertical` stacks them (give the container a height). */
  direction?: "horizontal" | "vertical";
  /** Controlled panel sizes as percentages that add up to 100. */
  sizes?: number[];
  /** Initial sizes when uncontrolled. Defaults to equal panels. */
  defaultSizes?: number[];
  /** Smallest size any panel can shrink to, as a percentage. One number, or one per panel. */
  minSize?: number | number[];
  /** Called while a divider moves. */
  onSizesChange?: (sizes: number[]) => void;
}) {
  const panels = React.Children.toArray(children);
  const n = panels.length;
  const root = React.useRef<HTMLDivElement>(null);
  const [inner, setInner] = React.useState<number[]>(
    () => defaultSizes ?? Array.from({ length: n }, () => 100 / n),
  );
  const sizes = controlled ?? inner;
  const [active, setActive] = React.useState<number | null>(null);
  const drag = React.useRef<{ at: number; start: number; a: number; b: number } | null>(null);
  const horizontal = direction === "horizontal";

  const min = (i: number) => (Array.isArray(minSize) ? (minSize[i] ?? 10) : minSize);

  const apply = (i: number, nextA: number, a0: number, b0: number) => {
    const total = a0 + b0;
    const a = Math.max(min(i), Math.min(total - min(i + 1), nextA));
    const next = sizes.slice();
    next[i] = a;
    next[i + 1] = total - a;
    if (controlled === undefined) setInner(next);
    onSizesChange?.(next);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>, i: number) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      at: i,
      start: horizontal ? e.clientX : e.clientY,
      a: sizes[i],
      b: sizes[i + 1],
    };
    setActive(i);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = root.current;
    if (!d || !el) return;
    const rect = el.getBoundingClientRect();
    const px = (horizontal ? e.clientX : e.clientY) - d.start;
    const size = horizontal ? rect.width : rect.height;
    apply(d.at, d.a + (px / size) * 100, d.a, d.b);
  };

  const onPointerUp = () => {
    drag.current = null;
    setActive(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, i: number) => {
    const grow = horizontal ? "ArrowRight" : "ArrowDown";
    const shrink = horizontal ? "ArrowLeft" : "ArrowUp";
    const step = e.shiftKey ? 10 : 4;
    const a0 = sizes[i];
    const b0 = sizes[i + 1];
    let next: number | null = null;
    if (e.key === grow) next = a0 + step;
    else if (e.key === shrink) next = a0 - step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next === null) return;
    e.preventDefault();
    apply(i, next, a0, b0);
  };

  return (
    <div
      {...props}
      ref={root}
      className={cn(
        "flex w-full overflow-hidden",
        "h-full",
        horizontal ? "flex-row" : "flex-col",
        active !== null && "select-none",
        className,
      )}
    >
      {panels.map((panel, i) => (
        <React.Fragment key={i}>
          <div
            className="min-h-0 min-w-0 overflow-auto"
            style={{
              flex: `0 0 ${sizes[i]}%`,
              transition: active === null ? "flex-basis 0.2s var(--ease-out)" : undefined,
            }}
          >
            {panel}
          </div>
          {i < n - 1 && (
            <div
              role="separator"
              tabIndex={0}
              aria-orientation={horizontal ? "vertical" : "horizontal"}
              aria-label={`Resize panel ${i + 1} and ${i + 2}`}
              aria-valuenow={Math.round(sizes[i])}
              aria-valuemin={Math.round(min(i))}
              aria-valuemax={Math.round(sizes[i] + sizes[i + 1] - min(i + 1))}
              onPointerDown={(e) => onPointerDown(e, i)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "group relative z-10 flex shrink-0 touch-none items-center justify-center outline-none",
                horizontal ? "w-3 cursor-col-resize" : "h-3 cursor-row-resize",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute bg-line-strong transition-colors group-hover:bg-ink/40 group-focus-visible:bg-ink group-active:bg-ink",
                  horizontal
                    ? "inset-y-0 left-1/2 w-px -translate-x-1/2"
                    : "inset-x-0 top-1/2 h-px -translate-y-1/2",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "relative rounded-full bg-line-strong shadow-quiet transition-[background-color,transform] group-hover:bg-ink/50 group-focus-visible:bg-ink group-active:scale-110 group-active:bg-ink",
                  horizontal ? "h-8 w-1" : "h-1 w-8",
                )}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
