"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Words fade, deblur and rise one after another when scrolled into view. */
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
        if (e?.isIntersecting) {
          setOn(true);
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
          className="mr-[0.26em] inline-block transition-[opacity,transform,filter] duration-700 ease-out"
          style={{
            opacity: on ? 1 : 0,
            transform: on ? "translateY(0)" : "translateY(0.4em)",
            filter: on ? "blur(0)" : "blur(6px)",
            transitionDelay: `${i * 70}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
