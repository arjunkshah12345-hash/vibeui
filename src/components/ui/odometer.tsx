"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const CELL = 1.2;

/**
 * Mechanical rolling digits: each one is a wheel that spins to its number, right to left.
 *
 * It formats with `Intl.NumberFormat`, so currency, percent and separators just work.
 */
export function Odometer({
  value,
  locale,
  format,
  duration = 1100,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  value: number;
  /** BCP 47 locale for formatting. Defaults to the browser's. */
  locale?: string;
  /** `Intl.NumberFormat` options, for example `{ style: "currency", currency: "USD" }`. */
  format?: Intl.NumberFormatOptions;
  /** Roll time in ms. Wheels to the left start a little later. */
  duration?: number;
}) {
  const text = React.useMemo(
    () => new Intl.NumberFormat(locale, format).format(value),
    [value, locale, format],
  );
  const chars = Array.from(text);
  const [armed, setArmed] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <span
      {...props}
      role="img"
      aria-label={text}
      className={cn("inline-flex items-center tabular-nums leading-none", className)}
    >
      {chars.map((ch, i) => {
        const fromRight = chars.length - 1 - i;
        const n = ch >= "0" && ch <= "9" ? Number(ch) : null;
        if (n === null) {
          return (
            <span key={`s${fromRight}`} aria-hidden className="inline-block">
              {ch}
            </span>
          );
        }
        return (
          <span
            key={`d${fromRight}`}
            aria-hidden
            className="relative inline-block overflow-hidden [mask-image:linear-gradient(transparent,#000_14%,#000_86%,transparent)]"
            style={{ height: `${CELL}em` }}
          >
            <span
              className="flex flex-col"
              style={{
                transform: `translateY(${armed ? -n * CELL : 0}em)`,
                transition: `transform ${duration}ms cubic-bezier(0.2, 0.9, 0.25, 1.06) ${fromRight * 70}ms`,
              }}
            >
              {DIGITS.map((d) => (
                <span
                  key={d}
                  className="block text-center"
                  style={{ height: `${CELL}em`, lineHeight: `${CELL}em` }}
                >
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
