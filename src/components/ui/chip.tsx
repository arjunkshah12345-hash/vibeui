"use client";

import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

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
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
        selected
          ? "border-ink bg-ink text-surface"
          : "border-line bg-surface text-ink-soft hover:border-line-strong",
        className,
      )}
    >
      {children}
      {onRemove ? (
        <span
          role="button"
          tabIndex={0}
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              onRemove();
            }
          }}
          className="opacity-70 hover:opacity-100"
        >
          <X size={10} weight="bold" />
        </span>
      ) : null}
    </button>
  );
}
