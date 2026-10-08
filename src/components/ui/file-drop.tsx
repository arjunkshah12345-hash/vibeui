"use client";

import * as React from "react";
import { File as FileIcon, UploadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Drag-and-drop file target that also opens the file picker on click. */
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
  const [names, setNames] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const accept = (files: FileList) => {
    setNames(Array.from(files).map((f) => f.name));
    onFiles?.(files);
  };

  return (
    <div className={cn("w-full", className)}>
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
          if (e.dataTransfer.files?.length) accept(e.dataTransfer.files);
        }}
        className={cn(
          "group flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-6 py-9 text-center transition-[border-color,background-color] duration-200",
          active
            ? "border-accent bg-accent-soft"
            : "border-line-strong bg-surface hover:border-faint hover:bg-surface-muted/60",
        )}
      >
        <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-surface-muted text-muted transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:text-ink">
          <UploadSimple size={18} weight="bold" />
        </span>
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="mt-1 text-xs text-muted">{hint}</span>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => {
            if (e.target.files?.length) accept(e.target.files);
          }}
        />
      </button>
      {names.length ? (
        <ul className="mt-3 space-y-1.5">
          {names.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-sm bg-surface-muted px-3 py-2 text-[13px] text-ink-soft"
            >
              <FileIcon size={14} weight="bold" className="shrink-0 text-faint" />
              <span className="truncate">{name}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
