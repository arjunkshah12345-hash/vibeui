"use client";

import * as React from "react";
import { DotsSixVertical } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type SortableItem = {
  id: string;
  content: React.ReactNode;
  // Read out when the item moves. Defaults to the id.
  label?: string;
};

type Slot = { top: number; height: number };

/**
 * A list you reorder by dragging. The other rows glide out of the way and the dropped row settles into place.
 *
 * Keyboard: focus a handle, press Space to lift, the arrow keys to move, Space to drop, Escape to cancel.
 */
export function SortableList({
  items: controlled,
  defaultItems = [],
  onItemsChange,
  handle = true,
  className,
  itemClassName,
  ...props
}: Omit<React.HTMLAttributes<HTMLUListElement>, "children"> & {
  /** Controlled items, in order. */
  items?: SortableItem[];
  /** Initial items when uncontrolled. */
  defaultItems?: SortableItem[];
  /** Called with the new order after a drop or a keyboard move. */
  onItemsChange?: (items: SortableItem[]) => void;
  /** Drag only by the grip. Turn off to drag from anywhere on the row (not for rows with their own controls). */
  handle?: boolean;
  /** Classes for every row. */
  itemClassName?: string;
}) {
  const [inner, setInner] = React.useState(defaultItems);
  const items = controlled ?? inner;
  const rows = React.useRef(new Map<string, HTMLLIElement>());
  const startY = React.useRef(0);
  const scaleY = React.useRef(1);
  const [drag, setDrag] = React.useState<{
    id: string;
    from: number;
    to: number;
    dy: number;
    phase: "drag" | "drop";
    slots: Slot[];
    gap: number;
  } | null>(null);
  const [lifted, setLifted] = React.useState<string | null>(null);
  const snapshot = React.useRef<SortableItem[]>([]);
  const [said, setSaid] = React.useState("");

  const commit = (next: SortableItem[]) => {
    if (controlled === undefined) setInner(next);
    onItemsChange?.(next);
  };

  const measure = () =>
    items.map((it) => {
      const el = rows.current.get(it.id);
      return { top: el?.offsetTop ?? 0, height: el?.offsetHeight ?? 0 };
    });

  const begin = (e: React.PointerEvent<HTMLElement>, index: number) => {
    if (e.button !== 0 || drag) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const slots = measure();
    startY.current = e.clientY;
    const list = rows.current.get(items[index].id)?.parentElement;
    scaleY.current = list ? list.getBoundingClientRect().height / (list.offsetHeight || 1) || 1 : 1;
    const gap = slots.length > 1 ? slots[1].top - (slots[0].top + slots[0].height) : 0;
    setDrag({ id: items[index].id, from: index, to: index, dy: 0, phase: "drag", slots, gap });
  };

  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag || drag.phase !== "drag") return;
    const { slots, from } = drag;
    const last = slots[slots.length - 1];
    const min = -slots[from].top;
    const max = last.top + last.height - (slots[from].top + slots[from].height);
    const dy = Math.max(min, Math.min(max, (e.clientY - startY.current) / scaleY.current));
    const center = slots[from].top + slots[from].height / 2 + dy;
    let to = from;
    slots.forEach((slot, j) => {
      const mid = slot.top + slot.height / 2;
      if (j < from && center < mid) to = Math.min(to, j);
      if (j > from && center > mid) to = Math.max(to, j);
    });
    setDrag({ ...drag, dy, to });
  };

  const end = () => {
    if (!drag || drag.phase !== "drag") return;
    // Slide the row into the slot it is hovering over, then commit the new order.
    const { from, to, slots, gap } = drag;
    let settle = 0;
    if (to > from) for (let j = from + 1; j <= to; j++) settle += slots[j].height + gap;
    if (to < from) for (let j = to; j < from; j++) settle -= slots[j].height + gap;
    setDrag({ ...drag, dy: settle, phase: "drop" });
    window.setTimeout(() => {
      if (to !== from) {
        const next = items.slice();
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        commit(next);
        setSaid(`${label(moved)} moved to position ${to + 1} of ${items.length}`);
      }
      setDrag(null);
    }, 230);
  };

  const label = (it: SortableItem) => it.label ?? it.id;

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const it = items[index];
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (lifted === it.id) {
        setLifted(null);
        setSaid(`${label(it)} dropped at position ${index + 1} of ${items.length}`);
      } else {
        snapshot.current = items;
        setLifted(it.id);
        setSaid(
          `${label(it)} lifted from position ${index + 1} of ${items.length}. Use the arrow keys to move it.`,
        );
      }
      return;
    }
    if (lifted !== it.id) return;
    if (e.key === "Escape") {
      e.preventDefault();
      commit(snapshot.current);
      setLifted(null);
      setSaid(`Move cancelled. ${label(it)} is back at its original position.`);
      return;
    }
    const dir = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    const next = items.slice();
    [next[index], next[to]] = [next[to], next[index]];
    commit(next);
    setSaid(`${label(it)} moved to position ${to + 1} of ${items.length}`);
  };

  const dragged = drag?.slots[drag.from];
  const gap = drag?.gap ?? 0;

  return (
    <>
      <ul {...props} role="list" className={cn("relative flex flex-col gap-2", className)}>
        {items.map((it, i) => {
          const isDragged = drag?.id === it.id;
          let shift = 0;
          if (drag && !isDragged && dragged) {
            if (drag.from < drag.to && i > drag.from && i <= drag.to)
              shift = -(dragged.height + gap);
            if (drag.from > drag.to && i >= drag.to && i < drag.from) shift = dragged.height + gap;
          }
          const grip = (
            <button
              type="button"
              aria-label={`Reorder ${label(it)}`}
              aria-roledescription="sortable item"
              aria-pressed={lifted === it.id}
              onKeyDown={(e) => onKey(e, i)}
              onBlur={() => lifted === it.id && setLifted(null)}
              onPointerDown={handle ? (e) => begin(e, i) : undefined}
              onPointerMove={handle ? move : undefined}
              onPointerUp={handle ? end : undefined}
              onPointerCancel={handle ? end : undefined}
              className={cn(
                "grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-md text-faint outline-none transition-colors hover:bg-surface-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
                lifted === it.id && "bg-surface-muted text-ink",
              )}
            >
              <DotsSixVertical size={18} weight="bold" />
            </button>
          );
          return (
            <li
              key={it.id}
              ref={(el) => {
                if (el) rows.current.set(it.id, el);
                else rows.current.delete(it.id);
              }}
              onPointerDown={!handle ? (e) => begin(e, i) : undefined}
              onPointerMove={!handle ? move : undefined}
              onPointerUp={!handle ? end : undefined}
              onPointerCancel={!handle ? end : undefined}
              className={cn(
                "relative flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-2 shadow-quiet",
                !handle && "cursor-grab touch-none select-none active:cursor-grabbing",
                (isDragged || lifted === it.id) && "z-10 border-line-strong shadow-lift",
                lifted === it.id && "ring-2 ring-ring",
                itemClassName,
              )}
              style={{
                transform: isDragged
                  ? `translateY(${drag.dy}px) scale(${drag.phase === "drag" ? 1.02 : 1})`
                  : shift
                    ? `translateY(${shift}px)`
                    : undefined,
                transition: drag
                  ? isDragged
                    ? drag.phase === "drop"
                      ? "transform 0.22s var(--ease-out), box-shadow 0.22s"
                      : "box-shadow 0.2s"
                    : "transform 0.22s var(--ease-out)"
                  : undefined,
              }}
            >
              {grip}
              <div className="min-w-0 flex-1">{it.content}</div>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="assertive">
        {said}
      </p>
    </>
  );
}
