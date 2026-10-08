import type { Metadata } from "next";
import { Code, DocHeader, DocLink, DocTable, H2, H3, List, Note, OL, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Upgrading to 0.2",
  description: "What changed from 0.1 to 0.2 and how to migrate: tokens, components, behavior and the CLI.",
};

export default function Upgrading() {
  return (
    <>
      <DocHeader eyebrow="Guides" title="Upgrading to 0.2">
        0.2 is a visual and behavioral overhaul. Because components are copied into your repo, you
        upgrade by re-adding the ones you use. This page lists what to expect.
      </DocHeader>

      <H2 id="steps">Upgrade steps</H2>
      <OL>
        <li>Replace your token file with the new <Code>templates/vibeui.css</Code> (or re-run <Code>init</Code> into a temp folder and diff). Re-apply your own overrides afterwards.</li>
        <li>Make sure it is imported <em>after</em> <Code>@import &quot;tailwindcss&quot;</Code>. The new file also carries keyframes and the dark variant.</li>
        <li>Re-add each component you use: <Code>add button dialog …</Code>. Review the diff against your edits before overwriting.</li>
        <li>Search your code for the changed APIs below.</li>
      </OL>
      <Note title="You customised a component?">
        Re-adding overwrites the file. Commit first, add, then use your Git diff to port your edits.
        Components are small and self-contained, so this is usually quick.
      </Note>

      <H2 id="tokens">Tokens</H2>
      <DocTable
        head={["Change", "Detail"]}
        mono={[]}
        rows={[
          ["New accent system", "--accent, --accent-ink, --accent-soft and --ring replace the old focus color."],
          ["Dark accent is monochrome", "In dark mode the accent is the ink itself (#f4f2ee), not a color."],
          ["--focus removed", "Focus uses the accent outline (global) and --ring."],
          ["New surface", "--surface-sunken for tracks, code and wells."],
          ["New shadows", "--shadow-pop and --shadow-inset, alongside quiet and lift (both reworked as layered shadows)."],
          ["Radii changed", "sm/md/lg are now 8/12/16px (were 6/10/14) and a new xl is 22px. They are registered with @theme, so use rounded-sm|md|lg|xl instead of rounded-[var(--radius-md)]."],
          ["Easing tokens", "ease-out and ease-spring are theme values (use ease-out / ease-spring classes)."],
          ["Keyframes ship in the file", "animate-* utilities are declared with --animate-*; copied components no longer need globals from this repo."],
          ["dark variant", "@custom-variant dark makes dark: follow the .dark class. Add .light / .dark on any element to scope a palette."],
        ]}
      />

      <H2 id="components">Component changes</H2>
      <H3>Behavior</H3>
      <DocTable
        head={["Component", "Change"]}
        rows={[
          ["Checkbox, RadioGroup", "Now native <input> elements: they submit with forms, and clicking the label works. New description prop."],
          ["Dialog", "Portaled to <body>, traps focus, restores it on close, animates out. Add DialogFooter for actions. It no longer imports Button."],
          ["Sheet", "Slides in from its edge and out again; adds description and side=\"bottom\". Portaled."],
          ["Popover, DropdownMenu, HoverCard", "Animate out before unmounting. Popover gains side; DropdownMenu gains icon, shortcut and align."],
          ["Toast", "Per-toast timer with hover-to-pause, a countdown bar, dismiss button and exit animation. toast() accepts tone."],
          ["Calendar", "Today is highlighted after hydration only. New defaultMonth prop; no longer needs an effect to sync value."],
          ["Command", "Keyboard navigation (↑ ↓ Enter), item icon, autoFocus prop."],
          ["FlipText", "Self-contained: hover the text itself. Previously needed a group/flip parent."],
          ["RollingText", "Any number of words; width fits the longest. New intervalMs."],
          ["Spinner", "SVG using currentColor, not a bordered span."],
          ["BookFlip", "A real page turn instead of a hover tilt."],
          ["SplitShowcase", "Uses clip-path, so left-hand content no longer reflows while dragging. Pointer events replace mouse events."],
          ["ScrollStack", "Pure CSS sticky stacking. Optional height makes it its own scroller."],
        ]}
      />
      <H3>New props and variants</H3>
      <DocTable
        head={["Component", "Added"]}
        rows={[
          ["Button", "variant accent and danger, size icon-sm, loading"],
          ["Pill", "tone accent, pulse"],
          ["Avatar", "sizes xs and xl; AvatarGroup max; initials from two words"],
          ["Field", "error"],
          ["Tabs", "variant line"],
          ["Accordion", "type single | multiple, defaultOpen"],
          ["Stepper", "orientation horizontal"],
          ["Meter", "tone, segments (now a segmented gauge)"],
          ["Marquee", "reverse, duration"],
          ["OrbitRing", "center, radius"],
          ["CountUp", "decimals"],
          ["BlurReveal", "delay"],
          ["List item", "leading"],
          ["Separator", "animated"],
          ["SocialLinks", "youtube, instagram"],
        ]}
      />

      <H2 id="visual">Visual changes to expect</H2>
      <P>
        Controls are slightly larger and rounder, shadows are layered, and primary buttons have a faint
        top highlight. Switch, checkbox, slider and progress use the accent. Everything gained
        hover, press and enter/exit motion: see <DocLink href="/docs/motion">Motion</DocLink>.
      </P>

      <H2 id="cli">CLI and registry</H2>
      <List>
        <li><Code>add</Code> now copies sibling components a file imports (for example <Code>footer-cta</Code> brings <Code>button</Code>).</li>
        <li>Registry entries gain <Code>registryDependencies</Code> and a generated <Code>api</Code> table; the MCP <Code>get_component</Code> tool returns both.</li>
        <li>The package version is now read from <Code>package.json</Code>.</li>
      </List>
      <P>
        If your own scripts read <Code>registry/components.json</Code>, note the new{" "}
        <Code>registryDependencies</Code> and <Code>api</Code> fields on each component. See{" "}
        <DocLink href="/docs/registry">Registry</DocLink>.
      </P>

      <H2 id="site">The showcase site</H2>
      <P>
        <Code>/gallery</Code> is now <Code>/components</Code> (it redirects), and each component has
        its own page at <Code>/components/&lt;name&gt;</Code>. Demos live in{" "}
        <Code>src/components/showcase/demos/</Code>.
      </P>
      <CodeBlock
        language="bash"
        code={`# find usages of the old radius syntax in your own code
grep -rn "rounded-\\[var(--radius" src`}
      />
    </>
  );
}

