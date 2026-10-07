"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CarouselItem = {
  id: string;
  title: string;
  description: string;
  meta?: string;
  accent?: string;
};

type RotatingCarouselProps = {
  items: CarouselItem[];
  className?: string;
  autoPlay?: boolean;
  intervalMs?: number;
  radius?: number;
};

export function RotatingCarousel({
  items,
  className,
  autoPlay = true,
  intervalMs = 3200,
  radius = 220,
}: RotatingCarouselProps) {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = items.length;
  const step = 360 / Math.max(count, 1);

  React.useEffect(() => {
    if (!autoPlay || paused || count < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoPlay, paused, count, intervalMs]);

  const rotation = -active * step;

  return (
    <div
      className={cn("relative mx-auto w-full max-w-3xl select-none", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="relative mx-auto"
        style={{
          height: radius * 1.35,
          perspective: "1100px",
          perspectiveOrigin: "50% 40%",
        }}
      >
        <div
          className="vibe-carousel-track absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(8deg) rotateY(${rotation}deg)`,
            transition: "transform 900ms var(--ease-out)",
          }}
        >
          {items.map((item, index) => {
            const angle = index * step;
            const isActive = index === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                aria-current={isActive}
                className={cn(
                  "absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] border bg-surface p-5 text-left shadow-[var(--shadow-quiet)] transition-[opacity,filter,border-color] duration-500 ease-[var(--ease-out)]",
                  isActive
                    ? "border-ink z-10 opacity-100"
                    : "border-line opacity-55 hover:opacity-80",
                )}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  className="mb-3 h-1 w-8 rounded-full"
                  style={{ background: item.accent ?? "var(--ink)" }}
                />
                {item.meta ? (
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                    {item.meta}
                  </p>
                ) : null}
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.title}`}
            onClick={() => setActive(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === active
                ? "w-6 bg-ink"
                : "w-1.5 bg-line-strong hover:bg-muted",
            )}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          className="rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-soft hover:border-line-strong"
          onClick={() => setActive((i) => (i - 1 + count) % count)}
        >
          Prev
        </button>
        <button
          type="button"
          className="rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-soft hover:border-line-strong"
          onClick={() => setActive((i) => (i + 1) % count)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
