"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 rounded-[var(--radius-sm)] border border-line bg-surface px-3 transition-[border-color,box-shadow] focus-within:border-ink focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ink)_10%,transparent)]",
        className,
      )}
    >
      <MagnifyingGlass size={16} className="shrink-0 text-faint" weight="bold" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => onChange?.("")}
          className="text-faint hover:text-ink"
        >
          <X size={14} weight="bold" />
        </button>
      ) : null}
    </div>
  );
}
