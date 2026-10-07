"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function StaggerWords({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setOn(true);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={cn(
        "text-2xl font-medium tracking-[-0.03em] text-ink md:text-3xl",
        className,
      )}
    >
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
          <span
            className="inline-block transition-all duration-700 ease-[var(--ease-out)]"
            style={{
              opacity: on ? 1 : 0,
              transform: on ? "translateY(0)" : "translateY(100%)",
              transitionDelay: `${i * 60}ms`,
              filter: on ? "blur(0)" : "blur(4px)",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}
