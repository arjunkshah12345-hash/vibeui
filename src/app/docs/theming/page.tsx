import type { Metadata } from "next";
import { Code, DocHeader, DocLink, DocTable, H2, H3, Note, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { getTokens } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Theming",
  description: "Every VibeUI token, how to retint the accent, change radii and shadows, and add your own.",
};

const isColor = (v: string) => /^#|^rgb|^color-mix/.test(v);

function Swatch({ value }: { value: string }) {
  if (!isColor(value)) return null;
  return (
    <span
      aria-hidden
      className="mr-2 inline-block size-3.5 rounded-[4px] align-[-2px] shadow-[inset_0_0_0_1px_var(--line-strong)]"
      style={{ background: value }}
    />
  );
}

export default async function Theming() {
  const tokens = await getTokens();
  const colors = tokens.filter((t) => isColor(t.light) && !t.name.includes("shadow"));
  const shadows = tokens.filter((t) => t.name.includes("shadow"));

  return (
    <>
      <DocHeader eyebrow="Customize" title="Theming">
        Every color, radius, shadow and curve is a CSS variable in one file. Change a token and every
        component follows, in light and dark.
      </DocHeader>

      <H2 id="how">How tokens work</H2>
      <P>
        <Code>templates/vibeui.css</Code> declares each token twice: once for light (on{" "}
        <Code>:root</Code> and <Code>.light</Code>) and once for dark (on <Code>.dark</Code>). A{" "}
        <Code>@theme inline</Code> block then registers them with Tailwind, so they become normal
        utilities: <Code>bg-surface</Code>, <Code>text-muted</Code>, <Code>border-line</Code>,{" "}
        <Code>ring-ring</Code>, <Code>shadow-lift</Code>.
      </P>
      <CodeBlock
        language="css"
        code={`:root,
.light { --surface: #ffffff; }
.dark  { --surface: #181715; }

@theme inline { --color-surface: var(--surface); }
/* → bg-surface, text-surface, border-surface, … */`}
      />
      <P>
        Because the utilities resolve to <Code>var(--surface)</Code> at runtime, you can override a
        token on <em>any</em> element and its subtree changes. That is how the landing page&apos;s
        playground retints live components, and how you can scope a dark panel inside a light page.
      </P>

      <H2 id="colors">Color tokens</H2>
      <P>These are read straight from the token file, so the table is always current.</P>
      <DocTable
        head={["Token", "Light", "Dark"]}
        mono={[0, 1, 2]}
        rows={colors.map((t) => [
          t.name,
          <span key="l" className="inline-flex items-center"><Swatch value={t.light} />{t.light}</span>,
          <span key="d" className="inline-flex items-center"><Swatch value={t.dark} />{t.dark}</span>,
        ])}
      />
      <H3>Reading the palette</H3>
      <DocTable
        head={["Role", "Tokens", "Used for"]}
        mono={[]}
        rows={[
          ["Surfaces", "canvas, surface, surface-muted, surface-sunken", "Page, cards and inputs, hovers and wells, tracks and code."],
          ["Text", "ink, ink-soft, muted, faint", "Primary, secondary, supporting, placeholder."],
          ["Lines", "line, line-strong", "Hairlines and stronger borders."],
          ["Accent", "accent, accent-ink, accent-soft, ring", "Focus, selection, progress, live state."],
          ["Status", "pastel-{rose,sky,sage,sand} and -ink", "Alerts, pills, status. Retinted for dark."],
        ]}
      />

      <H2 id="accent">Retint the accent</H2>
      <P>
        Light mode ships with a vermilion accent; dark mode&apos;s accent is the ink itself, so dark
        stays monochrome. Override both after the token import. Keep <Code>--accent-ink</Code>{" "}
        readable on top of <Code>--accent</Code>: it is the text color for accent buttons, checked
        boxes and selected days.
      </P>
      <CodeBlock
        language="css"
        filename="globals.css"
        code={`:root {
  --accent: #2563eb;
  --accent-ink: #ffffff;
  --accent-soft: rgb(37 99 235 / 0.1);
  --ring: rgb(37 99 235 / 0.28);
}

.dark {
  --accent: #7aa7ff;
  --accent-ink: #06142e;
  --accent-soft: rgb(122 167 255 / 0.14);
  --ring: rgb(122 167 255 / 0.3);
}`}
      />
      <Note title="Contrast">
        As a rule, aim for at least 4.5:1 between <Code>--accent</Code> and <Code>--accent-ink</Code>
        . The default light pair is #d9480f on white (4.6:1).
      </Note>

      <H2 id="radius">Radii</H2>
      <DocTable
        head={["Token", "Default", "Utility", "Used by"]}
        rows={[
          ["--radius-sm", "8px", "rounded-sm", "Inputs, buttons, small controls"],
          ["--radius-md", "12px", "rounded-md", "Popovers, menus, alerts, large buttons"],
          ["--radius-lg", "16px", "rounded-lg", "Cards, tables, code blocks"],
          ["--radius-xl", "22px", "rounded-xl", "Dialogs, big surfaces"],
        ]}
      />
      <P>
        Want sharper corners? Set the four values smaller (for example 4, 6, 8, 12). Want pills? Raise
        them. The interactive version of this is on the <DocLink href="/#">home page</DocLink>.
      </P>
      <CodeBlock
        language="css"
        code={`:root {
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
}`}
      />

      <H2 id="shadows">Shadows</H2>
      <P>
        Depth is a hairline plus a soft layered shadow, never a heavy drop shadow. Four tokens cover
        it.
      </P>
      <DocTable
        head={["Utility", "Use"]}
        rows={[
          ["shadow-quiet", "Resting cards, inputs and controls."],
          ["shadow-lift", "Hovered cards, menus, popovers."],
          ["shadow-pop", "Dialogs, sheets and the command palette."],
          ["shadow-inset", "A faint top highlight on filled buttons."],
        ]}
      />
      <details className="my-4 rounded-lg border border-line bg-surface p-4 text-[13px]">
        <summary className="cursor-pointer font-medium text-ink">Show the shadow values</summary>
        <div className="mt-3 space-y-3 font-mono text-[11.5px] leading-relaxed text-muted">
          {shadows.map((t) => (
            <p key={t.name}>
              <span className="text-ink">{t.name}</span>
              <br />
              light: {t.light}
              <br />
              dark: {t.dark}
            </p>
          ))}
        </div>
      </details>

      <H2 id="typography">Typography</H2>
      <DocTable
        head={["Token", "Utility", "Role"]}
        rows={[
          ["--font-sans", "font-sans", "Interface text (Geist)"],
          ["--font-mono", "font-mono", "Code and numerals (Geist Mono)"],
          ["--font-display", "font-display", "Headlines and brand moments (Instrument Serif)"],
        ]}
      />
      <P>
        Each falls back to a system stack when its variable is not set, so nothing breaks without
        fonts. To use your own typefaces, point the variables at them:
      </P>
      <CodeBlock
        language="css"
        code={`:root {
  --font-geist-sans: "Inter";
  --font-instrument: "Fraunces";
}`}
      />

      <H2 id="custom">Add your own tokens</H2>
      <P>Add the variable for both themes, then register it so Tailwind generates a utility:</P>
      <CodeBlock
        language="css"
        code={`:root  { --success-surface: #e9f3ea; }
.dark  { --success-surface: #223127; }

@theme inline {
  --color-success-surface: var(--success-surface);
}
/* now: bg-success-surface */`}
      />

      <H2 id="scoping">Scoping a theme</H2>
      <P>
        Put <Code>class=&quot;dark&quot;</Code> or <Code>class=&quot;light&quot;</Code> on any element
        and everything inside renders in that palette, regardless of the page. Useful for a dark hero
        on a light page, an embedded preview, or a theme switcher that shows both at once.
      </P>
      <CodeBlock
        language="tsx"
        code={`<section className="dark rounded-xl bg-canvas p-8 text-ink">
  <Button>Always dark</Button>
</section>`}
      />
    </>
  );
}
