"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function DecodeText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [shown, setShown] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setShown(true);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={cn("inline-flex flex-wrap font-mono text-sm text-ink", className)}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-500 ease-[var(--ease-out)]"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "none" : "translateY(6px)",
            transitionDelay: `${i * 28}ms`,
            filter: shown ? "blur(0)" : "blur(3px)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
