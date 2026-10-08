"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Folder that opens to let its files rise out for a peek. */
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
  const papers = files.slice(0, 3);

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={`${title}, ${files.length} items`}
      onClick={() => setOpen((v) => !v)}
      className={cn("group relative block h-44 w-full max-w-[260px] text-left", className)}
    >
      {/* back panel and tab */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[104px] w-full rounded-lg bg-surface-sunken ring-1 ring-inset ring-line-strong"
      />
      <span
        aria-hidden
        className="absolute bottom-[100px] left-0 h-5 w-[84px] rounded-t-[10px] bg-surface-sunken ring-1 ring-inset ring-line-strong"
      />
      {/* papers: hidden behind the front panel until the folder opens */}
      {papers.map((file, i) => (
        <span
          key={file}
          aria-hidden
          className="absolute bottom-3 flex h-[88px] items-start rounded-md border border-line bg-surface px-3 pt-2.5 font-mono text-[10.5px] text-muted shadow-quiet transition-transform duration-500 ease-spring"
          style={{
            left: 14 + i * 4,
            right: 14 - i * 4,
            zIndex: i + 1,
            transitionDelay: `${i * 45}ms`,
            transform: open
              ? `translateY(${-(46 + i * 10)}px) rotate(${(i - 1) * 3.5}deg)`
              : "translateY(0)",
          }}
        >
          {file}
        </span>
      ))}
      {/* front panel */}
      <span
        className={cn(
          "absolute bottom-0 left-0 z-10 flex h-[84px] w-full items-end justify-between rounded-lg border border-line-strong bg-surface-muted p-4 shadow-quiet transition-[transform,box-shadow] duration-500 ease-out",
          open ? "shadow-lift [transform:perspective(600px)_rotateX(-6deg)]" : "group-hover:-translate-y-0.5",
        )}
        style={{ transformOrigin: "bottom" }}
      >
        <span>
          <span className="block text-sm font-medium tracking-[-0.01em] text-ink">{title}</span>
          <span className="mt-0.5 block text-xs text-muted">
            {files.length} {files.length === 1 ? "item" : "items"}
          </span>
        </span>
        <span
          aria-hidden
          className={cn(
            "size-2 rounded-full transition-colors duration-300",
            open ? "bg-accent" : "bg-line-strong",
          )}
        />
      </span>
    </button>
  );
}
