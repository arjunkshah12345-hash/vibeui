"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type HeatmapDay = {
  // ISO date, `YYYY-MM-DD`.
  date: string;
  value: number;
};

const DAY = 86_400_000;
const LEVELS = [
  "var(--surface-sunken)",
  "color-mix(in oklab, var(--accent) 24%, var(--surface-sunken))",
  "color-mix(in oklab, var(--accent) 46%, var(--surface-sunken))",
  "color-mix(in oklab, var(--accent) 72%, var(--surface-sunken))",
  "var(--accent)",
];

const utc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

const dayFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

/**
 * An activity heatmap in the style of a contribution graph: one cell per day, shaded by how much happened.
 *
 * It scales to its container, labels the months, and you can read any day with a pointer or the arrow keys.
 */
export function Heatmap({
  data,
  weeks = 26,
  unit = "contributions",
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** One entry per day. Missing days count as zero. */
  data: HeatmapDay[];
  /** How many weeks to show, ending with the week of the latest date. */
  weeks?: number;
  /** What the values count, used in the tooltip. */
  unit?: string;
}) {
  const grid = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<number | null>(null);
  const [armed, setArmed] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const model = React.useMemo(() => {
    const byDay = new Map<number, number>();
    let last = 0;
    for (const d of data) {
      const t = utc(d.date);
      byDay.set(t, (byDay.get(t) ?? 0) + d.value);
      last = Math.max(last, t);
    }
    const endDow = new Date(last).getUTCDay();
    // The last column holds the latest date; rows run Sunday to Saturday.
    const start = last - (weeks * 7 - 1 - (6 - endDow)) * DAY;
    const cells: { t: number; value: number; valid: boolean }[] = [];
    for (let i = 0; i < weeks * 7; i++) {
      const t = start + i * DAY;
      cells.push({ t, value: byDay.get(t) ?? 0, valid: t <= last });
    }
    // Shade by quantile of the busy days, so a few huge days do not wash out the rest.
    const busy = cells
      .filter((c) => c.value > 0)
      .map((c) => c.value)
      .sort((a, b) => a - b);
    const q = (p: number) => busy[Math.min(busy.length - 1, Math.floor(busy.length * p))] ?? 1;
    const cuts = [q(0.25), q(0.5), q(0.75)];
    const level = (v: number) =>
      v <= 0 ? 0 : v <= cuts[0] ? 1 : v <= cuts[1] ? 2 : v <= cuts[2] ? 3 : 4;
    const months: { week: number; label: string }[] = [];
    let prev = -1;
    for (let w = 0; w < weeks; w++) {
      const m = new Date(start + w * 7 * DAY).getUTCMonth();
      if (m !== prev && w <= weeks - 2)
        months.push({ week: w, label: monthFmt.format(start + w * 7 * DAY) });
      prev = m;
    }
    const total = cells.reduce((s, c) => s + (c.valid ? c.value : 0), 0);
    return { cells, level, months, total, count: cells.filter((c) => c.valid).length };
  }, [data, weeks]);

  const move = (delta: number) =>
    setActive((a) => {
      const from = a ?? (delta > 0 ? -1 : model.count);
      return Math.max(0, Math.min(model.count - 1, from + delta));
    });

  const cell = active === null ? null : model.cells[active];
  return (
    <div {...props} className={cn("w-full", className)}>
      <div
        ref={grid}
        tabIndex={0}
        role="img"
        aria-label={
          props["aria-label"] ??
          `Activity over ${weeks} weeks: ${model.total.toLocaleString()} ${unit}. Use the arrow keys to read each day.`
        }
        onKeyDown={(e) => {
          const step = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }[e.key];
          if (step) {
            e.preventDefault();
            move(step);
          } else if (e.key === "Home") setActive(0);
          else if (e.key === "End") setActive(model.count - 1);
          else if (e.key === "Escape") setActive(null);
        }}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className="relative rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
      >
        <div
          className="grid gap-x-[3px]"
          style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: weeks }, (_, w) => {
            const m = model.months.find((x) => x.week === w);
            return (
              <span
                key={w}
                className="mb-1.5 h-3.5 overflow-visible whitespace-nowrap font-mono text-[10px] leading-none text-faint"
              >
                {m?.label}
              </span>
            );
          })}
        </div>
        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateRows: "repeat(7, auto)",
            gridAutoFlow: "column",
            gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
          }}
        >
          {model.cells.map((c, i) =>
            c.valid ? (
              <span
                key={i}
                onPointerEnter={() => setActive(i)}
                className={cn(
                  "relative aspect-square w-full rounded-[3px] transition-[transform,opacity] duration-500 ease-out",
                  active === i && "z-10 ring-1 ring-ink/70",
                )}
                style={{
                  background: LEVELS[model.level(c.value)],
                  opacity: armed ? 1 : 0,
                  transform: armed ? undefined : "scale(0.4)",
                  transitionDelay: `${Math.floor(i / 7) * 14}ms`,
                }}
              >
                {active === i && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs shadow-lift"
                  >
                    <span className="font-medium tabular-nums text-ink">
                      {c.value.toLocaleString()} {unit}
                    </span>
                    <span className="text-muted"> · {dayFmt.format(c.t)}</span>
                  </span>
                )}
              </span>
            ) : (
              <span key={i} aria-hidden />
            ),
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 text-[11px] text-muted">
        <span className="tabular-nums">
          {model.total.toLocaleString()} {unit} in the last {weeks} weeks
        </span>
        <span className="flex items-center gap-1.5" aria-hidden>
          Less
          {LEVELS.map((c, i) => (
            <span key={i} className="size-[11px] rounded-[3px]" style={{ background: c }} />
          ))}
          More
        </span>
      </div>

      <p className="sr-only" aria-live="polite">
        {cell ? `${dayFmt.format(cell.t)}: ${cell.value} ${unit}` : ""}
      </p>
    </div>
  );
}
