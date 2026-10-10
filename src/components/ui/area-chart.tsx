"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ChartSeries = {
  name: string;
  values: number[];
  // Any CSS colour. Defaults to the accent, then muted tones.
  color?: string;
};

const DEFAULT_COLORS = ["var(--accent)", "var(--muted)", "var(--faint)"];

const PAD = { top: 16, right: 14, bottom: 30, left: 46 };

// A tidy step (1, 2, 5 times a power of ten) so axis labels land on round numbers.
function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(raw));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow;
}

// Monotone cubic interpolation: smooth, and it never overshoots between points.
function curve(pts: { x: number; y: number }[]) {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0].x} ${pts[0].y}`;
  const dx: number[] = [];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1].x - pts[i].x);
    d.push((pts[i + 1].y - pts[i].y) / dx[i]);
  }
  const m = [d[0]];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  let path = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    path += ` C${pts[i].x + h} ${pts[i].y + m[i] * h} ${pts[i + 1].x - h} ${pts[i + 1].y - m[i + 1] * h} ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return path;
}

/**
 * A smooth area chart with a crosshair tooltip you can drive with a pointer or the arrow keys.
 *
 * One or more series share an axis. The line draws itself in, and the axis lands on round numbers.
 */
export function AreaChart({
  labels,
  series,
  height = 240,
  format = (n) => n.toLocaleString(),
  grid = true,
  animate = true,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** One label per point along the x axis, for example months. */
  labels: string[];
  /** One or more lines. Every `values` array should be as long as `labels`. */
  series: ChartSeries[];
  /** Chart height in px. The width follows its container. */
  height?: number;
  /** Formats values on the axis and in the tooltip. */
  format?: (value: number) => string;
  /** Draw horizontal grid lines. */
  grid?: boolean;
  /** Draw the lines in when the chart first appears. */
  animate?: boolean;
}) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const box = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [active, setActive] = React.useState<number | null>(null);
  const [armed, setArmed] = React.useState(!animate);

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (!animate) return;
    const raf = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const n = labels.length;
  const all = series.flatMap((s) => s.values);
  const hi = Math.max(...all, 1);
  const lo = Math.min(...all, 0);
  const step = niceStep((hi - lo) / 4 || 1);
  const yMax = Math.ceil(hi / step) * step;
  const yMin = Math.floor(lo / step) * step;
  const ticks: number[] = [];
  for (let v = yMin; v <= yMax + step / 2; v += step) ticks.push(v);

  const pw = Math.max(width - PAD.left - PAD.right, 1);
  const ph = height - PAD.top - PAD.bottom;
  const X = (i: number) => PAD.left + (n === 1 ? pw / 2 : (i / (n - 1)) * pw);
  const Y = (v: number) => PAD.top + ph - ((v - yMin) / (yMax - yMin || 1)) * ph;
  const color = (k: number) => series[k].color ?? DEFAULT_COLORS[k % DEFAULT_COLORS.length];

  const pick = (clientX: number) => {
    const el = box.current;
    if (!el || n === 0) return;
    const x = clientX - el.getBoundingClientRect().left;
    setActive(Math.max(0, Math.min(n - 1, Math.round(((x - PAD.left) / pw) * (n - 1)))));
  };

  const labelEvery = Math.max(1, Math.ceil(n / Math.max(Math.floor(pw / 78), 2)));
  const base = Y(Math.max(yMin, Math.min(0, yMax)));
  const tipLeft = active === null ? 0 : X(active);
  const flip = active !== null && tipLeft > width * 0.62;

  return (
    <div {...props} className={cn("relative w-full", className)} style={{ height, ...props.style }}>
      <div
        ref={box}
        tabIndex={0}
        role="img"
        aria-label={
          props["aria-label"] ??
          `${series.map((s) => s.name).join(", ")} over ${labels[0]} to ${labels[n - 1]}. Use the arrow keys to read each point.`
        }
        onPointerMove={(e) => pick(e.clientX)}
        onPointerLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            const dir = e.key === "ArrowRight" ? 1 : -1;
            setActive((a) => Math.max(0, Math.min(n - 1, (a ?? (dir > 0 ? -1 : n)) + dir)));
          } else if (e.key === "Home") setActive(0);
          else if (e.key === "End") setActive(n - 1);
          else if (e.key === "Escape") setActive(null);
        }}
        className="absolute inset-0 select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {width > 0 && (
          <svg width={width} height={height} className="absolute inset-0 overflow-visible">
            <defs>
              {series.map((_, k) => (
                <linearGradient key={k} id={`${id}g${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color(k)} stopOpacity={0.16} />
                  <stop offset="100%" stopColor={color(k)} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>

            {ticks.map((t) => (
              <g key={t}>
                {grid && (
                  <line
                    x1={PAD.left}
                    x2={width - PAD.right}
                    y1={Y(t)}
                    y2={Y(t)}
                    stroke="var(--line)"
                    strokeWidth={1}
                  />
                )}
                <text
                  x={PAD.left - 10}
                  y={Y(t)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-faint font-mono text-[10.5px]"
                >
                  {format(t)}
                </text>
              </g>
            ))}

            {labels.map((l, i) =>
              i % labelEvery === 0 ? (
                <text
                  key={i}
                  x={X(i)}
                  y={height - 8}
                  textAnchor={i === 0 ? "start" : "middle"}
                  className="fill-faint font-mono text-[10.5px]"
                >
                  {l}
                </text>
              ) : null,
            )}

            {[...series.keys()].reverse().map((k) => {
              const pts = series[k].values.map((v, i) => ({ x: X(i), y: Y(v) }));
              const line = curve(pts);
              const area = `${line} L${pts[pts.length - 1]?.x ?? 0} ${base} L${pts[0]?.x ?? 0} ${base} Z`;
              return (
                <g key={k}>
                  <path
                    d={area}
                    fill={`url(#${id}g${k})`}
                    style={{
                      opacity: armed ? 1 : 0,
                      transition: "opacity 0.9s ease-out 0.35s",
                    }}
                  />
                  <path
                    d={line}
                    fill="none"
                    stroke={color(k)}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    style={{
                      strokeDashoffset: armed ? 0 : 1,
                      transition: "stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </g>
              );
            })}

            {active !== null && (
              <g pointerEvents="none">
                <line
                  x1={X(active)}
                  x2={X(active)}
                  y1={PAD.top}
                  y2={PAD.top + ph}
                  stroke="var(--line-strong)"
                  strokeWidth={1}
                  strokeDasharray="3 4"
                />
                {series.map((s, k) => (
                  <circle
                    key={k}
                    cx={X(active)}
                    cy={Y(s.values[active])}
                    r={4.5}
                    fill="var(--surface)"
                    stroke={color(k)}
                    strokeWidth={2}
                  />
                ))}
              </g>
            )}
          </svg>
        )}

        {active !== null && (
          <div
            aria-hidden
            className="pointer-events-none absolute top-1 z-10 min-w-[8.5rem] rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs shadow-lift backdrop-blur"
            style={{
              left: tipLeft,
              transform: `translateX(${flip ? "calc(-100% - 14px)" : "14px"})`,
            }}
          >
            <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted">
              {labels[active]}
            </p>
            {series.map((s, k) => (
              <p key={k} className="flex items-center justify-between gap-4 py-0.5">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="size-2 rounded-full" style={{ background: color(k) }} />
                  {s.name}
                </span>
                <span className="font-medium tabular-nums text-ink">
                  {format(s.values[active])}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {active === null
          ? ""
          : `${labels[active]}: ${series.map((s) => `${s.name} ${format(s.values[active])}`).join(", ")}`}
      </p>
    </div>
  );
}
