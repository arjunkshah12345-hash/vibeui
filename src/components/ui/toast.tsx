"use client";

import * as React from "react";
import { CheckCircle, Info, WarningOctagon, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type ToastTone = "neutral" | "success" | "error";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
};

type ToastContextValue = {
  toast: (item: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const toneIcon = {
  neutral: <Info size={18} weight="fill" className="text-muted" />,
  success: <CheckCircle size={18} weight="fill" className="text-pastel-sage-ink" />,
  error: <WarningOctagon size={18} weight="fill" className="text-pastel-rose-ink" />,
} as const;

/** Toast stack. Wrap your app in ToastProvider, call useToast().toast(...). */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setItems((prev) => [...prev.slice(-3), { ...item, id }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(100%-2rem,360px)] flex-col gap-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto flex animate-pop-in items-start gap-3 rounded-md border border-line bg-surface p-3.5 shadow-lift"
          >
            <span className="mt-px shrink-0">{toneIcon[item.tone ?? "neutral"]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{item.title}</p>
              {item.description ? (
                <p className="mt-0.5 text-[13px] leading-snug text-muted">
                  {item.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(item.id)}
              className="-mr-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-[6px] text-faint transition-colors hover:bg-surface-muted hover:text-ink"
            >
              <X size={12} weight="bold" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastDemoButton({ className }: { className?: string }) {
  const { toast } = useToast();
  return (
    <Button
      className={cn(className)}
      variant="secondary"
      onClick={() =>
        toast({
          tone: "success",
          title: "Draft saved",
          description: "Your changes are stored locally.",
        })
      }
    >
      Show toast
    </Button>
  );
}
