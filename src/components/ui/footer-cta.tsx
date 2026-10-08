import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

/** Closing call-to-action band that sits above a footer. */
export function FooterCta({
  title,
  description,
  primary,
  secondary,
  className,
}: {
  title: string;
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-t border-line", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-float bg-[radial-gradient(50%_80%_at_50%_100%,var(--accent-soft),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-3xl animate-fade-up px-5 py-20 text-center">
        <h2 className="font-display text-[44px] leading-[1.02] tracking-[-0.01em] text-ink md:text-[56px]">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={primary.href} className={buttonVariants({ size: "lg" })}>
            {primary.label}
          </a>
          {secondary ? (
            <a
              href={secondary.href}
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
