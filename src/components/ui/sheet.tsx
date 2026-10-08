"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const noop = () => () => {};

const sides = {
  right: "inset-y-0 right-0 w-full max-w-sm border-l",
  left: "inset-y-0 left-0 w-full max-w-sm border-r",
  bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl border-t",
} as const;

/** Edge-anchored panel for settings, filters and detail views. */
export function Sheet({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  children,
  trigger,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: keyof typeof sides;
  title: string;
  description?: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const isOpen = open ?? uncontrolled;
  const titleId = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const mounted = React.useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  const setOpen = React.useCallback(
    (v: boolean) => {
      setUncontrolled(v);
      onOpenChange?.(v);
    },
    [onOpenChange],
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, setOpen]);

  return (
    <>
      <span className="inline-flex" onClick={() => setOpen(true)}>
        {trigger}
      </span>
      {isOpen && mounted
        ? createPortal(
            <div className="fixed inset-0 z-50">
              <div
                aria-hidden
                className="absolute inset-0 animate-fade-in bg-overlay backdrop-blur-[2px]"
                onClick={() => setOpen(false)}
              />
              <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={cn(
                  "absolute flex animate-fade-up flex-col border-line bg-surface shadow-pop outline-none",
                  sides[side],
                )}
              >
                <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
                  <div>
                    <h2
                      id={titleId}
                      className="text-[15px] font-medium tracking-[-0.01em] text-ink"
                    >
                      {title}
                    </h2>
                    {description ? (
                      <p className="mt-0.5 text-[13px] text-muted">
                        {description}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="-mr-1.5 flex size-8 items-center justify-center rounded-sm text-faint transition-colors hover:bg-surface-muted hover:text-ink"
                  >
                    <X size={16} weight="bold" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">{children}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
