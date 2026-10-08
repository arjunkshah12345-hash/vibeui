import type { Metadata } from "next";
import { Code, DocHeader, DocLink, DocTable, H2, H3, Note, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { getComponents } from "@/lib/registry";

export const metadata: Metadata = {
  title: "How components work",
  description: "File anatomy, client and server components, composition, variants, controlled state and refs.",
};

export default function HowComponentsWork() {
  const all = getComponents();
  const client = all.filter((c) => c.client);
  const server = all.filter((c) => !c.client);

  return (
    <>
      <DocHeader eyebrow="Getting started" title="How components work">
        Every component follows the same handful of conventions. Learn them once and you can read, edit
        or write any file in the library.
      </DocHeader>

      <H2 id="anatomy">Anatomy of a file</H2>
      <P>
        A component is one file in <Code>src/components/ui/</Code>. It starts with an optional{" "}
        <Code>&quot;use client&quot;</Code> directive, imports its peers, and begins with a one-line
        doc comment. That comment becomes its description in the registry, the CLI and this site.
      </P>
      <CodeBlock
        language="tsx"
        filename="src/components/ui/pill.tsx (abridged)"
        code={`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** Small status label with semantic pastel tones and an optional live dot. */
const pillVariants = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px]", {
  variants: {
    tone: {
      neutral: "bg-surface-muted text-ink-soft",
      sage: "bg-pastel-sage text-pastel-sage-ink",
    },
  },
  defaultVariants: { tone: "neutral" },
})

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  dot?: boolean
}

export function Pill({ className, tone, dot, children, ...props }: PillProps) {
  return (
    <span className={cn(pillVariants({ tone }), className)} {...props}>
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
}`}
      />
      <DocTable
        head={["Convention", "What it means"]}
        mono={[]}
        rows={[
          ["Named exports", "Every component is a named export. There are no default exports."],
          ["className last", "className is always merged with cn(), so your classes win over the defaults."],
          ["Props spread", "Remaining props are spread onto the root element, so aria-*, data-* and event handlers just work."],
          ["Tokens only", "Colors, radii, shadows and easing come from CSS variables. No hex values in components."],
          ["One file", "A component never imports from a shared internal folder. Sibling imports (e.g. dialog → none, footer-cta → button) are listed in the registry."],
        ]}
      />

      <H2 id="client-server">Client and server components</H2>
      <P>
        Components that need state, effects or browser APIs start with{" "}
        <Code>&quot;use client&quot;</Code>. The rest have no directive and render on the server, so a
        plain Server Component can use them without an extra client boundary.
      </P>
      <Note title="Rule of thumb">
        If a prop is a function you want to pass from a Server Component (an{" "}
        <Code>onClick</Code>, an <Code>onChange</Code>), it must cross into a client file. Content
        props such as <Code>children</Code>, <Code>title</Code> or <Code>items</Code> are fine.
      </Note>
      <H3>Server-safe ({server.length})</H3>
      <P className="font-mono text-[12.5px] leading-[1.9] text-muted">
        {server.map((c) => c.name).join(" · ")}
      </P>
      <H3>Client ({client.length})</H3>
      <P className="font-mono text-[12.5px] leading-[1.9] text-muted">
        {client.map((c) => c.name).join(" · ")}
      </P>
      <P>
        These lists are generated from the registry, so they are always current.
      </P>

      <H2 id="composition">Composition</H2>
      <P>
        Anything with more than one visual part is a set of small components you compose, in the same
        spirit as HTML itself.
      </P>
      <CodeBlock
        language="tsx"
        code={`<Card interactive>
  <CardHeader>
    <CardTitle>Interactive card</CardTitle>
    <CardDescription>Lifts gently on hover.</CardDescription>
  </CardHeader>
  <CardFooter>
    <Button size="sm" variant="ghost">Open</Button>
  </CardFooter>
</Card>`}
      />
      <P>
        Compound sets: <Code>Card*</Code>, <Code>Tabs</Code>/<Code>TabsList</Code>/
        <Code>TabsTrigger</Code>/<Code>TabsContent</Code>, <Code>Dialog</Code>/
        <Code>DialogTrigger</Code>/<Code>DialogContent</Code>/<Code>DialogFooter</Code>,{" "}
        <Code>RadioGroup</Code>/<Code>RadioItem</Code>, <Code>Table</Code>/<Code>THead</Code>/
        <Code>TBody</Code>/<Code>TR</Code>/<Code>TH</Code>/<Code>TD</Code>, <Code>List</Code>/
        <Code>ListItem</Code>, <Code>Avatar</Code>/<Code>AvatarGroup</Code>.
      </P>

      <H2 id="variants">Variants</H2>
      <P>
        Visual options are declared with <DocLink href="https://cva.style">class-variance-authority</DocLink>.
        Each variant is a plain string of Tailwind classes, so adding one is a one-line edit.
      </P>
      <CodeBlock
        language="tsx"
        filename="src/components/ui/button.tsx"
        code={`variants: {
  variant: {
    primary: "bg-ink text-surface ...",
    accent: "bg-accent text-accent-ink ...",
+   brand: "bg-pastel-sky text-pastel-sky-ink hover:brightness-95",
  },
}`}
      />
      <P>
        Components that export their variants (like <Code>buttonVariants</Code>) can style other
        elements, which is how you make a link look like a button without nesting a button in an
        anchor:
      </P>
      <CodeBlock
        language="tsx"
        code={`import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

<Link href="/pricing" className={buttonVariants({ variant: "secondary", size: "lg" })}>
  See pricing
</Link>`}
      />

      <H2 id="state">Controlled and uncontrolled</H2>
      <P>
        Stateful components accept both forms, like native inputs. Pass <Code>value</Code> and a
        change handler to control them, or <Code>defaultValue</Code> to let them manage themselves.
      </P>
      <CodeBlock
        language="tsx"
        code={`// uncontrolled
<Switch defaultChecked />

// controlled
const [on, setOn] = React.useState(true)
<Switch checked={on} onCheckedChange={setOn} aria-label="Notifications" />`}
      />
      <DocTable
        head={["Component", "Controlled props"]}
        rows={[
          ["Switch, Checkbox", "checked / onCheckedChange"],
          ["Toggle", "pressed / onPressedChange"],
          ["Slider, Select, RadioGroup, Tabs", "value / onValueChange"],
          ["Dialog, Sheet", "open / onOpenChange"],
          ["NumberField, OtpField, SearchField", "value / onChange"],
          ["Segmented, MagnetTabs", "value / onChange (required)"],
          ["Pagination", "page / onPageChange (required)"],
        ]}
      />

      <H2 id="refs">Refs and polymorphism</H2>
      <P>
        <Code>Button</Code>, <Code>Input</Code> and <Code>Textarea</Code> forward refs, because those
        are the elements you focus programmatically. Other components expose their root through the
        spread props. There is no <Code>asChild</Code>: use the exported variants (above) when you need
        a different element.
      </P>

      <H2 id="icons">Icons</H2>
      <P>
        Icons are <DocLink href="https://phosphoricons.com">Phosphor</DocLink>. Use the{" "}
        <Code>bold</Code> weight for controls and <Code>fill</Code> for status glyphs. In files
        without <Code>&quot;use client&quot;</Code>, import from the SSR entry:
      </P>
      <CodeBlock
        language="tsx"
        code={`import { ArrowRight } from "@phosphor-icons/react/dist/ssr"`}
      />
    </>
  );
}
