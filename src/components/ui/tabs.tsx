"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  variant: "pill" | "line";
  baseId: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

/** Tabs with arrow-key navigation, in pill or underline style. */
export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  variant = "pill",
  className,
  children,
}: {
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
  variant?: "pill" | "line";
  className?: string;
  children: React.ReactNode;
}) {
  const baseId = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = controlled ?? uncontrolled;
  const setValue = (v: string) => {
    setUncontrolled(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, setValue, variant, baseId }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  onKeyDown,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useTabs();
  return (
    <div
      role="tablist"
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const tabs = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'),
        );
        const i = tabs.indexOf(document.activeElement as HTMLElement);
        const next = e.key === "ArrowRight" ? i + 1 : i - 1;
        const target = tabs[(next + tabs.length) % tabs.length];
        target?.focus();
        target?.click();
      }}
      className={cn(
        variant === "pill"
          ? "inline-flex gap-0.5 rounded-md bg-surface-muted p-1"
          : "flex gap-5 border-b border-line",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { value: active, setValue, variant, baseId } = useTabs();
  const selected = active === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => setValue(value)}
      className={cn(
        "text-[13px] font-medium transition-[color,background-color,box-shadow] duration-200",
        variant === "pill"
          ? cn(
              "h-8 rounded-sm px-3.5",
              selected
                ? "bg-surface text-ink shadow-quiet"
                : "text-muted hover:text-ink",
            )
          : cn(
              "-mb-px h-10 border-b-2",
              selected
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink",
            ),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { value: active, baseId } = useTabs();
  if (active !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      className={cn("mt-4 animate-fade-up", className)}
      {...props}
    >
      {children}
    </div>
  );
}
