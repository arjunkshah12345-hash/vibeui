import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CopyCommand } from "@/components/home/copy-command";
import { FeatureBento } from "@/components/home/feature-bento";
import { HeroStage } from "@/components/home/hero-stage";
import { RotatingCarousel } from "@/components/ui/rotating-carousel";
import { carouselItems } from "@/components/showcase/sample-data";
import { CodeBlock } from "@/components/ui/code-block";
import { buttonVariants } from "@/components/ui/button";
import { FooterCta } from "@/components/ui/footer-cta";
import { Marquee } from "@/components/ui/marquee";
import { Pill } from "@/components/ui/pill";
import { categories } from "@/lib/categories";
import { getComponents } from "@/lib/registry";
import { site } from "@/lib/site";

function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-3 text-[13px] font-medium text-accent">{eyebrow}</p>
      <h2 className="font-display text-[44px] leading-[1.02] tracking-[-0.01em] text-ink md:text-[52px]">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 text-base leading-relaxed text-muted">{children}</p>
      ) : null}
    </div>
  );
}

export default function Home() {
  const components = getComponents();
  const counts = new Map<string, number>();
  for (const c of components) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-24 pt-20 md:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-grid opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_0%,#000,transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href="/docs"
            className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-[13px] text-muted shadow-quiet transition-colors hover:border-line-strong hover:text-ink"
          >
            <Pill tone="accent">v0.2</Pill>
            Redesigned tokens, 104 refined components
            <ArrowRight size={12} weight="bold" />
          </Link>
          <h1
            className="animate-fade-up mt-7 font-display text-[clamp(3.25rem,9vw,6.5rem)] leading-[0.95] tracking-[-0.02em] text-ink"
            style={{ animationDelay: "60ms" }}
          >
            Components with taste,
            <br />
            <span className="text-accent">that you own.</span>
          </h1>
          <p
            className="animate-fade-up mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {site.count} copy-owned React and Tailwind components with warm tokens, real dark mode and
            signature motion. Add one with a command. Keep every line.
          </p>
          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Link href="/components" className={buttonVariants({ size: "lg" })}>
              Browse components
              <ArrowRight size={16} weight="bold" />
            </Link>
            <CopyCommand command={`${site.cli} add button`} />
          </div>
        </div>

        <div className="animate-fade-up mt-16 md:mt-20" style={{ animationDelay: "260ms" }}>
          <HeroStage />
        </div>
      </section>

      {/* Ticker */}
      <section aria-label="Component names" className="border-y border-line bg-surface-muted/40 py-3">
        <Marquee duration={90}>
          {components.map((c) => (
            <Link
              key={c.name}
              href={`/components/${c.name}`}
              className="whitespace-nowrap font-display text-[28px] leading-none text-faint transition-colors duration-200 hover:text-ink"
            >
              {c.title.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </Link>
          ))}
        </Marquee>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <SectionHead eyebrow="Why VibeUI" title="Finished on day one.">
          Everything is designed against one token language, so pieces from different corners of the
          library look like they were made together.
        </SectionHead>
        <FeatureBento />
      </section>

      {/* Signature */}
      <section className="border-y border-line bg-surface-muted/40 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead eyebrow="Signature" title="The memorable ones.">
            A 3D ring carousel, a magnifying dock, a tilting trading card. Used sparingly, they give a
            product a point of view. Drag the ring, or use the arrow keys.
          </SectionHead>
          <div className="overflow-hidden rounded-xl border border-line bg-surface bg-dots px-4 py-14 shadow-quiet">
            <RotatingCarousel items={carouselItems} />
          </div>
          <div className="mt-6 flex justify-center">
            <Link href="/components#craft" className={buttonVariants({ variant: "secondary" })}>
              See all signature components <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <SectionHead eyebrow="Integrate" title="Three steps. Two minutes.">
          Works with any React 18+ app on Tailwind v4. Next.js, Vite, whatever you ship with.
        </SectionHead>
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-quiet">
          {[
            {
              n: "01",
              title: "Install peers",
              body: "Four small packages. No animation library.",
              code: "npm i clsx tailwind-merge class-variance-authority @phosphor-icons/react",
              lang: "bash",
            },
            {
              n: "02",
              title: "Import tokens",
              body: "Colors, radii, shadows, keyframes and the dark variant, in one file.",
              code: '@import "tailwindcss";\n@import "./vibeui.tokens.css";',
              lang: "css",
            },
            {
              n: "03",
              title: "Add a component",
              body: "Siblings it imports come along automatically.",
              code: `${site.cli} add button --dir ./src/components/ui`,
              lang: "bash",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="grid items-center gap-6 border-b border-line p-6 last:border-b-0 md:grid-cols-[1fr_1.5fr] md:p-8"
            >
              <div>
                <p className="font-mono text-[12px] text-accent">{step.n}</p>
                <h3 className="mt-2 text-xl font-medium tracking-[-0.02em] text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
              <CodeBlock language={step.lang} code={step.code} />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-line-strong underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
          >
            Read the full installation guide <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:pb-32">
        <SectionHead eyebrow="The library" title={`${site.count} components, ten shelves.`} />
        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/components#${c.id}`}
              className="group flex flex-col bg-surface p-5 transition-colors duration-200 hover:bg-surface-muted"
            >
              <span className="font-mono text-[12px] text-faint transition-colors group-hover:text-accent">
                {String(counts.get(c.id) ?? 0).padStart(2, "0")}
              </span>
              <span className="mt-6 text-[15px] font-medium tracking-[-0.01em] text-ink">{c.label}</span>
              <span className="mt-1 text-[13px] leading-snug text-muted">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      <FooterCta
        title="Ship quieter interfaces."
        description="Copy components into your app, retint the tokens, and keep every line."
        primary={{ label: "Browse components", href: "/components" }}
        secondary={{ label: "Read the docs", href: "/docs" }}
      />
    </main>
  );
}
