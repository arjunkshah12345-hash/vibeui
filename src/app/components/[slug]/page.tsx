import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DemoStage } from "@/components/showcase/demo-stage";
import { ApiTable } from "@/components/docs/api-table";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CodeBlock } from "@/components/ui/code-block";
import { Pill } from "@/components/ui/pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryLabel } from "@/lib/categories";
import { site } from "@/lib/site";
import { getComponent, getComponents, getNeighbors, getSource } from "@/lib/registry";

const spaced = (title: string) => title.replace(/([a-z])([A-Z])/g, "$1 $2");

export function generateStaticParams() {
  return getComponents().map((c) => ({ slug: c.name }));
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const meta = getComponent(slug);
  if (!meta) return {};
  return { title: spaced(meta.title), description: meta.description };
}

function DetailSkeleton() {
  return (
    <main className="flex-1 px-5 pb-24 pt-10">
      <div className="mx-auto max-w-5xl">
        <div className="h-5 w-56 animate-pulse-quiet rounded-sm bg-surface-muted" />
        <div className="mt-8 h-16 w-80 animate-pulse-quiet rounded-md bg-surface-muted" />
        <div className="mt-10 h-96 animate-pulse-quiet rounded-xl bg-surface-muted" />
      </div>
    </main>
  );
}

// `params` is read inside Suspense so client navigations can show the shell instantly.
export default function ComponentPage({
  params,
}: PageProps<"/components/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ComponentDetail params={params} />
    </Suspense>
  );
}

async function ComponentDetail({
  params,
}: {
  params: PageProps<"/components/[slug]">["params"];
}) {
  const { slug } = await params;
  const meta = getComponent(slug);
  if (!meta) notFound();

  const source = await getSource(slug);
  const { prev, next } = getNeighbors(slug);
  const title = spaced(meta.title);
  const peers = ["clsx", "tailwind-merge", ...meta.dependencies];
  const primaryExport = meta.exports[0];

  return (
    <main className="flex-1 px-5 pb-24 pt-10">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb
          items={[
            { label: "Components", href: "/components" },
            { label: categoryLabel(meta.category), href: `/components#${meta.category}` },
            { label: title },
          ]}
        />

        <header className="mt-8 max-w-2xl">
          <h1 className="font-display text-[clamp(3rem,7vw,4.75rem)] leading-[0.98] tracking-[-0.02em] text-ink">
            {title}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">{meta.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill tone="accent">{categoryLabel(meta.category)}</Pill>
            <Pill tone="outline">{meta.client ? "Client component" : "Server-safe"}</Pill>
            {meta.exports.length > 1 ? <Pill tone="outline">{meta.exports.length} exports</Pill> : null}
          </div>
        </header>

        <section aria-label="Preview" className="mt-10">
          <div className="relative overflow-hidden rounded-xl border border-line bg-surface-muted/50 bg-dots shadow-quiet">
            <DemoStage slug={slug} />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl tracking-[-0.01em] text-ink">Install</h2>
          <Tabs defaultValue="cli" className="mt-5">
            <TabsList>
              <TabsTrigger value="cli">CLI</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
            </TabsList>
            <TabsContent value="cli">
              <CodeBlock
                language="bash"
                code={`${site.cli} add ${slug} --dir ./src/components/ui`}
              />
              {meta.registryDependencies.length ? (
                <p className="mt-3 text-[13px] text-muted">
                  Also installs{" "}
                  {meta.registryDependencies.map((d, i) => (
                    <span key={d}>
                      {i > 0 ? ", " : ""}
                      <Link href={`/components/${d}`} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                        {d}
                      </Link>
                    </span>
                  ))}
                  , which it imports.
                </p>
              ) : null}
            </TabsContent>
            <TabsContent value="manual">
              <ol className="space-y-5 text-sm leading-relaxed text-muted">
                <li>
                  <span className="font-medium text-ink">1. Install peers</span>
                  <CodeBlock className="mt-2" language="bash" code={`npm i ${peers.join(" ")}`} />
                </li>
                <li>
                  <span className="font-medium text-ink">2. Copy the source</span> below into{" "}
                  <code className="font-mono text-[12px] text-ink-soft">{meta.file}</code>
                  {meta.registryDependencies.length ? ` along with ${meta.registryDependencies.join(", ")}` : ""}.
                </li>
                <li>
                  <span className="font-medium text-ink">3. Make sure the tokens are in your CSS</span>, see{" "}
                  <Link href="/docs/installation" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                    Installation
                  </Link>
                  .
                </li>
              </ol>
            </TabsContent>
          </Tabs>
          <p className="mb-2 mt-8 text-sm font-medium text-ink">Import</p>
          <CodeBlock
            language="tsx"
            code={`import { ${meta.exports.join(", ")} } from "@/components/ui/${slug}"`}
          />
        </section>

        <section className="mt-16" aria-label="API reference">
          <h2 className="font-display text-3xl tracking-[-0.01em] text-ink">API</h2>
          <p className="mt-2 max-w-xl text-[14px] text-muted">
            Generated from the component&apos;s TypeScript types, so it always matches the source.{" "}
            <span className="text-accent">*</span> marks a required prop.
          </p>
          <div className="mt-6">
            {meta.api.map((entry) => (
              <ApiTable key={entry.name} entry={entry} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl tracking-[-0.01em] text-ink">Source</h2>
          <CodeBlock
            className="mt-5"
            filename={meta.file}
            language="tsx"
            code={source}
            maxHeight={620}
          />
          <p className="mt-3 text-[13px] text-muted">
            Exports <code className="font-mono text-[12px] text-ink-soft">{primaryExport}</code>
            {meta.exports.length > 1 ? ` and ${meta.exports.length - 1} more` : ""}. Peer dependencies:{" "}
            {peers.join(", ")}.
          </p>
        </section>

        <nav aria-label="More components" className="mt-20 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/components/${prev.name}`}
              className="group flex items-center gap-3 rounded-lg border border-line bg-surface p-4 shadow-quiet transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-lift"
            >
              <ArrowLeft size={16} weight="bold" className="text-faint transition-transform group-hover:-translate-x-0.5" />
              <span>
                <span className="block text-xs text-muted">Previous</span>
                <span className="text-sm font-medium text-ink">{spaced(prev.title)}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/components/${next.name}`}
              className="group flex items-center justify-end gap-3 rounded-lg border border-line bg-surface p-4 text-right shadow-quiet transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-lift"
            >
              <span>
                <span className="block text-xs text-muted">Next</span>
                <span className="text-sm font-medium text-ink">{spaced(next.title)}</span>
              </span>
              <ArrowRight size={16} weight="bold" className="text-faint transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </nav>
      </div>
    </main>
  );
}
