import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Code, DocHeader, DocLink, DocTable, H2, H3, List, Note, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Introduction",
  description: "What VibeUI is, how the copy-owned model works, and where to start.",
};

const next = [
  { href: "/docs/installation", title: "Installation", body: "Next.js or Vite, tokens, and your first component." },
  { href: "/docs/components", title: "How components work", body: "File anatomy, client vs server, composition and variants." },
  { href: "/docs/theming", title: "Theming", body: "Retint the accent, change radii, add your own tokens." },
  { href: "/docs/recipes", title: "Recipes", body: "Settings form, command palette, confirm dialog, data table." },
];

export default function DocsIntro() {
  return (
    <>
      <DocHeader eyebrow="Getting started" title="Introduction">
        VibeUI is a library of {site.count} React and Tailwind components that you copy into your
        project. There is no runtime package: once a file is in your repo, it is yours to read,
        change and keep.
      </DocHeader>

      <H2 id="model">The copy-owned model</H2>
      <P>
        If you have used shadcn/ui, this will feel familiar, and that is deliberate. Instead of
        importing from <Code>node_modules</Code>, you add a component to{" "}
        <Code>src/components/ui</Code> and import it from there. Because the source is local, you can
        change a radius, swap an animation or delete a prop without waiting on a release, and your
        bundler only ever sees the code you actually use.
      </P>
      <CodeBlock
        language="bash"
        code={`${site.cli} add dialog button --dir ./src/components/ui`}
      />
      <P>
        That writes <Code>dialog.tsx</Code> and <Code>button.tsx</Code> and nothing else. There is no
        provider to mount (except <Code>ToastProvider</Code> if you use toasts), no config file and
        no theme object.
      </P>

      <H2 id="principles">Design principles</H2>
      <List>
        <li>
          <strong className="font-medium text-ink">Tokens, not themes.</strong> One CSS file defines
          colors, radii, shadows, easing, keyframes and the dark variant. Components only read
          tokens, so retinting is a CSS edit.
        </li>
        <li>
          <strong className="font-medium text-ink">Ink is primary, accent is meaning.</strong>{" "}
          Primary actions are ink. The accent marks focus, selection, progress and live state.
          Pastels are for status only.
        </li>
        <li>
          <strong className="font-medium text-ink">Motion is part of the component.</strong> Hover,
          press, enter and exit are built in, using only transform and opacity, and they respect{" "}
          <Code>prefers-reduced-motion</Code>.
        </li>
        <li>
          <strong className="font-medium text-ink">Native first.</strong> Checkboxes, radios,
          selects and sliders are real form controls. Custom behavior is added on top, not instead.
        </li>
        <li>
          <strong className="font-medium text-ink">Four peers.</strong> <Code>clsx</Code>,{" "}
          <Code>tailwind-merge</Code>, <Code>class-variance-authority</Code> and{" "}
          <Code>@phosphor-icons/react</Code>. No animation library, no headless-UI dependency.
        </li>
      </List>

      <H2 id="whats-in-it">What is in the box</H2>
      <DocTable
        head={["Shelf", "Contents"]}
        mono={[]}
        rows={[
          ["Actions", "Button, Pill, Chip, Toggle, Kbd, Separator"],
          ["Forms", "Input, Select, Checkbox, Radio, Switch, Slider, Search, Password, Number, OTP, Tag input, File drop, Calendar, Rating"],
          ["Feedback", "Alert, Banner, Callout, Empty, Meter, Notification, Progress, Skeleton, Spinner"],
          ["Data & surfaces", "Card, Table, List, Avatar, Stat, Code block, Color swatch, Comparison, Scroll area, Aspect ratio"],
          ["Overlays", "Dialog, Sheet, Popover, Dropdown menu, Command, Toast, Tooltip"],
          ["Navigation", "Tabs, Segmented, Accordion, Breadcrumb, Pagination, Stepper, Timeline"],
          ["Signature", "3D carousel, Dock, Trading card, Circle menu, Book flip, Folder preview, Spotlight, Marquee and more"],
          ["Text effects", "Typewriter, Scramble, Decode, Rolling text, Text reveal, Stagger words and more"],
          ["Hover effects", "Lift, Border, Shine, Tilt, Slide, Expand, Magnetic link and button"],
          ["Footers", "Simple, Mega, CTA, Newsletter, Legal, Social links"],
        ]}
      />

      <H2 id="requirements">Requirements</H2>
      <DocTable
        head={["Need", "Version", "Notes"]}
        mono={[0]}
        rows={[
          ["React", "18 or newer", "Components use hooks, useSyncExternalStore and useId."],
          ["Tailwind CSS", "v4", "The token file uses @theme and @custom-variant, which are v4 syntax."],
          ["TypeScript", "5.x (optional)", "Components are TSX. Plain JS projects can strip the types."],
          ["Path alias", "@/* → src/*", "Components import @/lib/utils."],
        ]}
      />
      <Note title="Not on npm yet">
        The CLI runs straight from GitHub (<Code>{site.cli}</Code>). Nothing is installed globally
        and nothing else changes: it reads files from this repository and writes only the ones you
        ask for (<Code>init</Code> also drops a short <Code>VIBEUI.md</Code> guide).
      </Note>

      <H2 id="how-it-compares">How it compares</H2>
      <P>
        VibeUI follows the same philosophy as <DocLink href="https://ui.shadcn.com">shadcn/ui</DocLink>{" "}
        and borrows its everyday API conventions (compound components such as{" "}
        <Code>Card</Code>/<Code>CardHeader</Code>, <Code>cva</Code> variants and a <Code>cn()</Code>{" "}
        helper). It differs in a few ways that matter day to day:
      </P>
      <DocTable
        head={["", "VibeUI", "Typical headless-based kits"]}
        mono={[0]}
        rows={[
          ["Behavior layer", "Written in each file, native inputs where possible", "A headless primitives package"],
          ["Motion", "Built in: hover, press, enter, exit", "Usually added per project"],
          ["Tokens", "One CSS file incl. keyframes and dark variant", "Variables plus a Tailwind config"],
          ["Extras", "Signature pieces, text and hover effects, footers", "Mostly primitives"],
          ["Tooling", "CLI, MCP server, registry JSON, llms.txt", "CLI"],
        ]}
      />
      <P>
        The trade-off is real: without a headless primitives package, complex widgets such as a fully
        virtualized combobox are your responsibility. See <DocLink href="/docs/accessibility">Accessibility</DocLink>{" "}
        for exactly what is and is not covered.
      </P>

      <H2 id="next">Where to next</H2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {next.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="group rounded-lg border border-line bg-surface p-5 shadow-quiet transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
          >
            <span className="flex items-center justify-between text-[15px] font-medium tracking-[-0.01em] text-ink">
              {n.title}
              <ArrowRight size={14} weight="bold" className="text-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
            </span>
            <span className="mt-1 block text-[13px] leading-snug text-muted">{n.body}</span>
          </Link>
        ))}
      </div>
      <H3>Just want to look around?</H3>
      <P>
        Browse the <DocLink href="/components">live component gallery</DocLink>, or read the source on{" "}
        <DocLink href={site.url}>GitHub</DocLink>.
      </P>
    </>
  );
}
