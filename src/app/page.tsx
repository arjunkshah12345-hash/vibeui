import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CopyCommand } from "@/components/home/copy-command";
import { HeroCollage } from "@/components/home/hero-collage";
import { HeroHeadline } from "@/components/home/hero-headline";
import { Shelves } from "@/components/home/shelves";
import { SourceShowcase, type SourceItem } from "@/components/home/source-showcase";
import { Reveal } from "@/components/site/reveal";
import { buttonVariants } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DottedGrid } from "@/components/ui/dotted-grid";
import { getComponent, getSource, getSummaries } from "@/lib/registry";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const featured = ["dock", "dialog", "table", "button"];

/** Trim a source file to its first N lines at a clean break. */
function excerpt(source: string, max = 46) {
  const lines = source.split("\n");
  if (lines.length <= max) return { text: source, shown: lines.length, total: lines.length };
  return {
    text: lines.slice(0, max).join("\n") + "\n// …",
    shown: max,
    total: lines.length,
  };
}

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mb-5 flex items-center gap-3 font-mono text-[12px] text-muted">
      <span className="text-ink">{n}</span>
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      {children}
    </p>
  );
}

export default async function Home() {
  const components = getSummaries();
  const counts: Record<string, number> = {};
  for (const c of components) counts[c.category] = (counts[c.category] ?? 0) + 1;

  const sources: SourceItem[] = await Promise.all(
    featured.map(async (slug) => {
      const meta = getComponent(slug)!;
      const { text, shown, total } = excerpt(await getSource(slug));
      return {
        slug,
        title: meta.title.replace(/([a-z])([A-Z])/g, "$1 $2"),
        file: meta.file,
        excerpt: text,
        shownLines: shown,
        totalLines: total,
      };
    }),
  );

  return (
    <main className="flex-1">
      {/* hero */}
      <section className="relative px-5 pb-6 pt-14 md:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-grid opacity-30 [mask-image:radial-gradient(70%_70%_at_0%_0%,#000,transparent)]"
        />
        <div className="mx-auto max-w-6xl">
          <div className="text-left">
            <p className="mb-6 inline-flex animate-fade-up items-center gap-2.5 rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-[12px] text-muted shadow-quiet">
              <span className="size-1.5 rounded-full bg-ink" />
              v0.3 · open source · MIT
            </p>
            <HeroHeadline />
            <div className="max-w-2xl">
              <p className="mt-5 max-w-lg animate-fade-up text-[17px] leading-relaxed text-muted [animation-delay:140ms]">
                {site.count} React and Tailwind components you copy into your repo and keep. One
                token file, real dark mode, motion that earns its place.
              </p>
              <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:220ms]">
                <Link
                  href="/components"
                  className={cn(buttonVariants({ size: "lg" }), "rounded-md")}
                >
                  Browse components <ArrowRight size={16} weight="bold" />
                </Link>
                <Link
                  href="/docs"
                  className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "rounded-md")}
                >
                  Read the docs
                </Link>
              </div>
              <p className="mt-5 animate-fade-up font-mono text-[12px] text-faint [animation-delay:300ms]">
                {site.count} components · 4 peer dependencies · 0 kb of runtime
              </p>
            </div>
          </div>

          <div className="mt-12 md:mt-14">
            <HeroCollage />
          </div>
        </div>
      </section>

      {/* 01 — the library */}
      <section className="px-5 pb-24 pt-20 md:pb-32 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Label n="01">The library</Label>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1] tracking-[-0.01em] text-ink">
                Ten different sections.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                Every preview below is the real component, live. Poke at them, then open a section
                to see the rest.
              </p>
            </div>
            <Link
              href="/components"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-muted"
            >
              All {site.count} components <ArrowRight size={14} weight="bold" />
            </Link>
          </Reveal>
          <Shelves counts={counts} />
        </div>
      </section>

      {/* 02 — source */}
      <section className="border-y border-line bg-surface-muted/40 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 max-w-2xl">
            <Label n="02">Your files</Label>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1] tracking-[-0.01em] text-ink">
              No black box. Just the file.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Every component is one self-contained file. This is the actual source on the right,
              not a screenshot of it.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <SourceShowcase items={sources} />
          </Reveal>
        </div>
      </section>

      {/* 03 — agents */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal>
            <Label n="03">Agent-ready</Label>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1] tracking-[-0.01em] text-ink">
              Your coding agent can use it too.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              An MCP server, a CLI with JSON output, an{" "}
              <code className="font-mono text-[0.9em] text-ink">llms.txt</code> brief and a registry
              with generated API tables. Agents search, read and add components without scraping a
              page.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {["search_components", "get_component", "add_component", "get_tokens"].map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-line bg-surface px-3 py-1 font-mono text-[11.5px] text-ink-soft"
                >
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/docs/agents"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-muted"
            >
              Agents and MCP <ArrowRight size={14} weight="bold" />
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <CodeBlock
              language="bash"
              filename="terminal"
              code={`# give your agent the library
claude mcp add vibeui -- node ./vibeui/mcp/server.mjs

# or drive the CLI yourself
${site.cli} search "date picker" --json
${site.cli} add calendar --dir ./src/components/ui`}
            />
          </Reveal>
        </div>
      </section>

      {/* 04 — take it */}
      <section className="border-t border-line px-5 py-24 md:py-32">
        <Reveal className="mx-auto max-w-6xl">
          <DottedGrid className="rounded-xl px-6 py-20 text-center md:py-28">
            <p className="mb-6 font-mono text-[12px] text-muted">
              <span className="text-ink">04</span> — start
            </p>
            <h2 className="mx-auto max-w-3xl font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-ink">
              Take it. It&apos;s yours.
            </h2>
            <div className="mt-10 flex flex-col items-center gap-4">
              <CopyCommand command={`${site.cli} add button`} />
              <p className="text-[13px] text-muted">
                or{" "}
                <Link
                  href="/docs/installation"
                  className="font-medium text-ink underline decoration-line-strong underline-offset-[5px] transition-colors hover:text-muted"
                >
                  follow the two-minute guide
                </Link>
              </p>
            </div>
          </DottedGrid>
        </Reveal>
      </section>
    </main>
  );
}
