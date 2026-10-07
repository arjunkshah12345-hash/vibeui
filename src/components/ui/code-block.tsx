"use client";

import * as React from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language = "tsx",
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
          {language}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-ink"
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? (
            <Check size={12} weight="bold" />
          ) : (
            <Copy size={12} weight="bold" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-ink-soft">
        <code>{code}</code>
      </pre>
    </div>
  );
}
