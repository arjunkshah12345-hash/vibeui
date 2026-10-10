import type { Metadata } from "next";
import { Accordion } from "@/components/ui/accordion";
import { Code, DocHeader, DocLink, H2, P } from "@/components/docs/prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about licensing, npm, frameworks, Server Components, bundle size, dark mode and contributing.",
};

export default function Faq() {
  const q = (id: string, title: string, content: React.ReactNode) => ({ id, title, content });

  const general = [
    q(
      "npm",
      "Is VibeUI on npm?",
      <>
        Yes, the CLI is. Components are still just files you copy: run <Code>{site.cli}</Code> to
        add them, and nothing is installed into your project.
      </>,
    ),
    q(
      "license",
      "What is the license?",
      <>
        MIT. You can use, modify and ship it commercially. Keep the license notice with copied files
        where required. Third-party dependencies keep their own licenses: see{" "}
        <Code>THIRD_PARTY_NOTICES.md</Code> in the repo.
      </>,
    ),
    q(
      "shadcn",
      "How is this different from shadcn/ui?",
      <>
        Same copy-owned philosophy and familiar API conventions, but VibeUI has no headless
        primitives dependency, builds motion into every component, ships one token file that
        includes keyframes and the dark variant, and adds signature, text, hover and footer
        components. See the comparison on the <DocLink href="/docs">introduction</DocLink>.
      </>,
    ),
    q(
      "bundle",
      "How big is it?",
      <>
        There is no library bundle: you ship only the files you add and their four peers. A typical
        component is 1–6 KB of source.
      </>,
    ),
    q(
      "peers",
      "Why these four dependencies?",
      <>
        <Code>clsx</Code> and <Code>tailwind-merge</Code> combine class names safely,{" "}
        <Code>class-variance-authority</Code> declares variants, and{" "}
        <Code>@phosphor-icons/react</Code> provides icons. Nothing else is required at runtime.
      </>,
    ),
  ];

  const technical = [
    q(
      "react",
      "Which React versions work?",
      <>
        React 18 and newer. Components use <Code>useId</Code> and <Code>useSyncExternalStore</Code>.
        The showcase site runs React 19.
      </>,
    ),
    q(
      "tailwind",
      "Does it work with Tailwind v3?",
      <>
        No. The token file uses Tailwind v4 features (<Code>@theme</Code>,{" "}
        <Code>@custom-variant</Code>, CSS-first configuration). Components also use v4 utilities
        such as <Code>size-*</Code> and individual transform properties.
      </>,
    ),
    q(
      "rsc",
      "Does it work with Server Components?",
      <>
        Yes. Files without <Code>&quot;use client&quot;</Code> are server-safe. Interactive ones are
        client components and can be imported from Server Components; just do not pass functions
        from the server. The <DocLink href="/docs/components">components page</DocLink> lists which
        is which.
      </>,
    ),
    q(
      "vite",
      "Does it work outside Next.js?",
      <>
        Yes. Vite, Remix / React Router, Astro with React islands and others work. Only the path
        alias and the Tailwind plugin differ. See{" "}
        <DocLink href="/docs/installation">Installation</DocLink>.
      </>,
    ),
    q(
      "ssr",
      "Will theming flash on load?",
      <>
        Not if you add the inline theme script. See{" "}
        <DocLink href="/docs/dark-mode">Dark mode</DocLink>.
      </>,
    ),
    q(
      "browsers",
      "Which browsers are supported?",
      <>
        Current evergreen browsers. A few effects use newer CSS: <Code>color-mix()</Code>,
        individual transform properties, <Code>mask-image</Code> and the{" "}
        <Code>animation-timeline</Code>-free CSS only. Older browsers degrade to flatter styling
        rather than breaking.
      </>,
    ),
    q(
      "a11y",
      "Is it accessible?",
      <>
        It uses native controls and real roles, and states its gaps honestly. See{" "}
        <DocLink href="/docs/accessibility">Accessibility</DocLink>. It has not had a formal audit.
      </>,
    ),
    q(
      "tests",
      "Are there tests?",
      <>
        Not a unit-test suite yet. The repository is checked with TypeScript, ESLint and a
        production build. Contributions of tests are welcome.
      </>,
    ),
  ];

  const workflow = [
    q(
      "edit",
      "How do I update a component I already copied?",
      <>
        Commit, re-run <Code>add</Code> for it, and use your Git diff to port any local edits.
        Components are small and self-contained, so this is quick.
      </>,
    ),
    q(
      "remove",
      "How do I remove a component?",
      <>Delete its file. There is no registry state in your project to clean up.</>,
    ),
    q(
      "rename",
      "Can I rename or move the ui folder?",
      <>
        Yes. Pass <Code>--dir</Code> to the CLI and adjust imports. Components import each other
        with relative paths (<Code>./button</Code>) so they keep working together.
      </>,
    ),
    q(
      "agents",
      "Can my AI coding agent install components?",
      <>
        Yes: use the MCP server, the CLI with <Code>--json</Code>, or point it at{" "}
        <Code>llms.txt</Code>. See <DocLink href="/docs/agents">Agents and MCP</DocLink>.
      </>,
    ),
    q(
      "contribute",
      "How do I contribute?",
      <>
        See <DocLink href="/docs/contributing">Contributing</DocLink>. Bug reports with a
        reproduction are the most useful thing you can send.
      </>,
    ),
  ];

  return (
    <>
      <DocHeader eyebrow="Guides" title="FAQ">
        Short answers to the questions that come up most.
      </DocHeader>
      <H2 id="general">General</H2>
      <Accordion items={general} defaultOpen={[]} type="multiple" />
      <H2 id="technical">Technical</H2>
      <Accordion items={technical} defaultOpen={[]} type="multiple" />
      <H2 id="workflow">Workflow</H2>
      <Accordion items={workflow} defaultOpen={[]} type="multiple" />
      <P className="mt-10">
        Something missing? <DocLink href={`${site.url}/issues`}>Open an issue</DocLink>.
      </P>
    </>
  );
}
