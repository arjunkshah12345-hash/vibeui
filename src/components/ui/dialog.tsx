"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

const noop = () => () => {};

/** Modal dialog: portaled, focus-trapping, animated in and out, Escape to close. */
export function Dialog({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const titleId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      // Remember what had focus so it can be restored when the dialog closes.
      if (next) triggerRef.current = document.activeElement as HTMLElement | null;
      setUncontrolled(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open, setOpen, titleId, triggerRef }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("DialogTrigger must be used within Dialog");
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={ctx.open}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        ctx.setOpen(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function DialogContent({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(DialogContext);
  const mounted = React.useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const panelRef = React.useRef<HTMLDivElement>(null);
  const open = !!ctx?.open;
  const setOpen = ctx?.setOpen;
  const triggerRef = ctx?.triggerRef;

  // Stay mounted until the exit animation has played.
  const [present, setPresent] = React.useState(open);
  if (open && !present) setPresent(true);

  React.useEffect(() => {
    if (!open || !setOpen) return;
    const trigger = triggerRef?.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open, setOpen, triggerRef]);

  if (!ctx || !present || !mounted) return null;
  const state = open ? "open" : "closed";

  return createPortal(
    <div
      data-state={state}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        !open && "pointer-events-none",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-overlay backdrop-blur-[2px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
        data-state={state}
        onClick={() => ctx.setOpen(false)}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ctx.titleId}
        data-state={state}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && !open) setPresent(false);
        }}
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-pop outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in",
          className,
        )}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => ctx.setOpen(false)}
          className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-sm text-faint transition-[background-color,color,transform] duration-200 hover:rotate-90 hover:bg-surface-muted hover:text-ink active:scale-90"
        >
          <X size={16} weight="bold" />
        </button>
        <div className="mb-5 pr-8">
          <h2
            id={ctx.titleId}
            className="text-[17px] font-medium tracking-[-0.02em] text-ink"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** Convenience: footer row for dialog actions. */
export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}
