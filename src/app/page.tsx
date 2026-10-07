"use client";

import Link from "next/link";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Marquee,
  Pill,
  RotatingCarousel,
} from "@/components/ui";
import { DemoFrame } from "@/components/showcase/section";
import { site } from "@/lib/site";

const carouselItems = [
  {
    id: "1",
    meta: "01",
    title: "Calm primitives",
    description: "Buttons, pills, forms — hairline and quiet.",
    accent: "#1c1c1a",
  },
  {
    id: "2",
    meta: "02",
    title: "Warm dark mode",
    description: "Stone canvas, not pure black sci-fi.",
    accent: "#1f6c9f",
  },
  {
    id: "3",
    meta: "03",
    title: "Signature craft",
    description: "Magnetic, dock, trading card — restrained.",
    accent: "#346538",
  },
  {
    id: "4",
    meta: "04",
    title: "Own the source",
    description: "MIT. Copy into your repo. Retint tokens.",
    accent: "#8a5a00",
  },
];

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5">
        <section className="relative overflow-hidden pb-16 pt-16 md:pb-24 md:pt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-8 size-[420px] rounded-full opacity-[0.05] dark:opacity-[0.08]"
            style={{
              background:
                "radial-gradient(circle, var(--ink) 0%, transparent 70%)",
            }}
          />
          <div className="mb-6 flex items-center gap-3 animate-fade-up">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/mark.svg"
              alt=""
              width={40}
              height={40}
              className="rounded-[10px]"
            />
            <Pill tone="outline">Open source · MIT</Pill>
          </div>
          <h1
            className="max-w-2xl font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,4.5rem)] leading-[1.05] tracking-[-0.03em] text-ink animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            VibeUI
          </h1>
          <p
            className="mt-5 max-w-md text-[17px] leading-relaxed text-muted animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {site.tagline}. Copy-owned React + Tailwind components — integrate in
            minutes, keep every line.
          </p>
          <div
            className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            <Link href="/docs">
              <Button size="lg">Get started</Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="secondary">
                Browse gallery
              </Button>
            </Link>
            <a href={site.url} target="_blank" rel="noreferrer">
              <Button size="lg" variant="ghost">
                GitHub
              </Button>
            </a>
          </div>
          <div
            className="mt-6 flex flex-wrap gap-2 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <Pill tone="sage" dot>
              Dark mode
            </Pill>
            <Pill tone="sky">80+ components</Pill>
            <Pill tone="outline">shadcn · Obsidian · Magic UI</Pill>
          </div>
        </section>

        <section className="border-t border-line py-14">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
            Integrate in three steps
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Paste tokens",
                body: "Drop templates/vibeui.css into your globals — light + dark.",
              },
              {
                n: "02",
                title: "Add utils",
                body: "One cn() helper. Path alias @/* → src/*.",
              },
              {
                n: "03",
                title: "Copy components",
                body: "npm run add -- button ./your/ui — or paste the file.",
              },
            ].map((step) => (
              <Card key={step.n}>
                <CardHeader>
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                    {step.n}
                  </p>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/docs">
              <Button variant="secondary">Read the docs</Button>
            </Link>
          </div>
        </section>

        <section id="preview" className="scroll-mt-24 border-t border-line py-16">
          <div className="mb-8 max-w-xl">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
              Preview
            </p>
            <h2 className="text-2xl font-medium tracking-[-0.03em] text-ink">
              Signature piece
            </h2>
            <p className="mt-2 text-[15px] text-muted">
              Full catalog on the gallery — craft section included.
            </p>
          </div>
          <DemoFrame className="overflow-hidden bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-muted)_100%)]">
            <RotatingCarousel items={carouselItems} radius={200} />
          </DemoFrame>
        </section>

        <section className="border-t border-line py-16">
          <Marquee className="rounded-[var(--radius-lg)] border border-line">
            {["MIT", "React", "Tailwind", "Copy-owned", "Dark mode", "Craft"].map(
              (name) => (
                <span
                  key={name}
                  className="whitespace-nowrap text-sm font-medium text-ink-soft"
                >
                  {name}
                  <span className="ml-8 text-faint">·</span>
                </span>
              ),
            )}
          </Marquee>
        </section>
      </main>

      <footer className="mt-auto border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark.svg" alt="" width={24} height={24} className="rounded-[6px]" />
            <p className="font-[family-name:var(--font-display)] text-xl text-ink">
              VibeUI
            </p>
          </div>
          <p className="text-xs text-faint">
            MIT · {site.repo}
          </p>
        </div>
      </footer>
    </>
  );
}
