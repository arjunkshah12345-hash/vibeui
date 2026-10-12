"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type ContextItem =
  | { type: "separator" }
  | {
      type?: "item";
      label: string;
      onSelect?: () => void;
      icon?: React.ReactNode;
      shortcut?: string;
      danger?: boolean;
      disabled?: boolean;
      // A nested menu that opens beside this row.
      children?: Extract<ContextItem, { label: string }>[];
    };

type Row = Extract<ContextItem, { label: string }>;

/**
 * A right-click menu for any area: it opens at the pointer, stays on screen, and works from the keyboard.
 *
 * Long-press opens it on touch screens, and Shift + F10 or the Menu key opens it from the keyboard.
 * Rows can carry icons, shortcuts, a danger tone and a submenu.
 */
export function ContextMenu({
  items,
  children,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  items: ContextItem[];
  /** The area that listens for a right click. */
  children: React.ReactNode;
}) {
  const [at, setAt] = React.useState<{ x: number; y: number } | null>(null);
  const press = React.useRef<number>(0);

  const close = React.useCallback(() => setAt(null), []);
  const openAt = (x: number, y: number) => setAt({ x, y });

  return (
    <div
      {...props}
      className={className}
      onContextMenu={(e) => {
        e.preventDefault();
        openAt(e.clientX, e.clientY);
      }}
      onKeyDown={(e) => {
        props.onKeyDown?.(e);
        if (e.key === "ContextMenu" || (e.key === "F10" && e.shiftKey)) {
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          openAt(r.left + 24, r.top + 24);
        }
      }}
      onPointerDown={(e) => {
        props.onPointerDown?.(e);
        if (e.pointerType !== "touch") return;
        const { clientX, clientY } = e;
        window.clearTimeout(press.current);
        press.current = window.setTimeout(() => openAt(clientX, clientY), 520);
      }}
      onPointerUp={() => window.clearTimeout(press.current)}
      onPointerMove={() => window.clearTimeout(press.current)}
      onPointerCancel={() => window.clearTimeout(press.current)}
    >
      {children}
      {at &&
        typeof document !== "undefined" &&
        createPortal(<Menu items={items} x={at.x} y={at.y} onClose={close} />, document.body)}
    </div>
  );
}

