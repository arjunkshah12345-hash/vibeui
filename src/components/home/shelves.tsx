import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { DemoStage } from "@/components/showcase/demo-stage";
import { LazyMount } from "@/components/showcase/lazy-mount";
import { categories } from "@/lib/categories";
import { cn } from "@/lib/utils";

/**
 * Which live previews each section shows. `wide` sections span two columns and
 * show a second preview from `lg` up.
 */
const picks: Record<string, { slugs: string[]; wide?: boolean }> = {
  actions: { slugs: ["button", "chip"], wide: true },
  forms: { slugs: ["calendar", "slider"], wide: true },
  feedback: { slugs: ["notification", "alert"] },
  data: { slugs: ["table", "stat"], wide: true },
  overlays: { slugs: ["dialog", "command"] },
  navigation: { slugs: ["tabs", "stepper"], wide: true },
  craft: { slugs: ["dock"] },
  text: { slugs: ["gradient-text"] },
  hover: { slugs: ["hover-tilt"] },
  footers: { slugs: ["footer-simple", "footer-cta"], wide: true },
};

/** The ten sections of the library, each with live previews and a way in. */
export function Shelves({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat, index) => {
        const pick = picks[cat.id];
        return (
          <article
            key={cat.id}
            className={cn(
              "group flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-quiet transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift",
              pick.wide && "lg:col-span-2",
            )}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div className="relative flex h-64 items-center justify-center gap-6 overflow-hidden border-b border-line bg-surface-muted/50 bg-dots px-5">
              {pick.slugs.map((slug, i) => (
                <div
                  key={slug}
                  className={cn("origin-center lg:scale-[.9]", i > 0 && "hidden lg:block")}
                >
                  <LazyMount
                    placeholder={
                      <div className="h-24 w-44 animate-pulse-quiet rounded-md bg-surface-muted" />
                    }
                  >
                    <DemoStage slug={slug} mode="tile" />
                  </LazyMount>
                </div>
              ))}
            </div>
            <Link
              href={`/components#${cat.id}`}
              className="flex items-end justify-between gap-4 p-5"
            >
              <div className="min-w-0">
                <h3 className="font-display text-[28px] leading-none tracking-[-0.01em] text-ink">
                  {cat.label}
                </h3>
                <p className="mt-2 truncate text-sm text-muted">{cat.blurb}</p>
              </div>
              <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted">
                {counts[cat.id] ?? 0}
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  className="text-faint transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
