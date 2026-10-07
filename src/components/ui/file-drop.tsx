"use client";

import * as React from "react";
import { UploadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function FileDrop({
  label = "Drop files here",
  hint = "or click to browse",
  onFiles,
  className,
}: {
  label?: string;
  hint?: string;
  onFiles?: (files: FileList) => void;
  className?: string;
}) {
  const [active, setActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setActive(false);
        if (e.dataTransfer.files?.length) onFiles?.(e.dataTransfer.files);
      }}
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed px-6 py-10 text-center transition-colors",
        active
          ? "border-ink bg-surface-muted"
          : "border-line bg-surface hover:border-line-strong hover:bg-surface-muted/50",
        className,
      )}
    >
      <UploadSimple size={22} className="mb-3 text-muted" weight="bold" />
      <p className="text-sm font-medium text-ink">{label}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) onFiles?.(e.target.files);
        }}
      />
    </button>
  );
}
