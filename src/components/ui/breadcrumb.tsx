import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/** Path trail showing the current location in a hierarchy. */
export function Breadcrumb({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
              {i > 0 ? (
                <CaretRight size={11} className="text-faint" weight="bold" aria-hidden />
              ) : null}
              {last || !item.href ? (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(last ? "font-medium text-ink" : "text-muted")}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-muted transition-[color,transform] duration-150 hover:-translate-y-px hover:text-ink"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
