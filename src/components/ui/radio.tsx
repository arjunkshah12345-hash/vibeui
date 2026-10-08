"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  value: string;
  setValue: (v: string) => void;
  name: string;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

/** Single-choice group built on native radio inputs. */
export function RadioGroup({
  value: controlled,
  defaultValue,
  onValueChange,
  name,
  className,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  name?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const generated = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
  const value = controlled ?? uncontrolled;
  const setValue = (v: string) => {
    setUncontrolled(v);
    onValueChange?.(v);
  };

  return (
    <RadioGroupContext.Provider
      value={{ value, setValue, name: name ?? generated }}
    >
      <div role="radiogroup" className={cn("flex flex-col gap-3", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioItem({
  value,
  label,
  description,
  disabled,
  className,
}: {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}) {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioItem must be used within RadioGroup");

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
          type="radio"
          name={ctx.name}
          value={value}
          checked={ctx.value === value}
          disabled={disabled}
          onChange={() => ctx.setValue(value)}
          className="peer absolute inset-0 size-full cursor-[inherit] appearance-none rounded-full border border-line-strong bg-surface shadow-quiet transition-[background-color,border-color,box-shadow] duration-150 hover:border-faint checked:border-accent checked:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-accent-ink transition-transform duration-200 ease-out peer-checked:scale-100"
        />
      </span>
      <span className="flex flex-col">
        <span className="leading-[18px]">{label}</span>
        {description ? (
          <span className="mt-0.5 text-[13px] text-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
