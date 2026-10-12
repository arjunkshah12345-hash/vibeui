import * as React from "react";
import { cn } from "@/lib/utils";

const TONE = {
  ok: { dot: "#16a34a", text: "All systems normal" },
  degraded: { dot: "#d97706", text: "Some systems degraded" },
  down: { dot: "#dc2626", text: "Service disruption" },
} as const;

/**
 * A compact footer with a live status pill: a pulsing dot, a short message, links, and a slot for switches.
 *
 * The pill reads green, amber or red and links to your status page. Put a theme or language
 * picker in `actions`.
 */
export function FooterStatus({
  brand,
  links,
  status = "ok",
  statusLabel,
  statusHref = "#",
  actions,
  note,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  brand: React.ReactNode;
  links: { label: string; href: string }[];
  /** Colour of the dot: `ok`, `degraded` or `down`. */
  status?: keyof typeof TONE;
  /** Overrides the default message for the status. */
  statusLabel?: string;
  /** Where the pill goes when clicked, normally your status page. */
  statusHref?: string;
  /** Controls on the right, such as a theme switch. */
  actions?: React.ReactNode;
  note?: React.ReactNode;
}) {
  const t = TONE[status];
  return (
    <footer {...props} className={cn("border-t border-line", className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-ink">{brand}</div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <a
                key={l.href + l.label}
                href={l.href}
                className="text-[13px] text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a
            href={statusHref}
            className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-3 pr-3.5 text-[13px] text-ink-soft shadow-quiet outline-none transition-[border-color,background-color] hover:border-line-strong hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="relative grid size-2.5 place-items-center">
              <span
                aria-hidden
                className="absolute inset-0 animate-pulse-quiet rounded-full opacity-50"
                style={{ background: t.dot }}
              />
              <span className="relative size-2 rounded-full" style={{ background: t.dot }} />
            </span>
            <span role="status">{statusLabel ?? t.text}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="text-muted transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <div className="flex items-center gap-4">
            {note && <p className="text-xs text-faint">{note}</p>}
            {actions}
          </div>
        </div>
      </div>
    </footer>
  );
}
