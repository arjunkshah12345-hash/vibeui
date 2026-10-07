"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
};

type ToastContextValue = {
  toast: (item: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { ...item, id }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(100%-2rem,320px)] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto rounded-[var(--radius-md)] border border-line bg-surface p-3 shadow-[var(--shadow-lift)] animate-fade-up"
          >
            <p className="text-sm font-medium text-ink">{item.title}</p>
            {item.description ? (
              <p className="mt-0.5 text-xs text-muted">{item.description}</p>
            ) : null}
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
          title: "Draft saved",
          description: "Your component notes are stored locally.",
        })
      }
    >
      Show toast
    </Button>
  );
}
