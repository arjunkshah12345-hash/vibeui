"use client";

import { cn } from "@/lib/utils";

/** Native checkbox with an animated check and an optional label. */
export function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  id,
  name,
  className,
  label,
  description,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  label?: string;
  description?: string;
}) {
  return (
    <label
      className={cn(
        "flex w-fit cursor-pointer items-start gap-3 text-sm text-ink",
        disabled && "cursor-not-allowed opacity-45",
        className,
      )}
    >
      <span className="relative mt-px flex size-[18px] shrink-0">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="peer absolute inset-0 size-full cursor-[inherit] appearance-none rounded-[5px] border border-line-strong bg-surface shadow-quiet transition-[background-color,border-color,box-shadow] duration-150 hover:border-faint checked:border-accent checked:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        />
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full scale-50 p-[3px] text-accent-ink opacity-0 transition-[opacity,transform] duration-200 ease-out peer-checked:scale-100 peer-checked:opacity-100"
        >
          <path
            d="M3.5 8.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label || description ? (
        <span className="flex flex-col">
          {label ? <span className="leading-[18px]">{label}</span> : null}
          {description ? (
            <span className="mt-0.5 text-[13px] text-muted">{description}</span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
