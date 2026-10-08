import { cn } from "@/lib/utils";

/** Multi-column footer with brand blurb, link groups and a bottom bar. */
export function FooterMega({
  brand,
  blurb,
  columns,
  bottom,
  className,
}: {
  brand: React.ReactNode;
  blurb?: string;
  columns: { title: string; links: { label: string; href: string }[] }[];
  bottom?: React.ReactNode;
  className?: string;
}) {
  return (
    <footer className={cn("border-t border-line bg-surface-muted/40", className)}>
      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="text-ink">{brand}</div>
            {blurb ? (
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                {blurb}
              </p>
            ) : null}
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          >
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[13px] font-medium text-ink">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <a
                        href={l.href}
                        className="text-[13px] text-muted transition-colors hover:text-ink"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        {bottom ? (
          <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
            {bottom}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
