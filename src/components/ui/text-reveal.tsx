"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Headline whose words rise out of a mask as it scrolls into view. */
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
    <p
      ref={ref}
      aria-label={text}
      className={cn(
        "text-3xl font-medium leading-[1.15] tracking-[-0.035em] text-ink md:text-4xl",
        className,
      )}
    >
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="mr-[0.26em] inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <span
            className="inline-block transition-transform duration-[900ms] ease-out"
            style={{
              transform: visible ? "translateY(0)" : "translateY(115%)",
              transitionDelay: `${i * 60}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}
