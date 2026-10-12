"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

export type SplitItem = {
  label: string;
  onSelect?: () => void;
  // A second line of smaller text.
  description?: string;
  icon?: React.ReactNode;
  // Shown on the right, such as ⌘D.
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
};

/**
 * A button with a main action and a menu of related ones tucked behind a chevron.
 *
 * Click the label to do the usual thing; open the chevron for the alternatives. The menu opens
 * with a spring, supports arrow keys, Home, End and Escape, and closes when you click away.
 */
export function SplitButton({
  children,
  items,
  onClick,
  variant = "primary",
  size = "md",
  align = "end",
  className,
  disabled,
}: VariantProps<typeof buttonVariants> & {
  /** The main action's label. */
  children: React.ReactNode;
  /** The alternatives in the menu. */
  items: SplitItem[];
  /** The main action. */
  onClick?: () => void;
  /** Which edge of the button the menu lines up with. */
  align?: "start" | "end";
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const root = React.useRef<HTMLDivElement>(null);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const rows = React.useRef<(HTMLButtonElement | null)[]>([]);
  const id = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  // Move real focus with the highlighted row, so assistive tech follows along.
  React.useEffect(() => {
    if (open) rows.current[active]?.focus();
  }, [open, active]);

  const step = (from: number, dir: 1 | -1) => {
    for (let i = 1; i <= items.length; i++) {
      const next = (from + dir * i + items.length * 2) % items.length;
      if (!items[next].disabled) return next;
    }
    return from;
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") setActive((a) => step(a, 1));
    else if (e.key === "ArrowUp") setActive((a) => step(a, -1));
    else if (e.key === "Home") setActive(step(-1, 1));
    else if (e.key === "End") setActive(step(items.length, -1));
    else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      trigger.current?.focus();
      if (e.key === "Escape") e.preventDefault();
      return;
    } else return;
    e.preventDefault();
  };

  const sizes = { sm: "h-8", md: "h-10", lg: "h-12", icon: "h-10", "icon-sm": "h-8" } as const;
  const base = buttonVariants({ variant, size });
  return (
    <div ref={root} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(base, "rounded-r-none border-r-0 hover:translate-y-0")}
      >
        {children}
      </button>
      <span aria-hidden className="w-px self-stretch bg-current opacity-20" />
      <button
        ref={trigger}
        type="button"
        disabled={disabled}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={() => {
          setActive(step(-1, 1));
          setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setActive(step(-1, 1));
            setOpen(true);
          }
        }}
        className={cn(
          base,
          sizes[size ?? "md"],
          "w-10 rounded-l-none border-l-0 px-0 hover:translate-y-0",
        )}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={cn(
            "transition-transform duration-300 ease-[cubic-bezier(0.3,1.5,0.5,1)]",
            open && "rotate-180",
          )}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          id={`${id}-menu`}
          role="menu"
          aria-orientation="vertical"
          onKeyDown={onMenuKey}
          className={cn(
            "absolute top-full z-50 mt-2 min-w-56 origin-top animate-pop-in rounded-xl border border-line bg-surface p-1 shadow-lift",
            align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
          )}
        >
          {items.map((item, i) => (
            <button
              key={item.label}
              ref={(el) => {
                rows.current[i] = el;
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={item.disabled}
              onPointerEnter={() => !item.disabled && setActive(i)}
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
                item.onSelect?.();
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors disabled:opacity-40",
                active === i ? "bg-surface-muted" : "bg-transparent",
                item.danger ? "text-[#dc2626]" : "text-ink",
              )}
            >
              {item.icon != null && (
                <span className="grid size-5 shrink-0 place-items-center text-muted [&_svg]:size-4">
                  {item.icon}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{item.label}</span>
                {item.description && (
                  <span className="mt-0.5 block text-xs font-normal text-muted">
                    {item.description}
                  </span>
                )}
              </span>
              {item.shortcut && (
                <kbd className="font-mono text-[11px] text-muted">{item.shortcut}</kbd>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
