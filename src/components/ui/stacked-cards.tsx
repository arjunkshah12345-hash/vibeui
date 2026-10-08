"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Deck of cards. Click the top card to send it to the back. */
export function StackedCards({
  items,
  className,
}: {
  items: { title: string; body: string }[];
  className?: string;
}) {
  const [order, setOrder] = React.useState(() => items.map((_, i) => i));

  const cycle = () => setOrder(([first, ...rest]) => [...rest, first]);

  return (
    <div className={cn("relative mx-auto h-[200px] w-full max-w-sm", className)}>
      {items.map((item, i) => {
        const depth = order.indexOf(i);
        const visible = depth < 3;
        return (
          <button
            key={item.title}
            type="button"
            tabIndex={depth === 0 ? 0 : -1}
            aria-hidden={!visible}
            onClick={depth === 0 ? cycle : undefined}
            className={cn(
              "absolute inset-x-0 top-0 h-36 rounded-lg border border-line bg-surface p-5 text-left transition-[transform,opacity,box-shadow] duration-500 ease-out",
              depth === 0 ? "cursor-pointer shadow-lift hover:-translate-y-0.5" : "pointer-events-none shadow-quiet",
            )}
            style={{
              transform: `translateY(${depth * 18}px) scale(${1 - depth * 0.05})`,
              opacity: visible ? 1 - depth * 0.18 : 0,
              zIndex: items.length - depth,
              transformOrigin: "50% 100%",
            }}
          >
            <p className="font-mono text-[11px] text-faint">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-3 text-[15px] font-medium tracking-[-0.01em] text-ink">
              {item.title}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.body}</p>
          </button>
        );
      })}
    </div>
  );
}
