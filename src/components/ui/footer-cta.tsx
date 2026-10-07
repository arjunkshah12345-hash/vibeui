import { cn } from "@/lib/utils";
import { Button } from "./button";

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
    <section
      className={cn(
        "border-t border-line bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-muted)_100%)]",
        className,
      )}
    >
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em] text-ink md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a href={primary.href}>
            <Button size="lg">{primary.label}</Button>
          </a>
          {secondary ? (
            <a href={secondary.href}>
              <Button size="lg" variant="secondary">
                {secondary.label}
              </Button>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
