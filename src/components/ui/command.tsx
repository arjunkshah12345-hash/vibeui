"use client";

import * as React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Kbd } from "./kbd";

export function Command({
  items,
  placeholder = "Search commands…",
  className,
  onSelect,
}: {
  items: { id: string; label: string; hint?: string; group?: string }[];
  placeholder?: string;
  className?: string;
  onSelect?: (id: string) => void;
}) {
  const [q, setQ] = React.useState("");
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(q.toLowerCase()),
  );
  const groups = Array.from(new Set(filtered.map((i) => i.group ?? "General")));

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line px-3">
        <MagnifyingGlass size={16} className="text-faint" weight="bold" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
        />
        <Kbd>esc</Kbd>
      </div>
      <div className="max-h-64 overflow-y-auto p-1.5">
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted">No results</p>
        ) : (
          groups.map((group) => (
            <div key={group} className="mb-1">
              <p className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                {group}
              </p>
              {filtered
                .filter((i) => (i.group ?? "General") === group)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect?.(item.id)}
                    className="flex w-full items-center justify-between rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-[13px] text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
                  >
                    <span>{item.label}</span>
                    {item.hint ? (
                      <span className="font-mono text-[10px] text-faint">
                        {item.hint}
                      </span>
                    ) : null}
                  </button>
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
