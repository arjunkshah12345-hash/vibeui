"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Announcement bar with optional action. Slides in, and fades out when dismissed. */
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
  const [closing, setClosing] = React.useState(false);
  const [gone, setGone] = React.useState(false);
  if (gone) return null;

  return (
    <div
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && closing) setGone(true);
      }}
      className={cn(
        "flex items-center justify-between gap-4 rounded-md border border-line bg-surface px-4 py-2.5 text-sm text-ink-soft shadow-quiet",
        closing ? "animate-pop-out" : "animate-fade-up",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span aria-hidden className="relative flex size-1.5 shrink-0">
          <span className="absolute inset-0 animate-ping-soft rounded-full bg-accent opacity-50" />
          <span className="relative size-1.5 rounded-full bg-accent" />
        </span>
        <div className="min-w-0">{children}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {action}
        {dismissible ? (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setClosing(true)}
            className="flex size-7 items-center justify-center rounded-sm text-faint transition-[background-color,color,transform] duration-200 hover:rotate-90 hover:bg-surface-muted hover:text-ink active:scale-90"
          >
            <X size={14} weight="bold" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
