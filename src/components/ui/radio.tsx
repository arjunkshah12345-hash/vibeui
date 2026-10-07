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

export function RadioGroup({
  value: controlled,
  defaultValue,
  onValueChange,
  name = "radio",
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
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
  const value = controlled ?? uncontrolled;
  const setValue = (v: string) => {
    setUncontrolled(v);
    onValueChange?.(v);
  };

  return (
    <RadioGroupContext.Provider value={{ value, setValue, name }}>
      <div role="radiogroup" className={cn("flex flex-col gap-2.5", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioItem({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioItem must be used within RadioGroup");
  const selected = ctx.value === value;

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink",
        className,
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        name={ctx.name}
        onClick={() => ctx.setValue(value)}
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
          selected ? "border-ink" : "border-line-strong hover:border-ink",
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full bg-ink transition-transform duration-150",
            selected ? "scale-100" : "scale-0",
          )}
        />
      </button>
      {label}
    </label>
  );
}
