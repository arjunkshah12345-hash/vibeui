"use client";

import { cn } from "@/lib/utils";

export function OrbitRing({
  items,
  className,
}: {
  items: { id: string; label: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto flex size-56 items-center justify-center",
        className,
      )}
    >
      <div className="absolute inset-6 rounded-full border border-dashed border-line" />
      <div className="vibe-orbit absolute inset-0">
        {items.map((item, i) => {
          const angle = (360 / items.length) * i;
          return (
            <span
              key={item.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translateY(-104px) rotate(-${angle}deg)`,
              }}
            >
              <span className="flex -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink shadow-[var(--shadow-quiet)]">
                {item.label}
              </span>
            </span>
          );
        })}
      </div>
      <div className="relative z-10 rounded-full border border-line bg-surface px-4 py-2 text-center">
        <p className="text-xs font-medium text-ink">VibeUI</p>
        <p className="font-mono text-[10px] text-faint">orbit</p>
      </div>
    </div>
  );
}
