import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Code, DocHeader, DocLink, H2, List, P } from "@/components/docs/prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Introduction",
  description: "What VibeUI is, how the copy-owned model works, and where to start.",
};

const next = [
  { href: "/docs/installation", title: "Installation", body: "Peers, tokens and your first component." },
  { href: "/docs/theming", title: "Theming", body: "Retint the accent, canvas and dark palette." },
  { href: "/docs/cli", title: "CLI", body: "Search, read and add components from the terminal." },
  { href: "/docs/agents", title: "Agents and MCP", body: "Let your coding agent do the integrating." },
];

export default function DocsIntro() {
  return (
    <>
      <DocHeader eyebrow="Getting started" title="Introduction">
        VibeUI is a library of {site.count} React and Tailwind components that you copy into your
        project. There is no runtime package: once a file is in your repo, it is yours to read, change
        and keep.
      </DocHeader>

      <H2 id="model">The copy-owned model</H2>
      <P>
        If you have used shadcn/ui, this will feel familiar. Instead of importing from{" "}
        <Code>node_modules</Code>, you add a component to <Code>src/components/ui</Code> and import it
        from there. Because the source is local, you can change a radius, swap an animation or delete a
        prop without waiting on a release.
      </P>
      <List>
        <li>
          <strong className="font-medium text-ink">Tokens, not themes.</strong> One CSS file defines
          colors, radii, shadows, easing, keyframes and the dark variant. Components only read tokens.
        </li>
        <li>
          <strong className="font-medium text-ink">Four peers.</strong> <Code>clsx</Code>,{" "}
          <Code>tailwind-merge</Code>, <Code>class-variance-authority</Code> and{" "}
          <Code>@phosphor-icons/react</Code>. No animation library required.
        </li>
        <li>
          <strong className="font-medium text-ink">Accessible by default.</strong> Native inputs where
          they exist, real roles and keyboard handling on the rest, and reduced-motion honoured.
        </li>
      </List>

      <H2 id="requirements">Requirements</H2>
      <List>
        <li>React 18 or newer</li>
        <li>Tailwind CSS v4</li>
        <li>
          A <Code>@/*</Code> path alias pointing at <Code>src/*</Code> (the default in most Next.js and
          Vite templates)
        </li>
      </List>

      <H2 id="next">Where to next</H2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {next.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="group rounded-lg border border-line bg-surface p-5 shadow-quiet transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-lift"
          >
            <span className="flex items-center justify-between text-[15px] font-medium tracking-[-0.01em] text-ink">
              {n.title}
              <ArrowRight size={14} weight="bold" className="text-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent" />
            </span>
            <span className="mt-1 block text-[13px] leading-snug text-muted">{n.body}</span>
          </Link>
        ))}
      </div>
      <P className="mt-10">
        Prefer to just look around? Browse the <DocLink href="/components">live component gallery</DocLink>{" "}
        or read the source on <DocLink href={site.url}>GitHub</DocLink>.
      </P>
    </>
  );
}