function Menu({
  items,
  x,
  y,
  onClose,
}: {
  items: ContextItem[];
  x: number;
  y: number;
  onClose: () => void;
}) {
  const el = React.useRef<HTMLDivElement>(null);
  const rows = items
    .map((it, i) => [it, i] as const)
    .filter((p): p is [Row, number] => p[0].type !== "separator" && !(p[0] as Row).disabled);
  const [active, setActive] = React.useState<number>(rows[0]?.[1] ?? -1);
  const [sub, setSub] = React.useState<number | null>(null);

  // Place the menu at the pointer, then nudge it back inside the window if it would spill out.
  React.useLayoutEffect(() => {
    const m = el.current;
    if (!m) return;
    const { offsetWidth: w, offsetHeight: h } = m;
    m.style.left = `${Math.max(8, Math.min(x, window.innerWidth - w - 8))}px`;
    m.style.top = `${Math.max(8, Math.min(y, window.innerHeight - h - 8))}px`;
    m.style.transformOrigin = `${x > window.innerWidth - w - 8 ? "right" : "left"} ${y > window.innerHeight - h - 8 ? "bottom" : "top"}`;
    m.focus({ preventScroll: true });
  }, [x, y]);

  React.useEffect(() => {
    const away = (e: PointerEvent) => {
      if (!el.current?.contains(e.target as Node)) onClose();
    };
    const dismiss = () => onClose();
    document.addEventListener("pointerdown", away, true);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    window.addEventListener("blur", dismiss);
    return () => {
      document.removeEventListener("pointerdown", away, true);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("blur", dismiss);
    };
  }, [onClose]);

  const step = (dir: 1 | -1) => {
    const idx = rows.findIndex(([, i]) => i === active);
    const next = rows[(idx + dir + rows.length) % rows.length];
    if (next) {
      setActive(next[1]);
      setSub(null);
    }
  };
  const run = (item: Row) => {
    if (item.disabled || item.children) return;
    onClose();
    item.onSelect?.();
  };

  return (
    <div
      ref={el}
      role="menu"
      tabIndex={-1}
      aria-orientation="vertical"
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        const cur = items[active] as Row | undefined;
        if (e.key === "ArrowDown") step(1);
        else if (e.key === "ArrowUp") step(-1);
        else if (e.key === "Home") setActive(rows[0]?.[1] ?? -1);
        else if (e.key === "End") setActive(rows[rows.length - 1]?.[1] ?? -1);
        else if (e.key === "ArrowRight" && cur?.children) setSub(active);
        else if (e.key === "ArrowLeft" && sub !== null) setSub(null);
        else if (e.key === "Enter" || e.key === " ") {
          if (cur?.children) setSub(active);
          else if (cur) run(cur);
        } else if (e.key === "Escape" || e.key === "Tab") onClose();
        else return;
        e.preventDefault();
      }}
      className="fixed left-0 top-0 z-[100] min-w-52 animate-pop-in rounded-xl border border-line bg-surface p-1 shadow-lift outline-none"
    >
      {items.map((it, i) =>
        it.type === "separator" ? (
          <div key={i} role="separator" className="my-1 h-px bg-line" />
        ) : (
          <Item
            key={it.label}
            item={it}
            on={active === i}
            open={sub === i}
            onHover={() => {
              if (it.disabled) return;
              setActive(i);
              setSub(it.children ? i : null);
            }}
            onRun={() => run(it)}
            onCloseAll={onClose}
          />
        ),
      )}
    </div>
  );
}

function Item({
  item,
  on,
  open,
  onHover,
  onRun,
  onCloseAll,
}: {
  item: Row;
  on: boolean;
  open: boolean;
  onHover: () => void;
  onRun: () => void;
  onCloseAll: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [flip, setFlip] = React.useState(false);
  return (
    <div
      ref={ref}
      role="menuitem"
      aria-disabled={item.disabled}
      aria-haspopup={item.children ? "menu" : undefined}
      aria-expanded={item.children ? open : undefined}
      onPointerEnter={() => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setFlip(r.right + 216 > window.innerWidth);
        onHover();
      }}
      onClick={onRun}
      className={cn(
        "relative flex cursor-default items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
        on && "bg-surface-muted",
        item.danger ? "text-[#dc2626]" : "text-ink",
        item.disabled && "opacity-40",
      )}
    >
      {item.icon != null && (
        <span className="grid size-4 shrink-0 place-items-center text-muted [&_svg]:size-4">
          {item.icon}
        </span>
      )}
      <span className="flex-1">{item.label}</span>
      {item.shortcut && <kbd className="font-mono text-[11px] text-muted">{item.shortcut}</kbd>}
      {item.children && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="text-muted"
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
      {item.children && open && (
        <div
          role="menu"
          className={cn(
            "absolute top-[-5px] z-10 min-w-48 animate-pop-in rounded-xl border border-line bg-surface p-1 shadow-lift",
            flip ? "right-full mr-1" : "left-full ml-1",
          )}
        >
          {item.children.map((c) => (
            <div
              key={c.label}
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                if (c.disabled) return;
                onCloseAll();
                c.onSelect?.();
              }}
              className={cn(
                "flex cursor-default items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-surface-muted",
                c.danger ? "text-[#dc2626]" : "text-ink",
                c.disabled && "opacity-40",
              )}
            >
              {c.icon != null && (
                <span className="grid size-4 shrink-0 place-items-center text-muted [&_svg]:size-4">
                  {c.icon}
                </span>
              )}
              <span className="flex-1">{c.label}</span>
              {c.shortcut && <kbd className="font-mono text-[11px] text-muted">{c.shortcut}</kbd>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
