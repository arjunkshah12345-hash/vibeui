import type { Metadata } from "next";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { Code, DocHeader, H2, List, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Theming and dark mode",
  description: "How VibeUI tokens work, how to retint the accent, and how to wire dark mode.",
};

export default function Theming() {
  return (
    <>
      <DocHeader eyebrow="Customize" title="Theming and dark mode">
        Every color, radius, shadow and curve is a CSS variable. Change a token and every component
        follows, in both themes.
      </DocHeader>

      <H2 id="tokens">The tokens</H2>
      <div className="mt-5 grid gap-5 rounded-lg border border-line bg-surface p-6 shadow-quiet sm:grid-cols-2">
        <ColorSwatch color="var(--canvas)" label="Canvas" value="--canvas · page background" />
        <ColorSwatch color="var(--surface)" label="Surface" value="--surface · cards, inputs" />
        <ColorSwatch color="var(--surface-muted)" label="Surface muted" value="--surface-muted · wells, hovers" />
        <ColorSwatch color="var(--ink)" label="Ink" value="--ink · text, primary buttons" />
        <ColorSwatch color="var(--accent)" label="Accent" value="--accent · focus, selection, progress" />
        <ColorSwatch color="var(--line-strong)" label="Line" value="--line · --line-strong · borders" />
      </div>
      <P>
        Semantic pastels (<Code>rose</Code>, <Code>sky</Code>, <Code>sage</Code>, <Code>sand</Code>)
        exist for status and are retinted for dark. Tailwind picks all of these up as utilities, so{" "}
        <Code>bg-surface</Code>, <Code>text-muted</Code>, <Code>border-line</Code> and{" "}
        <Code>ring-ring</Code> just work.
      </P>

      <H2 id="accent">Retint the accent</H2>
      <P>
        VibeUI ships with a warm vermilion accent. Override it in your own CSS, after the tokens import.
        Keep <Code>--accent-ink</Code> readable on top of it.
      </P>
      <CodeBlock
        language="css"
        filename="globals.css"
        code={`:root {
  --accent: #2563eb;
  --accent-ink: #ffffff;
  --accent-soft: rgb(37 99 235 / 0.1);
  --ring: rgb(37 99 235 / 0.3);
}

.dark {
  --accent: #6ea8ff;
  --accent-ink: #06142e;
  --accent-soft: rgb(110 168 255 / 0.14);
  --ring: rgb(110 168 255 / 0.32);
}`}
      />

      <H2 id="dark-mode">Dark mode</H2>
      <P>
        Dark mode is a <Code>dark</Code> class on <Code>&lt;html&gt;</Code>. The tokens file redefines
        the variables under <Code>.dark</Code> and registers a matching Tailwind variant, so{" "}
        <Code>dark:</Code> utilities follow the class rather than the OS setting.
      </P>
      <P>
        To avoid a flash of the wrong theme, set the class with a tiny inline script before first paint:
      </P>
      <CodeBlock
        language="tsx"
        filename="app/layout.tsx"
        code={`const script = \`
(function () {
  var s = localStorage.getItem('theme');
  var d = matchMedia('(prefers-color-scheme: dark)').matches;
  if (s === 'dark' || (!s && d)) document.documentElement.classList.add('dark');
})();\`

// in <head>
<script dangerouslySetInnerHTML={{ __html: script }} />`}
      />
      <P>
        This site&apos;s own provider is a good reference: it reads the class with{" "}
        <Code>useSyncExternalStore</Code>, so the toggle can never drift from the page.
      </P>

      <H2 id="scoping">Scoping a theme</H2>
      <P>
        Because dark mode is just variables on a class, you can scope it. Wrap any subtree in an element
        with <Code>class=&quot;dark&quot;</Code> and everything inside renders dark, whatever the page is
        doing. The landing page uses this to show both themes side by side.
      </P>

      <H2 id="motion">Motion and reduced motion</H2>
      <List>
        <li>
          Keyframes and <Code>animate-*</Code> utilities (<Code>animate-marquee</Code>,{" "}
          <Code>animate-shimmer</Code>, <Code>animate-pop-in</Code> and friends) live in the tokens
          file, so copied components animate in your app too.
        </li>
        <li>
          A single <Code>prefers-reduced-motion</Code> rule in the base layer shortens every animation
          and transition.
        </li>
        <li>
          Easing curves are tokens: <Code>ease-out</Code> and <Code>ease-spring</Code>.
        </li>
      </List>
    </>
  );
}
