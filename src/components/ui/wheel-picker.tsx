"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type WheelColumn = {
  id: string;
  options: string[];
  // Width of this column in px. Defaults to sharing the space evenly.
  width?: number;
  // Align the text toward the middle of the picker.
  align?: "left" | "center" | "right";
};

const ITEM = 40; // row height in px
const VISIBLE = 5; // rows on screen, an odd number so one sits in the middle

/**
 * The iOS wheel picker: columns that spin with real momentum, snap to a row, and curve away in 3D.
 *
 * It is built on native scroll snapping, so touch, trackpad and mouse wheel all feel right. Arrow keys work too.
 */
export function WheelPicker({
  columns,
  value: controlled,
  defaultValue,
  onValueChange,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /** One entry per wheel. */
  columns: WheelColumn[];
  /** Controlled selection: one option per column, in order. */
  value?: string[];
  /** Initial selection when uncontrolled. Defaults to the first option of each column. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}) {
  const [inner, setInner] = React.useState<string[]>(
    () => defaultValue ?? columns.map((c) => c.options[0]),
  );
  const value = controlled ?? inner;

  const change = (col: number, option: string) => {
    if (value[col] === option) return;
    const next = value.slice();
    next[col] = option;
    if (controlled === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <div
      {...props}
      className={cn("relative select-none rounded-xl bg-surface-muted/60 px-2", className)}
      style={{ height: ITEM * VISIBLE, ...props.style }}
    >
      {/* the selection band, behind the text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-lg bg-surface shadow-quiet ring-1 ring-line"
        style={{ height: ITEM }}
      />
      <div className="relative flex h-full">
        {columns.map((col, ci) => (
          <Wheel
            key={col.id}
            column={col}
            selected={value[ci] ?? col.options[0]}
            onSelect={(o) => change(ci, o)}
          />
        ))}
      </div>
      {/* fade the rows that curve away */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl [background:linear-gradient(var(--canvas),transparent_30%,transparent_70%,var(--canvas))] opacity-80"
      />
    </div>
  );
}

function Wheel({
  column,
  selected,
  onSelect,
}: {
  column: WheelColumn;
  selected: string;
  onSelect: (option: string) => void;
}) {
  const list = React.useRef<HTMLDivElement>(null);
  const rows = React.useRef<(HTMLDivElement | null)[]>([]);
  const settle = React.useRef(0);
  const programmatic = React.useRef(false);
  const drag = React.useRef<{ y: number; top: number; scale: number; moved: boolean } | null>(null);
  const { options } = column;
  const index = Math.max(0, options.indexOf(selected));

  // Bend every row by how far it sits from the middle: that is the whole 3D effect.
  const curve = React.useCallback(() => {
    const el = list.current;
    if (!el) return;
    const mid = el.scrollTop / ITEM;
    rows.current.forEach((row, i) => {
      if (!row) return;
      const d = i - mid;
      const a = Math.max(-1, Math.min(1, d / 2.4));
      row.style.transform = `rotateX(${-a * 62}deg) scale(${1 - Math.abs(a) * 0.12})`;
      row.style.opacity = String(1 - Math.min(Math.abs(a), 1) * 0.72);
    });
  }, []);

  const goTo = React.useCallback((i: number, smooth: boolean) => {
    const el = list.current;
    if (!el) return;
    programmatic.current = true;
    el.scrollTo({ top: i * ITEM, behavior: smooth ? "smooth" : "auto" });
    window.setTimeout(() => (programmatic.current = false), smooth ? 450 : 30);
  }, []);

  // Keep the scroll position in step with the selected option (set from outside, or on first paint).
  React.useEffect(() => {
    const el = list.current;
    if (!el) return;
    if (Math.abs(el.scrollTop - index * ITEM) > 1 && !drag.current) goTo(index, false);
    curve();
  }, [index, goTo, curve]);

  const onScroll = () => {
    curve();
    if (programmatic.current) return;
    window.clearTimeout(settle.current);
    // Wait for the momentum to stop, then read which row landed in the middle.
    settle.current = window.setTimeout(() => {
      const el = list.current;
      if (!el) return;
      const i = Math.max(0, Math.min(options.length - 1, Math.round(el.scrollTop / ITEM)));
      onSelect(options[i]);
    }, 90);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const to =
      e.key === "ArrowDown"
        ? index + 1
        : e.key === "ArrowUp"
          ? index - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? options.length - 1
              : null;
    if (to === null) return;
    e.preventDefault();
    const i = Math.max(0, Math.min(options.length - 1, to));
    goTo(i, true);
    onSelect(options[i]);
  };

  // Mouse users can drag the wheel. Touch and trackpad already scroll natively, so they are left alone.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    drag.current = {
      y: e.clientY,
      top: el.scrollTop,
      scale: el.offsetHeight / (r.height || 1),
      moved: false,
    };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const el = e.currentTarget;
    if (!d.moved && Math.abs(e.clientY - d.y) > 4) {
      // Only now is it a drag: capturing earlier would swallow the click on a row.
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
    }
    if (d.moved) el.scrollTop = d.top - (e.clientY - d.y) * d.scale;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const el = e.currentTarget;
    drag.current = null;
    if (!d.moved) return;
    el.style.scrollSnapType = "";
    el.style.cursor = "";
    const i = Math.max(0, Math.min(options.length - 1, Math.round(el.scrollTop / ITEM)));
    goTo(i, true);
    onSelect(options[i]);
  };

  const pad = (ITEM * (VISIBLE - 1)) / 2;
  return (
    <div
      ref={list}
      role="listbox"
      tabIndex={0}
      aria-label={column.id}
      aria-activedescendant={undefined}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative h-full flex-1 cursor-grab snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-lg outline-none [-ms-overflow-style:none] [perspective:600px] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
      style={{ flexBasis: column.width ?? 0, flexGrow: column.width ? 0 : 1, flexShrink: 0 }}
    >
      <div style={{ height: pad }} aria-hidden />
      {options.map((o, i) => (
        <div
          key={o}
          ref={(el) => {
            rows.current[i] = el;
          }}
          role="option"
          aria-selected={i === index}
          onClick={() => {
            goTo(i, true);
            onSelect(o);
          }}
          className={cn(
            "flex snap-center items-center px-3 text-[19px] tabular-nums text-ink [transform-origin:center] [will-change:transform]",
            column.align === "right"
              ? "justify-end"
              : column.align === "left"
                ? "justify-start"
                : "justify-center",
            i === index ? "font-medium" : "font-normal",
          )}
          style={{ height: ITEM }}
        >
          {o}
        </div>
      ))}
      <div style={{ height: pad }} aria-hidden />
    </div>
  );
}
