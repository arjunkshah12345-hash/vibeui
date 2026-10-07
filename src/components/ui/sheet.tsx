"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function Sheet({
  open,
  onOpenChange,
  side = "right",
  title,
  children,
  trigger,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right";
  title: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const isOpen = open ?? uncontrolled;
  const setOpen = (v: boolean) => {
    setUncontrolled(v);
    onOpenChange?.(v);
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close sheet"
            className="absolute inset-0 bg-overlay"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal
            className={cn(
              "absolute inset-y-0 flex w-full max-w-sm flex-col border-line bg-surface shadow-[var(--shadow-lift)]",
              side === "right"
                ? "right-0 border-l animate-fade-up"
                : "left-0 border-r animate-fade-up",
            )}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X size={16} weight="bold" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
