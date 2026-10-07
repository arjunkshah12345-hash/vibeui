"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  className,
}: {
  items: { id: string; title: string; content: React.ReactNode }[];
  className?: string;
}) {
  const [open, setOpen] = React.useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-medium text-ink transition-colors hover:text-ink-soft"
            >
              {item.title}
              <span
                aria-hidden
                className="font-mono text-lg leading-none text-muted"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-4 text-sm leading-relaxed text-muted">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
