"use client";

import * as React from "react";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Color chip with a name and token value. Click to copy the value. */
export function ColorSwatch({
  color,
  label,
  value,
  className,
}: {
  color: string;
  label: string;
  value?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      aria-label={`Copy ${value ?? color}`}
      onClick={async () => {
        await navigator.clipboard.writeText(value ?? color);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      className={cn(
        "group flex items-center gap-3 rounded-md text-left transition-transform duration-150 active:scale-[0.98]",
        className,
      )}
    >
      <span
        className="relative flex size-10 shrink-0 items-center justify-center rounded-sm shadow-[inset_0_0_0_1px_var(--line-strong)] transition-transform duration-300 ease-spring group-hover:scale-110 group-hover:-rotate-3"
        style={{ background: color }}
      >
        {copied ? (
          <Check size={16} weight="bold" className="animate-pop-in text-ink mix-blend-difference" />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {value ? (
          <span className="block font-mono text-[11px] text-muted transition-colors group-hover:text-ink">
            {copied ? "Copied" : value}
          </span>
        ) : null}
      </span>
    </button>
  );
}
