"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const decimals = (step: number) => (String(step).split(".")[1] ?? "").length;

/**
 * A slider with two handles for choosing a range, with an optional histogram of where the values sit.
 *
 * Drag either handle or click the track and the nearest one jumps there. Handles never cross, a
 * bubble shows the value while you hold one, and the arrow keys, Home and End move the focused handle.
 */
export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  minGap = 0,
  format = (n: number) => String(n),
  histogram,
  label,
  disabled,
  className,
}: {
  min?: number;
  max?: number;
  step?: number;
  /** Controlled range as `[low, high]`. */
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  /** Smallest distance to keep between the handles. */
  minGap?: number;
  /** How a number is written in the bubble and the readout, for example as a price. */
  format?: (n: number) => string;
  /** Bar heights drawn behind the track, low to high. Bars inside the range are darker. */
  histogram?: number[];
  /** Text above the slider. */
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [own, setOwn] = React.useState<[number, number]>(
    defaultValue ?? [min + (max - min) * 0.25, min + (max - min) * 0.75],
  );
  const [lo, hi] = value ?? own;
  const track = React.useRef<HTMLDivElement>(null);
  const [drag, setDrag] = React.useState<0 | 1 | null>(null);
  const [focus, setFocus] = React.useState<0 | 1 | null>(null);
  const [hover, setHover] = React.useState<0 | 1 | null>(null);
  const place = decimals(step);

  const snap = (v: number) => {
    const s = Math.round((v - min) / step) * step + min;
    return Math.min(max, Math.max(min, Number(s.toFixed(place))));
  };
  const commit = (next: [number, number]) => {
    if (value === undefined) setOwn(next);
    onChange?.(next);
  };
  const setThumb = (which: 0 | 1, raw: number) => {
    const v = snap(raw);
    if (which === 0) commit([Math.min(v, hi - minGap), hi]);
    else commit([lo, Math.max(v, lo + minGap)]);
  };

  const at = (e: React.PointerEvent) => {
    const r = track.current!.getBoundingClientRect();
    return min + ((e.clientX - r.left) / r.width) * (max - min);
  };

  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const shown = drag ?? focus ?? hover;

  const onKey = (which: 0 | 1) => (e: React.KeyboardEvent) => {
    const big = step * (e.shiftKey ? 10 : 1);
    const cur = which === 0 ? lo : hi;
    let next = cur;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = cur + big;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = cur - big;
    else if (e.key === "Home") next = which === 0 ? min : lo + minGap;
    else if (e.key === "End") next = which === 0 ? hi - minGap : max;
    else if (e.key === "PageUp") next = cur + step * 10;
    else if (e.key === "PageDown") next = cur - step * 10;
    else return;
    e.preventDefault();
    setThumb(which, next);
  };

  return (
    <div className={cn("w-full", disabled && "pointer-events-none opacity-50", className)}>
      {label && (
        <div className="mb-3 flex items-baseline justify-between text-[13px]">
          <span className="font-medium text-ink-soft">{label}</span>
          <span className="font-mono text-xs tabular-nums text-muted">
            {format(lo)} – {format(hi)}
          </span>
        </div>
      )}
      {histogram && histogram.length > 0 && (
        <div aria-hidden className="mb-1 flex h-12 items-end gap-[3px]">
          {histogram.map((h, i) => {
            const mid = min + ((i + 0.5) / histogram.length) * (max - min);
            const inside = mid >= lo && mid <= hi;
            return (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-t-[3px] transition-colors duration-200",
                  inside ? "bg-ink" : "bg-line-strong",
                )}
                style={{ height: `${Math.max(6, (h / Math.max(...histogram)) * 100)}%` }}
              />
            );
          })}
        </div>
      )}
      <div
        ref={track}
        className="relative h-6 cursor-pointer touch-none select-none"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          const v = at(e);
          // The nearer handle takes the pointer; on a tie, the one that can still move that way.
          const which: 0 | 1 = Math.abs(v - lo) < Math.abs(v - hi) || (v < lo && lo === hi) ? 0 : 1;
          setDrag(which);
          setThumb(which, v);
        }}
        onPointerMove={(e) => {
          if (drag !== null) setThumb(drag, at(e));
        }}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
      >
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line-strong" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        {([lo, hi] as const).map((v, i) => {
          const which = i as 0 | 1;
          const lowest = which === 0 ? min : lo + minGap;
          const highest = which === 0 ? hi - minGap : max;
          return (
            <div
              key={i}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-label={which === 0 ? "Minimum" : "Maximum"}
              aria-valuemin={lowest}
              aria-valuemax={highest}
              aria-valuenow={v}
              aria-valuetext={format(v)}
              onKeyDown={onKey(which)}
              onFocus={() => setFocus(which)}
              onBlur={() => setFocus(null)}
              onPointerEnter={() => setHover(which)}
              onPointerLeave={() => setHover(null)}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 outline-none"
              style={{
                left: `${pct(v)}%`,
                zIndex: drag === which || (which === 0 && lo >= hi - step) ? 3 : 2,
              }}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[11px] tabular-nums text-surface transition-[opacity,transform] duration-150",
                  shown === which ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                )}
              >
                {format(v)}
              </span>
              <span
                className={cn(
                  "block size-[22px] rounded-full border-2 border-ink bg-surface shadow-[0_2px_6px_rgb(0_0_0/0.25)] transition-transform duration-150 ease-[cubic-bezier(0.3,1.5,0.5,1)]",
                  (drag === which || hover === which) && "scale-110",
                  focus === which && "ring-[3px] ring-ring",
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
