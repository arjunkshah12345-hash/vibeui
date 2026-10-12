"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ComboOption = {
  value: string;
  label: string;
  // Secondary text, searched as well and shown on the right.
  hint?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

// Wrap the part of the text that matched the query, so people see why a row is there.
function Marked({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-[3px] bg-transparent font-semibold text-ink underline decoration-accent/40 decoration-2 underline-offset-2">
        {text.slice(at, at + query.length)}
      </mark>
      {text.slice(at + query.length)}
    </>
  );
}

/**
 * A select you can type into: the list narrows as you write, and the arrow keys and Enter pick a row.
 *
 * Matches are underlined, the best matches come first, and the whole thing is announced properly
 * to screen readers. Use it where a plain select would need scrolling.
 */
export function Combobox({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  emptyText = "Nothing matches",
  clearable = false,
  name,
  disabled,
  className,
}: {
  options: ComboOption[];
  /** Controlled value. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  /** Shown when the search has no results. */
  emptyText?: string;
  /** Show a button that empties the selection. */
  clearable?: boolean;
  /** Adds a hidden input so the value is submitted with a form. */
  name?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [own, setOwn] = React.useState<string | null>(defaultValue ?? null);
  const current = value !== undefined ? value : own;
  const selected = options.find((o) => o.value === current) ?? null;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const root = React.useRef<HTMLDivElement>(null);
  const list = React.useRef<HTMLUListElement>(null);
  const id = React.useId();

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    const score = (o: ComboOption) => {
      const l = o.label.toLowerCase();
      const h = (o.hint ?? "").toLowerCase();
      if (l.startsWith(q)) return 0;
      if (l.includes(q)) return 1;
      if (h.includes(q)) return 2;
      return -1;
    };
    return options
      .map((o) => [o, score(o)] as const)
      .filter(([, s]) => s >= 0)
      .sort((a, b) => a[1] - b[1])
      .map(([o]) => o);
  }, [options, query]);

  React.useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  // Keep the highlighted row in view as the arrows move through a long list.
  React.useEffect(() => {
    if (!open) return;
    list.current
      ?.querySelector<HTMLElement>(`[data-i='${active}']`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const choose = (v: string | null) => {
    if (value === undefined) setOwn(v);
    onChange?.(v);
    setOpen(false);
    setQuery("");
  };

  const move = (dir: 1 | -1) => {
    if (!results.length) return;
    let i = active;
    for (let n = 0; n < results.length; n++) {
      i = (i + dir + results.length) % results.length;
      if (!results[i].disabled) break;
    }
    setActive(i);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(
          Math.max(
            0,
            results.findIndex((o) => o.value === current),
          ),
        );
      } else move(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      const o = results[active];
      if (o && !o.disabled) choose(o.value);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      setQuery("");
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActive(Math.max(0, results.length - 1));
    }
  };

  return (
    <div ref={root} className={cn("relative w-full", className)}>
      {name && <input type="hidden" name={name} value={current ?? ""} />}
      <div className="relative">
        {selected?.icon != null && !open && (
          <span className="pointer-events-none absolute left-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center text-muted [&_svg]:size-4">
            {selected.icon}
          </span>
        )}
        <input
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${id}-${active}` : undefined}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          value={open ? query : (selected?.label ?? "")}
          placeholder={open && selected ? selected.label : placeholder}
          onFocus={() => {
            setOpen(true);
            setActive(
              Math.max(
                0,
                options.findIndex((o) => o.value === current),
              ),
            );
          }}
          onClick={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKey}
          className={cn(
            "h-10 w-full rounded-sm border border-line-strong bg-surface pr-16 text-sm text-ink shadow-quiet outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint hover:border-faint focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            selected?.icon != null && !open ? "pl-10" : "pl-3",
            open && selected && "placeholder:text-ink-soft",
          )}
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {clearable && selected && (
            <button
              type="button"
              aria-label="Clear selection"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(null)}
              className="grid size-6 place-items-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          <span aria-hidden className="grid size-6 place-items-center text-muted">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className={cn(
                "transition-transform duration-300 ease-[cubic-bezier(0.3,1.5,0.5,1)]",
                open && "rotate-180",
              )}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-64 origin-top animate-pop-in overflow-auto rounded-xl border border-line bg-surface p-1 shadow-lift"
        >
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">{emptyText}</li>
          )}
          {results.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-${i}`}
              data-i={i}
              role="option"
              aria-selected={o.value === current}
              aria-disabled={o.disabled}
              onMouseDown={(e) => e.preventDefault()}
              onPointerEnter={() => !o.disabled && setActive(i)}
              onClick={() => !o.disabled && choose(o.value)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink transition-colors",
                active === i && "bg-surface-muted",
                o.disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {o.icon != null && (
                <span className="grid size-5 shrink-0 place-items-center text-muted [&_svg]:size-4">
                  {o.icon}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate">
                <Marked text={o.label} query={query.trim()} />
              </span>
              {o.hint && (
                <span className="shrink-0 text-xs text-muted">
                  <Marked text={o.hint} query={query.trim()} />
                </span>
              )}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className={cn(
                  "shrink-0 text-ink transition-opacity",
                  o.value === current ? "opacity-100" : "opacity-0",
                )}
              >
                <path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
