"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TextReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={cn(
        "text-2xl font-medium leading-snug tracking-[-0.03em] text-ink md:text-3xl",
        className,
      )}
    >
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="mr-[0.3em] inline-block overflow-hidden">
          <span
            className="inline-block transition-transform duration-700 ease-[var(--ease-out)]"
            style={{
              transform: visible ? "translateY(0)" : "translateY(110%)",
              transitionDelay: `${i * 55}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}
