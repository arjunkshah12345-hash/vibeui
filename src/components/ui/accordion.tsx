"use client";

import * as React from "react";
import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Expandable sections with smooth height animation. Single or multiple open. */
export function Accordion({
  items,
  type = "single",
  defaultOpen,
  className,
}: {
  items: { id: string; title: string; content: React.ReactNode }[];
  type?: "single" | "multiple";
  defaultOpen?: string[];
  className?: string;
}) {
  const baseId = React.useId();
  const [open, setOpen] = React.useState<string[]>(
    defaultOpen ?? (items[0] ? [items[0].id] : []),
  );

  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : type === "single"
          ? [id]
          : [...prev, id],
    );

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={`${baseId}-${item.id}-btn`}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-${item.id}-panel`}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-medium tracking-[-0.01em] text-ink"
              >
                <span className="transition-colors group-hover:text-ink-soft">
                  {item.title}
                </span>
                <Plus
                  aria-hidden
                  size={14}
                  weight="bold"
                  className={cn(
                    "shrink-0 text-muted transition-transform duration-300 ease-out",
                    isOpen && "rotate-45 text-accent",
                  )}
                />
              </button>
            </h3>
            <div
              id={`${baseId}-${item.id}-panel`}
              role="region"
              aria-labelledby={`${baseId}-${item.id}-btn`}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-4 pr-8 text-sm leading-relaxed text-muted">
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
