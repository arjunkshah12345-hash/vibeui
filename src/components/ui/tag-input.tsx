"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Free-form tag entry. Enter or comma adds, Backspace removes the last. */
export function TagInput({
  tags,
  onChange,
  placeholder = "Add tag…",
  className,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [draft, setDraft] = React.useState("");

  const add = () => {
    const t = draft.trim();
    if (!t || tags.includes(t)) return;
    onChange([...tags, t]);
    setDraft("");
  };

  return (
    <div
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-1.5 rounded-sm border border-line-strong bg-surface px-1.5 py-1.5 shadow-quiet transition-[border-color,box-shadow] duration-150 hover:border-faint focus-within:border-accent focus-within:ring-[3px] focus-within:ring-ring",
        className,
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex h-6 animate-pop-in items-center gap-1 rounded-[6px] bg-surface-muted pl-2 pr-1 text-[12px] font-medium text-ink-soft"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="flex size-4 items-center justify-center rounded-full text-faint transition-colors hover:bg-surface-sunken hover:text-ink"
          >
            <X size={10} weight="bold" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={add}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
          if (e.key === "Backspace" && !draft && tags.length) {
            onChange(tags.slice(0, -1));
          }
        }}
        placeholder={tags.length ? "" : placeholder}
        aria-label="Add tag"
        className="min-w-20 flex-1 bg-transparent px-1.5 text-sm text-ink outline-none placeholder:text-faint"
      />
    </div>
  );
}
