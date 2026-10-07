"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function FolderPreview({
  title,
  files,
  className,
}: {
  title: string;
  files: string[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={cn("group w-full max-w-xs text-left", className)}
    >
      <div className="relative">
        <div
          className={cn(
            "absolute -top-2 left-3 h-3 w-16 rounded-t-[6px] bg-line-strong transition-transform duration-300 ease-[var(--ease-out)]",
            open && "-translate-y-1",
          )}
        />
        <div
          className={cn(
            "relative overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface p-4 shadow-[var(--shadow-quiet)] transition-all duration-300 ease-[var(--ease-out)]",
            open && "pt-5 shadow-[var(--shadow-lift)]",
          )}
        >
          <p className="text-sm font-medium text-ink">{title}</p>
          <p className="mt-0.5 text-xs text-muted">{files.length} items</p>
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)]",
              open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <ul className="space-y-1.5 border-t border-line pt-3">
                {files.map((file) => (
                  <li
                    key={file}
                    className="truncate font-mono text-[11px] text-ink-soft"
                  >
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
