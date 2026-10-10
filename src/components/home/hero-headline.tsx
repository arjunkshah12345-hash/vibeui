"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const words = ["Components", "with", "taste,", "that", "you", "own."];

/**
 * One-line hero headline. Each word rises out of a mask while it de-blurs,
 * then a hand-drawn stroke underlines the last word. The size is tied to the
 * container's width so the line never wraps, from phone to desktop.
 */
export function HeroHeadline() {
  const reduce = useReducedMotion();

  return (
    <h1 className="[container-type:inline-size]">
      <span className="sr-only">Components with taste, that you own.</span>
      <span
        aria-hidden
        className="block whitespace-nowrap font-display text-[min(5.5rem,7.9cqw)] leading-[1.12] tracking-[-0.02em] text-ink"
      >
        {words.map((word, i) => {
          const last = i === words.length - 1;
          return (
            <span key={word} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className="relative inline-block"
                initial={reduce ? false : { y: "105%", opacity: 0, filter: "blur(10px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.075, ease }}
              >
                {word}
                {last && (
                  <svg
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 -bottom-[0.02em] h-[0.2em] w-full overflow-visible"
                  >
                    <motion.path
                      d="M2 8 C 40 2, 90 11, 130 5 S 185 3, 198 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={reduce ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.1 + words.length * 0.075 + 0.35,
                        ease,
                      }}
                    />
                  </svg>
                )}
              </motion.span>
              {!last && " "}
            </span>
          );
        })}
      </span>
    </h1>
  );
}
