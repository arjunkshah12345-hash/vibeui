"use client";

import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Selectable, removable filter chip. */
export function Chip({
  children,
  onRemove,
  selected,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border text-[12px] font-medium transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.95]",
        selected
          ? "border-ink bg-ink text-surface"
          : "border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={cn(
          "h-full rounded-full pl-3 outline-offset-0",
          onRemove ? "pr-1.5" : "pr-3",
        )}
      >
        {children}
      </button>
      {onRemove ? (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className="mr-1 flex size-5 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
        >
          <X size={10} weight="bold" />
        </button>
      ) : null}
    </span>
  );
}
