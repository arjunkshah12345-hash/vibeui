"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function BlurReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-[var(--ease-out)]",
        visible
          ? "opacity-100 blur-0 translate-y-0"
          : "opacity-0 blur-md translate-y-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
