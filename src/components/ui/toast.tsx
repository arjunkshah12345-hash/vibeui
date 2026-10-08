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

const DURATION = 4500;

const toneIcon = {
  neutral: <Info size={18} weight="fill" className="text-muted" />,
  success: <CheckCircle size={18} weight="fill" className="text-pastel-sage-ink" />,
  error: <WarningOctagon size={18} weight="fill" className="text-pastel-rose-ink" />,
} as const;

const toneBar = {
  neutral: "bg-faint",
  success: "bg-pastel-sage-ink",
  error: "bg-pastel-rose-ink",
} as const;

function ToastCard({
  item,
  onRemove,
}: {
  item: ToastItem;
  onRemove: (id: string) => void;
}) {
  const [closing, setClosing] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const remaining = React.useRef(DURATION);
  const startedAt = React.useRef(0);

  const start = React.useCallback(() => {
    startedAt.current = performance.now();
    timer.current = window.setTimeout(() => setClosing(true), remaining.current);
  }, []);

  const pause = () => {
    window.clearTimeout(timer.current);
    remaining.current -= performance.now() - startedAt.current;
  };

  React.useEffect(() => {
    start();
    return () => window.clearTimeout(timer.current);
  }, [start]);

  return (
    <div
      role="status"
      onMouseEnter={pause}
      onMouseLeave={start}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && closing) onRemove(item.id);
      }}
      className={cn(
        "group/toast pointer-events-auto relative overflow-hidden rounded-md border border-line bg-surface shadow-lift",
        closing ? "animate-toast-out" : "animate-toast-in",
      )}
    >
      <div className="flex items-start gap-3 p-3.5">
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
          onClick={() => setClosing(true)}
          className="-mr-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-[6px] text-faint transition-[background-color,color,transform] duration-200 hover:rotate-90 hover:bg-surface-muted hover:text-ink active:scale-90"
        >
          <X size={12} weight="bold" />
        </button>
      </div>
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-0.5 origin-left animate-shrink-x opacity-60 group-hover/toast:[animation-play-state:paused]",
          toneBar[item.tone ?? "neutral"],
        )}
        style={{ animationDuration: `${DURATION}ms` }}
      />
    </div>
  );
}

/** Toast stack. Wrap your app in ToastProvider, call useToast().toast(...). */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const remove = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev.slice(-3), { ...item, id }]);
  }, []);

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
          <ToastCard key={item.id} item={item} onRemove={remove} />
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
