import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { FitStage } from "@/components/home/fit-stage";
import { Reveal } from "@/components/site/reveal";
import { DemoStage } from "@/components/showcase/demo-stage";
import { LazyMount } from "@/components/showcase/lazy-mount";
import { categories } from "@/lib/categories";
import { cn } from "@/lib/utils";

/**
 * Which live previews each section shows. `wide` sections span two of the four
 * columns and show a second preview from `lg` up. Six wide plus four narrow
 * fill four rows of four exactly, so keep that sum when editing.
 */
const picks: Record<string, { slugs: string[]; wide?: boolean }> = {
  actions: { slugs: ["button", "chip"], wide: true },
  forms: { slugs: ["calendar", "slider"], wide: true },
  feedback: { slugs: ["notification", "alert"], wide: true },
  data: { slugs: ["table", "stat"], wide: true },
  overlays: { slugs: ["dialog", "command"], wide: true },
  navigation: { slugs: ["tabs", "stepper"], wide: true },
  craft: { slugs: ["liquid-glass"] },
  text: { slugs: ["gradient-text"] },
  hover: { slugs: ["hover-tilt"] },
  footers: { slugs: ["footer-cta"] },
};

/** The ten sections of the library, each with live previews and a way in. */
export function Shelves({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat, index) => {
        const pick = picks[cat.id];
        return (
          <Reveal
            key={cat.id}
            // Stagger by column so each row cascades left to right.
            delay={(index % 2) * 90}
            className={cn("h-full min-w-0", pick.wide && "lg:col-span-2")}
          >
            <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-quiet transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift">
              <FitStage className="relative h-64 border-b border-line bg-surface-muted/50 bg-dots">
                {pick.slugs.map((slug, i) => (
                  <div key={slug} className={cn(i > 0 && "hidden lg:block")}>
                    <LazyMount
                      rootMargin="700px"
                      placeholder={
                        <div className="h-24 w-44 animate-pulse-quiet rounded-md bg-line/60" />
                      }
                    >
                      <DemoStage slug={slug} mode="shelf" />
                    </LazyMount>
                  </div>
                ))}
              </FitStage>
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
          </Reveal>
        );
      })}
    </div>
  );
}
