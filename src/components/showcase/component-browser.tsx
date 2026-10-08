"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/site/reveal";
import { Empty } from "@/components/ui/empty";
import { SearchField } from "@/components/ui/search-field";
import { categories, type ComponentSummary } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { DemoStage } from "./demo-stage";
import { LazyMount } from "./lazy-mount";

function Tile({ component, index }: { component: ComponentSummary; index: number }) {
  return (
    <article
      style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}
      className="group flex animate-fade-up flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-quiet transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift">
      <div className="relative flex h-60 items-center justify-center overflow-hidden border-b border-line bg-surface-muted/50 bg-dots px-6">
        <LazyMount
          placeholder={<div className="h-20 w-36 animate-pulse-quiet rounded-md bg-surface-muted" />}
        >
          <DemoStage slug={component.name} mode="tile" />
        </LazyMount>
      </div>
      <Link
        href={`/components/${component.name}`}
        className="flex items-center justify-between gap-3 px-4 py-3.5"
      >
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium tracking-[-0.01em] text-ink">
            {component.title.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </h3>
          <p className="mt-0.5 truncate text-[13px] text-muted">{component.description}</p>
        </div>
        <ArrowUpRight
          size={16}
          weight="bold"
          className="shrink-0 text-faint transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </Link>
    </article>
  );
}

/**
 * Completes a short last row. It links to the next shelf, so it reads as
 * navigation rather than padding, and it only exists where a gap would be.
 */
function NextShelf({
  count,
  next,
  names,
}: {
  count: number;
  next?: (typeof categories)[number];
  names: string[];
}) {
  const lgGap = (3 - (count % 3)) % 3;
  const smGap = count % 2;
  if (!lgGap && !smGap) return null;

  const visibility = cn(
    "hidden",
    smGap ? "sm:flex" : "sm:hidden",
    lgGap ? "lg:flex" : "lg:hidden",
    lgGap === 2 && "lg:col-span-2",
  );

  return (
    <Link
      href={next ? `#${next.id}` : "/docs/installation"}
      className={cn(
        "group flex min-h-48 flex-col justify-between rounded-lg border border-dashed border-line-strong bg-transparent p-6 transition-colors duration-300 hover:border-ink hover:bg-surface",
        visibility,
      )}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">
        {next ? "Next shelf" : "Ready?"}
      </span>
      {next ? (
        <ul className="my-4 flex flex-wrap gap-1.5" aria-hidden>
          {names.map((n) => (
            <li
              key={n}
              className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-muted"
            >
              {n}
            </li>
          ))}
        </ul>
      ) : null}
      <div>
        <p className="font-display text-3xl tracking-[-0.01em] text-ink">
          {next ? next.label : "Add one to your app"}
        </p>
        <p className="mt-1.5 flex items-center justify-between gap-3 text-sm text-muted">
          <span>{next ? next.blurb : "Two minutes from clone to component."}</span>
          <ArrowUpRight
            size={18}
            weight="bold"
            className="shrink-0 text-faint transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        </p>
      </div>
    </Link>
  );
}

/** Searchable, filterable gallery of live component previews. */
export function ComponentBrowser({ components }: { components: ComponentSummary[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");

  const q = query.trim().toLowerCase();
  const filtered = components.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      (!q || `${c.name} ${c.title} ${c.description} ${c.category}`.toLowerCase().includes(q)),
  );

  const counts = new Map<string, number>();
  for (const c of components) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);

  const groups = categories
    .map((cat) => ({ cat, items: filtered.filter((c) => c.category === cat.id) }))
    .filter((g) => g.items.length > 0);

  const chip = (active: boolean) =>
    cn(
      "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors duration-150",
      active
        ? "border-ink bg-ink text-surface"
        : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
    );

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-5 border-b border-line bg-canvas/85 px-5 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder={`Search ${components.length} components…`}
            className="md:w-72"
          />
          <div className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5">
            <button type="button" className={chip(category === "all")} onClick={() => setCategory("all")}>
              All <span className="opacity-60">{components.length}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={chip(category === c.id)}
                onClick={() => setCategory(c.id)}
              >
                {c.label} <span className="opacity-60">{counts.get(c.id) ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl pb-24 pt-10">
        {groups.length === 0 ? (
          <Empty
            title={`No components match “${query}”`}
            description="Try a broader term, or clear the category filter."
          />
        ) : (
          groups.map(({ cat, items }, gi) => (
            <section key={cat.id} id={cat.id} className="mb-16 scroll-mt-36 last:mb-0">
              <Reveal className="mb-5 flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl tracking-[-0.01em] text-ink">{cat.label}</h2>
                  <p className="mt-1 text-sm text-muted">{cat.blurb}</p>
                </div>
                <span className="font-mono text-xs text-faint">{items.length}</span>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c, i) => (
                  <Tile key={c.name} component={c} index={i} />
                ))}
                {!q && category === "all" ? (
                  <NextShelf
                    count={items.length}
                    next={groups[gi + 1]?.cat}
                    names={(groups[gi + 1]?.items ?? []).slice(0, 7).map((c) => c.name)}
                  />
                ) : null}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
