"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Content that resolves from blur and a slight drop as it enters the viewport. */
export function BlurReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds before the reveal starts. */
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,filter,transform] duration-1000 ease-out",
        visible
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-3 opacity-0 blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
