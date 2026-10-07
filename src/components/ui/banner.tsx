"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function Banner({
  children,
  action,
  dismissible,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}) {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 text-sm text-ink-soft",
        className,
      )}
    >
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex shrink-0 items-center gap-2">
        {action}
        {dismissible ? (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setVisible(false)}
            className="text-faint hover:text-ink"
          >
            <X size={14} weight="bold" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
