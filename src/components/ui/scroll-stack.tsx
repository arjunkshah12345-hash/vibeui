"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ScrollStack({
  items,
  className,
}: {
  items: { title: string; body: string }[];
  className?: string;
}) {
  const refs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActive(i);
        },
        { threshold: 0.55 },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items.length]);

  return (
    <div className={cn("relative", className)}>
      <div className="sticky top-24 mb-3 flex gap-1.5">
        {items.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === active ? "w-6 bg-ink" : "w-1.5 bg-line-strong",
            )}
          />
        ))}
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn(
              "rounded-[var(--radius-lg)] border border-line bg-surface p-6 transition-all duration-500 ease-[var(--ease-out)]",
              i === active
                ? "opacity-100 shadow-[var(--shadow-lift)] scale-[1.01]"
                : "opacity-45 scale-[0.98]",
            )}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-lg font-medium tracking-[-0.02em] text-ink">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
