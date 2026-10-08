"use client";

import * as React from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** A shell command in a pill with one-click copy. */
export function CopyCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      aria-label={`Copy command: ${command}`}
      className={cn(
        "group inline-flex h-12 max-w-full items-center gap-3 rounded-md border border-line bg-surface pl-4 pr-3 font-mono text-[13px] text-ink-soft shadow-quiet transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-lift",
        className,
      )}
    >
      <span aria-hidden className="select-none text-faint">$</span>
      <span className="scrollbar-none min-w-0 overflow-x-auto whitespace-nowrap">{command}</span>
      <span className="ml-1 flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-surface-muted text-muted transition-colors group-hover:text-ink">
        {copied ? (
          <Check size={14} weight="bold" className="text-pastel-sage-ink" />
        ) : (
          <Copy size={14} weight="bold" />
        )}
      </span>
    </button>
  );
}
