"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Full-width announcement bar with optional action and dismiss. */
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
        "flex items-center justify-between gap-4 rounded-md border border-line bg-surface px-4 py-2.5 text-sm text-ink-soft shadow-quiet",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_0_3px_var(--accent-soft)]"
        />
        <div className="min-w-0">{children}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {action}
        {dismissible ? (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setVisible(false)}
            className="flex size-7 items-center justify-center rounded-sm text-faint transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <X size={14} weight="bold" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
