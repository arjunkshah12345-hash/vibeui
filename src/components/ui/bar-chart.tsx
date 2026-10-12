"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type BarDatum = { label: string; values: number[] };

const PALETTE = ["var(--ink)", "#9c9a92", "#cfcbc0", "#e6e2d8"];

// A tidy top for the scale: 1, 2, 2.5, 5 or 10 times a power of ten.
function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

/**
 * A bar chart that grows into place when it scrolls into view, with grouped or stacked bars and a hover card.
 *
 * Hover (or Tab to) a group and the rest fade back while a card lists every value. It measures its own
 * width, picks a tidy scale, and rounds the bars.
 */
export function BarChart({
  data,
  series = ["Value"],
  stacked = false,
  height = 260,
  colors = PALETTE,
  format = (n: number) => String(n),
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** One entry per category, with one value for each series. */
  data: BarDatum[];
  /** Names of the series, in the order of each entry's `values`. */
  series?: string[];
  /** Stack the series in one bar instead of placing them side by side. */
  stacked?: boolean;
  height?: number;
  /** One colour per series. */
  colors?: string[];
  /** How a value is written on the scale and in the card. */
  format?: (n: number) => string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [grown, setGrown] = React.useState(false);
  const [hot, setHot] = React.useState<number | null>(null);

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.offsetWidth));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setGrown(true), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const left = 40;
  const bottom = 28;
  const top = 10;
  const inner = Math.max(0, width - left - 8);
  const plotH = height - top - bottom;
  const peak = Math.max(
    ...data.map((d) => (stacked ? d.values.reduce((a, b) => a + b, 0) : Math.max(...d.values))),
    1,
  );
  const max = niceMax(peak);
  const y = (v: number) => top + plotH - (v / max) * plotH;
  const slot = data.length ? inner / data.length : 0;
  const groupW = Math.min(slot * 0.68, 84);
  const barW = stacked ? groupW : groupW / series.length;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tipLeft = hot !== null ? left + slot * hot + slot / 2 : 0;
  return (
    <div
      {...props}
      ref={box}
      className={cn("relative w-full", className)}
      style={{ height, ...props.style }}
      onPointerLeave={() => setHot(null)}
    >
      {width > 0 && (
        <svg width={width} height={height} className="overflow-visible">
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={left}
                x2={width - 8}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--line)"
                strokeDasharray={t === 0 ? undefined : "3 4"}
              />
              <text
                x={left - 8}
                y={y(t) + 3.5}
                textAnchor="end"
                className="fill-muted font-mono text-[10px]"
              >
                {format(t)}
              </text>
            </g>
          ))}
          {data.map((d, gi) => {
            const gx = left + slot * gi + (slot - groupW) / 2;
            let acc = 0;
            return (
              <g
                key={d.label}
                opacity={hot === null || hot === gi ? 1 : 0.35}
                style={{ transition: "opacity 160ms" }}
              >
                {d.values.map((v, si) => {
                  const h = Math.max(0, (v / max) * plotH);
                  const x = stacked ? gx : gx + barW * si;
                  const yy = stacked ? y(acc + v) : y(v);
                  acc += v;
                  return (
                    <rect
                      key={si}
                      x={x + (stacked ? 0 : 1.5)}
                      y={yy}
                      width={Math.max(0, barW - (stacked ? 0 : 3))}
                      height={h}
                      rx={Math.min(5, barW / 2)}
                      fill={colors[si % colors.length]}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "bottom",
                        transform: grown || reduce ? "scaleY(1)" : "scaleY(0)",
                        transition: reduce
                          ? undefined
                          : `transform 700ms cubic-bezier(0.25, 0.9, 0.3, 1) ${gi * 55 + si * 30}ms`,
                      }}
                    />
                  );
                })}
                <text
                  x={left + slot * gi + slot / 2}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-muted text-[11px]"
                >
                  {d.label}
                </text>
                {/* a wide, invisible target so the whole column responds */}
                <rect
                  x={left + slot * gi}
                  y={top}
                  width={slot}
                  height={plotH + bottom}
                  fill="transparent"
                  tabIndex={0}
                  role="img"
                  aria-label={`${d.label}: ${d.values.map((v, i) => `${series[i] ?? ""} ${format(v)}`).join(", ")}`}
                  onPointerEnter={() => setHot(gi)}
                  onFocus={() => setHot(gi)}
                  onBlur={() => setHot(null)}
                  className="outline-none"
                />
              </g>
            );
          })}
        </svg>
      )}
      {hot !== null && (
        <div
          className="pointer-events-none absolute z-10 min-w-32 -translate-x-1/2 rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lift"
          style={{
            left: Math.min(Math.max(tipLeft, 72), width - 72),
            top: -6,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="mb-1 font-medium text-ink">{data[hot].label}</p>
          {data[hot].values.map((v, i) => (
            <p key={i} className="flex items-center justify-between gap-4 text-muted">
              <span className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ background: colors[i % colors.length] }}
                />
                {series[i]}
              </span>
              <span className="font-mono tabular-nums text-ink">{format(v)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
