import type { Metadata } from "next";
import { Code, DocHeader, DocLink, DocTable, H2, Note, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Dark mode",
  description: "The class strategy, a flash-free inline script, a provider with no effects, and scoping.",
};

export default function DarkMode() {
  return (
    <>
      <DocHeader eyebrow="Customize" title="Dark mode">
        Dark mode is a <Code>dark</Code> class on <Code>&lt;html&gt;</Code>. The token file swaps the
        variables under it, so every component retints with no per-component work.
      </DocHeader>

      <H2 id="strategy">The class strategy</H2>
      <P>
        VibeUI uses a class rather than the <Code>prefers-color-scheme</Code> media query so users can
        choose independently of their OS. The token file registers a matching Tailwind variant:
      </P>
      <CodeBlock
        language="css"
        code={`@custom-variant dark (&:where(.dark, .dark *));`}
      />
      <P>
        Without that line Tailwind v4 would apply <Code>dark:</Code> utilities based on the OS
        setting, ignoring your toggle. It is the first line of <Code>vibeui.css</Code>, so you get it
        by importing the file.
      </P>
      <DocTable
        head={["Mode", "Palette", "Accent"]}
        mono={[]}
        rows={[
          ["Light", "Warm bone canvas, white surfaces, ink text", "Vermilion"],
          ["Dark", "Warm stone canvas, charcoal surfaces, off-white text", "The ink (monochrome)"],
        ]}
      />

      <H2 id="no-flash">Avoid the flash of the wrong theme</H2>
      <P>
        The server cannot know the user&apos;s choice, so render a tiny inline script in{" "}
        <Code>&lt;head&gt;</Code> that sets the class before first paint:
      </P>
      <CodeBlock
        language="tsx"
        filename="components/theme-script.tsx"
        code={`export function ThemeScript() {
  const code = \`
(function(){
  try {
    var s = localStorage.getItem('theme');
    var d = matchMedia('(prefers-color-scheme: dark)').matches;
    var t = s === 'light' || s === 'dark' ? s : (d ? 'dark' : 'light');
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();\`

  return (
    <script
      // Runs from the server HTML; inert text/plain once rendered on the client,
      // which keeps React from warning about a <script> in a component.
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  )
}`}
      />
      <P>
        Render it inside <Code>&lt;head&gt;</Code> and add <Code>suppressHydrationWarning</Code> to{" "}
        <Code>&lt;html&gt;</Code>, because the script changes the class before React hydrates.
      </P>

      <H2 id="provider">A provider with no effects</H2>
      <P>
        You rarely need state for the theme: the class on <Code>&lt;html&gt;</Code> <em>is</em> the
        state. Subscribing to it with <Code>useSyncExternalStore</Code> means the toggle can never
        drift from the page, and there is no <Code>useEffect</Code> that sets state on mount.
      </P>
      <CodeBlock
        language="tsx"
        filename="components/theme-toggle.tsx"
        code={`"use client"

import * as React from "react"
import { Moon, Sun } from "@phosphor-icons/react"

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => mo.disconnect()
}
const isDark = () => document.documentElement.classList.contains("dark")

function setTheme(next: "light" | "dark") {
  document.documentElement.classList.toggle("dark", next === "dark")
  document.documentElement.style.colorScheme = next
  localStorage.setItem("theme", next)
}

export function ThemeToggle() {
  const dark = React.useSyncExternalStore(subscribe, isDark, () => false)

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex size-9 items-center justify-center rounded-sm text-muted hover:bg-surface-muted hover:text-ink"
    >
      {/* Swap with CSS so the first paint always matches the real theme. */}
      <Sun size={18} weight="bold" className="hidden dark:block" />
      <Moon size={18} weight="bold" className="dark:hidden" />
    </button>
  )
}`}
      />

      <H2 id="scoping">Scoping and previews</H2>
      <P>
        Tokens are plain CSS variables, so a <Code>dark</Code> (or <Code>light</Code>) class on any
        element pins that subtree to a palette. This site uses it for the live playground, and
        also accepts <Code>?theme=light</Code> / <Code>?theme=dark</Code> in the URL for shareable
        previews.
      </P>
      <CodeBlock
        language="tsx"
        code={`<div className="light rounded-xl bg-canvas p-6 text-ink">…always light…</div>
<div className="dark  rounded-xl bg-canvas p-6 text-ink">…always dark…</div>`}
      />

      <H2 id="checklist">Checklist</H2>
      <DocTable
        head={["Check", "Why"]}
        mono={[]}
        rows={[
          ["<html> has suppressHydrationWarning", "The inline script edits its class before hydration."],
          ["Script is in <head>", "It must run before the body paints."],
          ["color-scheme is set", "Native scrollbars, form controls and autofill follow it."],
          ["No hard-coded hex in your own components", "Use tokens (bg-surface, text-ink) so they retint."],
          ["Images and charts checked in both modes", "Transparent PNGs and SVGs often assume a light background."],
        ]}
      />
      <Note>
        See the <DocLink href="/docs/theming">Theming</DocLink> page for retinting the accent in both
        modes.
      </Note>
    </>
  );
}
