import { cn } from "@/lib/utils";

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
    <footer className={cn("border-t border-line bg-surface", className)}>
      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="text-ink">{brand}</div>
            {blurb ? (
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                {blurb}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                  {col.title}
                </p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="text-[13px] text-ink-soft transition-colors hover:text-ink"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
