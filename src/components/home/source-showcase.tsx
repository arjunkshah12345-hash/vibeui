"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { CodeBlock } from "@/components/ui/code-block";
import { MagnetTabs } from "@/components/ui/magnet-tabs";

// The demo registry is large; load it after first paint, not with the page.
const DemoStage = dynamic(
  () => import("@/components/showcase/demo-stage").then((m) => m.DemoStage),
  {
    ssr: false,
    loading: () => <div className="h-24 w-40 animate-pulse-quiet rounded-md bg-surface-muted" />,
  },
);

export type SourceItem = {
  slug: string;
  title: string;
  file: string;
  excerpt: string;
  totalLines: number;
  shownLines: number;
};

/** A live component beside the real file it comes from. */
export function SourceShowcase({ items }: { items: SourceItem[] }) {
  const [slug, setSlug] = React.useState(items[0]?.slug ?? "");
  const item = items.find((i) => i.slug === slug) ?? items[0];
  if (!item) return null;

  return (
    <div>
      <MagnetTabs
        value={slug}
        onChange={setSlug}
        tabs={items.map((i) => ({ value: i.slug, label: i.title }))}
        className="mb-5"
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div
          key={item.slug}
          className="relative flex min-h-[420px] min-w-0 animate-fade-up items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-muted/50 bg-dots px-6 shadow-quiet"
        >
          <DemoStage slug={item.slug} mode="tile" />
        </div>
        <div key={`${item.slug}-code`} className="min-w-0 animate-fade-up [animation-delay:80ms]">
          <CodeBlock
            filename={item.file}
            language="tsx"
            code={item.excerpt}
            maxHeight={420}
            className="h-full"
          />
          <div className="mt-3 flex items-center justify-between text-[13px] text-muted">
            <span>
              Showing {item.shownLines} of {item.totalLines} lines
            </span>
            <Link
              href={`/components/${item.slug}`}
              className="inline-flex items-center gap-1.5 font-medium text-ink transition-colors hover:text-accent"
            >
              Full file <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
