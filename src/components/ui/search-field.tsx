"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Search input with a leading icon and a clear button. */
export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
  className,
  autoFocus,
}: {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 rounded-sm border border-line-strong bg-surface px-3 shadow-quiet transition-[border-color,box-shadow] duration-150 hover:border-faint focus-within:border-accent focus-within:ring-[3px] focus-within:ring-ring",
        className,
      )}
    >
      <MagnifyingGlass size={16} className="shrink-0 text-faint" weight="bold" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange?.("")}
          className="flex size-5 shrink-0 animate-pop-in items-center justify-center rounded-full bg-surface-muted text-muted transition-[color,transform] duration-150 hover:text-ink active:scale-90"
        >
          <X size={10} weight="bold" />
        </button>
      ) : null}
    </div>
  );
}
