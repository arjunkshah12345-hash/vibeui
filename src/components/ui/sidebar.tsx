"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  // A small count or tag on the right.
  badge?: React.ReactNode;
  // Nested links. The item becomes a group that opens and closes.
  children?: { value: string; label: string }[];
};

export type SidebarSection = { title?: string; items: SidebarItem[] };

/**
 * An app sidebar that collapses to an icon rail: grouped links, nested menus and a marker that glides to the active page.
 *
 * Collapsed, labels fold away and each icon gets a tooltip. Groups open with a smooth height
 * transition. Fill the header and footer slots with your logo and account.
 */
export function Sidebar({
  sections,
  value,
  defaultValue,
  onChange,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  header,
  footer,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "onChange" | "defaultValue"> & {
  sections: SidebarSection[];
  /** Controlled active page. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Sits at the top, beside the collapse button. */
  header?: React.ReactNode;
  /** Sits at the bottom. */
  footer?: React.ReactNode;
}) {
  const first = sections[0]?.items[0];
  const [ownValue, setOwnValue] = React.useState(defaultValue ?? first?.value ?? "");
  const [ownCollapsed, setOwnCollapsed] = React.useState(defaultCollapsed);
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    for (const s of sections)
      for (const it of s.items)
        if (it.children?.some((c) => c.value === (defaultValue ?? value))) o[it.value] = true;
    return o;
  });
  const [marker, setMarker] = React.useState<{ y: number; h: number } | null>(null);
  const active = value ?? ownValue;
  const rail = collapsed ?? ownCollapsed;
  const nav = React.useRef<HTMLElement>(null);

  // Park the marker on the active row, and keep it there as groups open or the rail changes width.
  React.useEffect(() => {
    const el = nav.current;
    if (!el) return;
    const measure = () => {
      const row = el.querySelector<HTMLElement>(`[data-value='${CSS.escape(active)}']`);
      if (!row || row.offsetParent === null) return setMarker(null);
      let y = 0;
      let node: HTMLElement | null = row;
      while (node && node !== el) {
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      setMarker({ y, h: row.offsetHeight });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, rail, open, sections]);

  const pick = (v: string) => {
    if (value === undefined) setOwnValue(v);
    onChange?.(v);
  };
  const setRail = (c: boolean) => {
    if (collapsed === undefined) setOwnCollapsed(c);
    onCollapsedChange?.(c);
  };

  const row = (
    it: { value: string; label: string; icon?: React.ReactNode; badge?: React.ReactNode },
    nested = false,
    group = false,
  ) => {
    const on = it.value === active;
    return (
      <button
        type="button"
        data-value={it.value}
        aria-current={on ? "page" : undefined}
        aria-expanded={group ? !!open[it.value] : undefined}
        onClick={() => {
          if (group) {
            if (rail) setRail(false);
            setOpen((o) => ({ ...o, [it.value]: !o[it.value] }));
          } else pick(it.value);
        }}
        className={cn(
          "group/row relative flex h-9 w-full items-center gap-3 rounded-lg text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring",
          nested ? "pl-10 pr-2" : "px-[13px]",
          on ? "font-medium text-ink" : "text-ink-soft hover:bg-surface-muted hover:text-ink",
        )}
      >
        {it.icon != null && (
          <span
            className={cn(
              "grid size-[18px] shrink-0 place-items-center [&_svg]:size-[18px]",
              on ? "text-ink" : "text-muted group-hover/row:text-ink",
            )}
          >
            {it.icon}
          </span>
        )}
        <span
          className={cn(
            "flex-1 truncate text-left transition-[opacity,transform] duration-200",
            rail && !nested && "pointer-events-none -translate-x-2 opacity-0",
          )}
        >
          {it.label}
        </span>
        {it.badge != null && !rail && (
          <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-muted">
            {it.badge}
          </span>
        )}
        {group && !rail && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={cn(
              "shrink-0 text-muted transition-transform duration-300",
              open[it.value] && "rotate-90",
            )}
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {/* when only icons show, the label appears beside the icon on hover or focus */}
        {rail && !nested && (
          <span
            role="tooltip"
            className="pointer-events-none absolute left-full z-50 ml-3 -translate-x-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-surface opacity-0 shadow-lift transition-[opacity,transform] duration-150 group-hover/row:translate-x-0 group-hover/row:opacity-100 group-focus-visible/row:translate-x-0 group-focus-visible/row:opacity-100"
          >
            {it.label}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      {...props}
      className={cn(
        "relative flex h-full shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-400 ease-[cubic-bezier(0.3,1.1,0.4,1)]",
        rail ? "w-[68px]" : "w-[248px]",
        className,
      )}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 px-3">
        <div
          className={cn(
            "min-w-0 flex-1 overflow-hidden transition-opacity duration-200",
            rail && "pointer-events-none opacity-0",
          )}
        >
          {header}
        </div>
        <button
          type="button"
          aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={rail}
          onClick={() => setRail(!rail)}
          className="grid size-9 shrink-0 place-items-center rounded-lg text-muted outline-none transition-colors hover:bg-surface-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={cn("transition-transform duration-300", rail && "rotate-180")}
          >
            <rect
              x="3.5"
              y="4.5"
              width="17"
              height="15"
              rx="3.5"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M9.5 5v14" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <nav
        ref={nav}
        aria-label="Sidebar"
        className="relative flex-1 overflow-y-auto overflow-x-visible px-3 pb-3"
      >
        {marker && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 w-[3px] rounded-r-full bg-ink transition-[top,height] duration-500 ease-[cubic-bezier(0.3,1.2,0.4,1)]"
            style={{ top: marker.y + 8, height: Math.max(0, marker.h - 16) }}
          />
        )}
        {sections.map((s, si) => (
          <div key={si} className={cn(si > 0 && "mt-5")}>
            {s.title && (
              <p
                className={cn(
                  "mb-1.5 px-[13px] text-[11px] font-medium uppercase tracking-[0.14em] text-faint transition-opacity duration-200",
                  rail && "opacity-0",
                )}
              >
                {s.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {s.items.map((it) => (
                <li key={it.value}>
                  {row(it, false, !!it.children)}
                  {it.children && (
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                        open[it.value] && !rail
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <ul className="min-h-0 space-y-0.5 overflow-hidden">
                        {it.children.map((c) => (
                          <li key={c.value}>{row(c, true)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {footer && (
        <div className={cn("shrink-0 border-t border-line p-3", rail && "grid place-items-center")}>
          {footer}
        </div>
      )}
    </aside>
  );
}
