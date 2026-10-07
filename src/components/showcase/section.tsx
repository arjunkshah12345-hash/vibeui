import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ShowcaseSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-28 border-t border-line py-12 md:py-16", className)}
    >
      <div className="mb-7 max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-medium tracking-[-0.03em] text-ink md:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export const Section = ShowcaseSection;

export function DemoFrame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-line bg-surface p-5 md:p-6",
        className,
      )}
    >
      {label ? (
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
          {label}
        </p>
      ) : null}
      {children}
    </div>
  );
}
