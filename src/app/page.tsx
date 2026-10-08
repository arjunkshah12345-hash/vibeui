import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CopyCommand } from "@/components/home/copy-command";
import { HeroCollage } from "@/components/home/hero-collage";
import { Playground } from "@/components/home/playground";
import { Shelves } from "@/components/home/shelves";
import { SourceShowcase, type SourceItem } from "@/components/home/source-showcase";
import { Reveal } from "@/components/site/reveal";
import { buttonVariants } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DottedGrid } from "@/components/ui/dotted-grid";
import { getComponent, getSource, getSummaries } from "@/lib/registry";
import { site } from "@/lib/site";

const featured = ["button", "dock", "dialog", "tabs"];

/** Trim a source file to its first N lines at a clean break. */
function excerpt(source: string, max = 46) {
  const lines = source.split("\n");
  if (lines.length <= max) return { text: source, shown: lines.length, total: lines.length };
  return { text: lines.slice(0, max).join("\n") + "\n// …", shown: max, total: lines.length };
}

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mb-5 flex items-center gap-3 font-mono text-[12px] text-muted">
      <span className="text-accent">{n}</span>
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
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-grid opacity-40 [mask-image:radial-gradient(70%_80%_at_50%_0%,#000,transparent)]"
        />
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-7 inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-[12px] text-muted shadow-quiet">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping-soft rounded-full bg-accent opacity-60" />
                <span className="relative size-1.5 rounded-full bg-accent" />
              </span>
              v0.2 · open source · MIT
            </p>
            <h1 className="text-balance font-display text-[clamp(3rem,7.4vw,6.5rem)] leading-[0.95] tracking-[-0.02em] text-ink">
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="block animate-rise">Components with taste,</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="block animate-rise [animation-delay:90ms]">
                  <em className="text-accent">that you own.</em>
                </span>
              </span>
            </h1>
            <p className="mx-auto mt-7 max-w-xl animate-fade-up text-[17px] leading-relaxed text-muted [animation-delay:300ms]">
              {site.count} React and Tailwind components you copy into your repo and keep. One token
              file, real dark mode, motion that earns its place.
            </p>
            <div className="mt-9 flex animate-fade-up flex-wrap items-center justify-center gap-3 [animation-delay:380ms]">
              <Link href="/components" className={buttonVariants({ size: "lg" })}>
                Browse components <ArrowRight size={16} weight="bold" />
              </Link>
              <Link href="/docs" className={buttonVariants({ size: "lg", variant: "secondary" })}>
                Read the docs
              </Link>
            </div>
            <p className="mt-6 animate-fade-up font-mono text-[12px] text-faint [animation-delay:440ms]">
              {site.count} components · 4 peer dependencies · 0 kb of runtime
            </p>
          </div>

          <div className="mt-14 animate-fade-up [animation-delay:200ms] md:mt-16">
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
                Ten shelves. <em>One language.</em>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                Every preview below is the real component, live. Poke at them, then open a shelf to
                see the rest.
              </p>
            </div>
            <Link
              href="/components"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
            >
              All {site.count} components <ArrowRight size={14} weight="bold" />
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <Shelves counts={counts} />
          </Reveal>
        </div>
      </section>

      {/* 02 — tokens */}
      <section className="border-y border-line bg-surface-muted/40 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 max-w-2xl">
            <Label n="02">One token file</Label>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1] tracking-[-0.01em] text-ink">
              Change a variable. <em>Everything follows.</em>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              This is not a mock-up. These are the real components, and the controls rewrite the same
              CSS variables you would edit in your own project.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Playground />
          </Reveal>
        </div>
      </section>

      {/* 03 — source */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 max-w-2xl">
            <Label n="03">Your files</Label>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1] tracking-[-0.01em] text-ink">
              No black box. <em>Just the file.</em>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Every component is one self-contained file. This is the actual source on the right, not a
              screenshot of it.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <SourceShowcase items={sources} />
          </Reveal>
        </div>
      </section>

      {/* 04 — agents */}
      <section className="border-y border-line bg-surface-muted/40 px-5 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal>
            <Label n="04">Agent-ready</Label>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1] tracking-[-0.01em] text-ink">
              Your coding agent <em>can use it too.</em>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              An MCP server, a CLI with JSON output, an <code className="font-mono text-[0.9em] text-ink">llms.txt</code>{" "}
              brief and a registry with generated API tables. Agents search, read and add components
              without scraping a page.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {["search_components", "get_component", "add_component", "get_tokens"].map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11.5px] text-ink-soft"
                >
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/docs/agents"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
            >
              Agents and MCP <ArrowRight size={14} weight="bold" />
            </Link>
          </Reveal>
          <Reveal delay={120}>
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
      <section className="px-5 py-24 md:py-32">
        <Reveal className="mx-auto max-w-6xl">
          <DottedGrid className="rounded-xl px-6 py-20 text-center md:py-28">
            <p className="mb-6 font-mono text-[12px] text-muted">
              <span className="text-accent">05</span> — start
            </p>
            <h2 className="mx-auto max-w-3xl font-display text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.95] tracking-[-0.02em] text-ink">
              Take it. <em className="text-accent">It&apos;s yours.</em>
            </h2>
            <div className="mt-10 flex flex-col items-center gap-4">
              <CopyCommand command={`${site.cli} add button`} />
              <p className="text-[13px] text-muted">
                or{" "}
                <Link
                  href="/docs/installation"
                  className="font-medium text-ink underline decoration-line-strong underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
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
