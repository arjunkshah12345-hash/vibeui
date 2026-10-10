"use client";

import * as React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  icon?: React.ReactNode;
};

/** Command palette: type to filter, arrows to move, Enter to run. */
export function Command({
  items,
  placeholder = "Search commands…",
  className,
  onSelect,
  autoFocus,
}: {
  items: CommandItem[];
  placeholder?: string;
  className?: string;
  onSelect?: (id: string) => void;
  autoFocus?: boolean;
}) {
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(q.toLowerCase()),
  );
  const groups = Array.from(new Set(filtered.map((i) => i.group ?? "General")));
  const index = Math.min(active, Math.max(filtered.length - 1, 0));

  React.useEffect(() => {
    // Scroll only the list. scrollIntoView would also scroll the page.
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>('[data-active="true"]');
    if (!list || !el) return;
    const l = list.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top < l.top) list.scrollTop -= l.top - r.top;
    else if (r.bottom > l.bottom) list.scrollTop += r.bottom - l.bottom;
  }, [index, q]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-surface shadow-lift",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-4">
        <MagnifyingGlass size={16} className="text-faint" weight="bold" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((index + 1) % Math.max(filtered.length, 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive(
                (index - 1 + filtered.length) % Math.max(filtered.length, 1),
              );
            } else if (e.key === "Enter" && filtered[index]) {
              onSelect?.(filtered[index].id);
            }
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-label={placeholder}
          className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
        />
      </div>
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        className="max-h-72 overflow-y-auto p-1.5"
      >
        {filtered.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted">
            No results for “{q}”
          </p>
        ) : (
          groups.map((group) => (
            <div key={group} className="mb-1 last:mb-0">
              <p className="px-2.5 pb-1 pt-2 text-[11px] font-medium text-faint">
                {group}
              </p>
              {filtered
                .filter((i) => (i.group ?? "General") === group)
                .map((item) => {
                  const isActive = filtered[index]?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onMouseMove={() => setActive(filtered.indexOf(item))}
                      onClick={() => onSelect?.(item.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-[13px] transition-colors",
                        isActive
                          ? "bg-surface-muted text-ink"
                          : "text-ink-soft",
                      )}
                    >
                      {item.icon ? (
                        <span className="flex size-4 items-center justify-center text-muted">
                          {item.icon}
                        </span>
                      ) : null}
                      <span className="flex-1">{item.label}</span>
                      {item.hint ? (
                        <kbd className="rounded-[5px] border border-line bg-surface px-1.5 font-mono text-[10px] text-faint">
                          {item.hint}
                        </kbd>
                      ) : null}
                    </button>
                  );
                })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
