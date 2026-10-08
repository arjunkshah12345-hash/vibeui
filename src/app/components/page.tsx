import type { Metadata } from "next";
import { ComponentBrowser } from "@/components/showcase/component-browser";
import { getSummaries } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Every VibeUI component with a live preview. Search, filter, and open any one for source and install steps.",
};

export default function ComponentsPage() {
  const components = getSummaries();

  return (
    <main className="flex-1 px-5">
      <header className="mx-auto max-w-6xl pb-10 pt-16 md:pt-20">
        <p className="mb-3 text-[13px] font-medium text-ink">The library</p>
        <h1 className="font-display text-[clamp(3rem,7vw,5rem)] leading-[0.98] tracking-[-0.02em] text-ink">
          {components.length} components,
          <br />
          all of them live.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
          Every card below is the real component, running. Open one for its source, install command and
          dependencies. Flip the theme in the header and watch everything retint.
        </p>
      </header>
      <ComponentBrowser components={components} />
    </main>
  );
}
