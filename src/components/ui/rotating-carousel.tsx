"use client";

import * as React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type CarouselItem = {
  id: string;
  title: string;
  description: string;
  meta?: string;
  accent?: string;
};

/** 3D ring carousel: drag, swipe, arrow keys, autoplay that pauses on hover. */
export function RotatingCarousel({
  items,
  className,
  autoPlay = true,
  intervalMs = 3600,
  radius = 300,
}: {
  items: CarouselItem[];
  className?: string;
  autoPlay?: boolean;
  intervalMs?: number;
  radius?: number;
}) {
  // `turn` is unbounded so wrapping last → first keeps spinning the same way.
  const [turn, setTurn] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const dragStart = React.useRef<number | null>(null);
  const count = items.length;
  const step = 360 / Math.max(count, 1);
  const active = ((turn % count) + count) % count;

  const go = React.useCallback((delta: number) => setTurn((t) => t + delta), []);

  const goTo = (index: number) => {
    let d = index - active;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    go(d);
  };

  React.useEffect(() => {
    if (!autoPlay || paused || count < 2) return;
    const id = window.setInterval(() => go(1), intervalMs);
    return () => window.clearInterval(id);
  }, [autoPlay, paused, count, intervalMs, go]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      tabIndex={0}
      className={cn("relative w-full select-none outline-offset-4", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onPointerDown={(e) => {
        dragStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (dragStart.current === null) return;
        const dx = e.clientX - dragStart.current;
        dragStart.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      <div
        className="relative mx-auto touch-pan-y"
        style={{
          height: 260,
          perspective: "1900px",
          perspectiveOrigin: "50% 45%",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(-${radius}px) rotateY(${-turn * step}deg)`,
            transition: "transform 900ms var(--ease-out)",
          }}
        >
          {items.map((item, index) => {
            const isActive = index === active;
            let delta = Math.abs(index - active);
            delta = Math.min(delta, count - delta);
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={-1}
                aria-label={`${item.title}${isActive ? " (current)" : ""}`}
                onClick={() => goTo(index)}
                className={cn(
                  "absolute left-1/2 top-1/2 h-[190px] w-[230px] -ml-[115px] -mt-[95px] cursor-pointer overflow-hidden rounded-lg border bg-surface p-5 text-left transition-[opacity,border-color,box-shadow] duration-700 ease-out",
                  isActive
                    ? "border-line-strong shadow-lift"
                    : "border-line shadow-quiet hover:border-line-strong",
                )}
                style={{
                  transform: `rotateY(${index * step}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  opacity: isActive ? 1 : delta === 1 ? 0.7 : 0.32,
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.14]"
                  style={{
                    background: `linear-gradient(180deg, ${item.accent ?? "var(--accent)"}, transparent)`,
                  }}
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: item.accent ?? "var(--accent)" }}
                    />
                    {item.meta ? (
                      <span className="font-mono text-[11px] text-faint">
                        {item.meta}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-auto font-display text-[26px] leading-[1.05] tracking-[-0.01em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-snug text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft shadow-quiet transition-[transform,border-color] duration-150 hover:border-line-strong active:scale-95"
        >
          <CaretLeft size={14} weight="bold" />
        </button>
        <div className="flex items-center gap-1.5">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show ${item.title}`}
              aria-current={index === active}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-300",
                index === active
                  ? "w-6 bg-accent"
                  : "w-1.5 bg-line-strong hover:bg-faint",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft shadow-quiet transition-[transform,border-color] duration-150 hover:border-line-strong active:scale-95"
        >
          <CaretRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
