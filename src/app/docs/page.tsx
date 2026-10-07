import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { Pill } from "@/components/ui/pill";
import { site } from "@/lib/site";

export const metadata = {
  title: "Docs — VibeUI",
  description: "Install and integrate VibeUI components into your React app.",
};

export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-12">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
        Documentation
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,2.75rem)] tracking-[-0.03em] text-ink">
        Integrate VibeUI
      </h1>
      <p className="mt-3 text-[16px] leading-relaxed text-muted">
        Copy-owned components — same model as shadcn. No black-box npm UI
        runtime. Paste tokens, copy files, ship.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill tone="sage" dot>
          MIT
        </Pill>
        <Pill tone="sky">React + Tailwind v4</Pill>
        <Pill tone="outline">Own the source</Pill>
      </div>

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="text-xl font-medium tracking-[-0.02em] text-ink">
          1. Dependencies
        </h2>
        <p className="mt-2 text-sm text-muted">
          In your app (Next.js / Vite / whatever React 18+):
        </p>
        <div className="mt-4">
          <CodeBlock
            language="bash"
            code={`npm i clsx tailwind-merge class-variance-authority @phosphor-icons/react`}
          />
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-xl font-medium tracking-[-0.02em] text-ink">
          2. Design tokens
        </h2>
        <p className="mt-2 text-sm text-muted">
          Copy{" "}
          <code className="font-mono text-[12px] text-ink-soft">
            templates/vibeui.css
          </code>{" "}
          into your global stylesheet (or merge the{" "}
          <code className="font-mono text-[12px]">:root</code> /{" "}
          <code className="font-mono text-[12px]">.dark</code> blocks). Toggle
          dark with a <code className="font-mono text-[12px]">.dark</code> class
          on <code className="font-mono text-[12px]">&lt;html&gt;</code>.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-xl font-medium tracking-[-0.02em] text-ink">
          3. Utils
        </h2>
        <p className="mt-2 text-sm text-muted">
          Add <code className="font-mono text-[12px]">cn()</code> helper:
        </p>
        <div className="mt-4">
          <CodeBlock
            language="ts"
            code={`// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}
          />
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-xl font-medium tracking-[-0.02em] text-ink">
          4. Copy a component
        </h2>
        <p className="mt-2 text-sm text-muted">
          From a clone of this repo, copy into your project:
        </p>
        <div className="mt-4">
          <CodeBlock
            language="bash"
            code={`git clone https://github.com/${site.repo}.git
cd vibeui
npm run add -- button ../my-app/src/components/ui`}
          />
        </div>
        <p className="mt-4 text-sm text-muted">
          Or manually copy{" "}
          <code className="font-mono text-[12px]">
            src/components/ui/button.tsx
          </code>{" "}
          and import:
        </p>
        <div className="mt-4">
          <CodeBlock
            language="tsx"
            code={`import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Primary</Button>
}`}
          />
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Path alias
        </h2>
        <p className="mt-2 text-sm text-muted">
          Components import <code className="font-mono text-[12px]">@/lib/utils</code>.
          Ensure your <code className="font-mono text-[12px]">tsconfig</code> has:
        </p>
        <div className="mt-4">
          <CodeBlock
            language="json"
            code={`{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}`}
          />
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Explore
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            <Link href="/gallery" className="font-medium text-ink underline decoration-line-strong underline-offset-4">
              Gallery
            </Link>{" "}
            — every component live
          </li>
          <li>
            <a
              href={site.url}
              className="font-medium text-ink underline decoration-line-strong underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>{" "}
            — source, issues, PRs
          </li>
          <li>
            <code className="font-mono text-[12px] text-ink-soft">
              registry/components.json
            </code>{" "}
            — machine-readable catalog
          </li>
        </ul>
      </section>
    </main>
  );
}
