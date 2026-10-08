import type { Metadata } from "next";
import { Code, DocHeader, DocTable, H2, H3, List, Note, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { getAnimations } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Motion",
  description: "The animation utilities, easing, micro-interaction conventions, enter and exit patterns, and reduced motion.",
};

export default async function Motion() {
  const animations = await getAnimations();

  return (
    <>
      <DocHeader eyebrow="Customize" title="Motion">
        Every component has hover, press and focus feedback, and anything that appears also disappears
        with an animation. Motion lives in the token file, so copied components animate in your app.
      </DocHeader>

      <H2 id="principles">Principles</H2>
      <List>
        <li><strong className="font-medium text-ink">Transform and opacity only.</strong> They run on the compositor and never trigger layout.</li>
        <li><strong className="font-medium text-ink">Fast to respond, slow to settle.</strong> Hover and press react in 150–200ms; entrances take 300–600ms with an ease-out curve.</li>
        <li><strong className="font-medium text-ink">Motion explains.</strong> Things slide from where they came from, and leave toward it.</li>
        <li><strong className="font-medium text-ink">Always optional.</strong> One <Code>prefers-reduced-motion</Code> rule shortens every animation and transition.</li>
      </List>

      <H2 id="easing">Easing</H2>
      <DocTable
        head={["Token", "Curve", "Use"]}
        rows={[
          ["ease-out", "cubic-bezier(0.16, 1, 0.3, 1)", "Enters, reveals, hover. Fast start, long soft landing."],
          ["ease-spring", "cubic-bezier(0.34, 1.56, 0.64, 1)", "Playful overshoot: switch thumbs, toasts, circle menu, stepper."],
        ]}
        mono={[0, 1]}
      />

      <H2 id="utilities">Animation utilities</H2>
      <P>
        Declared with <Code>--animate-*</Code> in the token file (so Tailwind generates{" "}
        <Code>animate-*</Code> classes and includes the keyframes only when used). This table is read
        from the file.
      </P>
      <DocTable
        head={["Utility", "Definition"]}
        rows={animations.map((a) => [a.utility, a.value])}
        mono={[0, 1]}
      />

      <H2 id="micro">Micro-interaction conventions</H2>
      <P>The same small vocabulary appears everywhere, which is most of why the library feels coherent.</P>
      <DocTable
        head={["Interaction", "Treatment"]}
        mono={[]}
        rows={[
          ["Hover (surface)", "Border strengthens; cards lift 2px and gain shadow-lift."],
          ["Hover (button)", "Rises 1px; filled variants gain shadow-lift."],
          ["Press", "scale(0.97), returning on release. Icon buttons use 0.9."],
          ["Focus", "2px accent outline (global) or a 3px accent ring on fields."],
          ["Toggle on", "Track fills with the accent; thumb springs across and stretches under the finger."],
          ["Close buttons", "Rotate 90° on hover."],
          ["Appear", "Overlays pop in (scale + fade); sheets slide from their edge; lists stagger."],
          ["Disappear", "The mirror of appear, then unmount (see below)."],
          ["Status", "Live dots emit a soft ping; unread dots pulse; skeletons shimmer."],
        ]}
      />

      <H2 id="enter-exit">Enter and exit</H2>
      <P>
        CSS can animate things in as they mount, but not out as they unmount. Overlays here keep
        themselves mounted until the exit animation has finished, with no effects and no animation
        library:
      </P>
      <CodeBlock
        language="tsx"
        filename="the pattern, as used in dialog.tsx and popover.tsx"
        code={`const [present, setPresent] = React.useState(open)
if (open && !present) setPresent(true)      // mount when opening

if (!present) return null

return (
  <div
    data-state={open ? "open" : "closed"}
    onAnimationEnd={(e) => {
      // Only our own exit animation, not a child's.
      if (e.target === e.currentTarget && !open) setPresent(false)
    }}
    className="data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out"
  />
)`}
      />
      <Note title="Why not setState in an effect?">
        Adjusting state during render (the <Code>if (open &amp;&amp; !present)</Code> line) is the
        documented React pattern for deriving state from props. It avoids a render with the wrong
        value and satisfies the <Code>react-hooks/set-state-in-effect</Code> lint rule.
      </Note>

      <H2 id="pointer">Pointer-driven effects</H2>
      <P>
        Spotlight, tilt, magnetic and dock effects respond to the cursor. They write CSS variables or{" "}
        <Code>style</Code> properties directly on the element inside the event handler, instead of
        calling <Code>setState</Code>, so moving the mouse does not re-render React at 60fps.
      </P>
      <CodeBlock
        language="tsx"
        code={`onMouseMove={(e) => {
  const r = el.getBoundingClientRect()
  el.style.setProperty("--x", \`\${e.clientX - r.left}px\`)
  el.style.setProperty("--y", \`\${e.clientY - r.top}px\`)
}}
// then in CSS: radial-gradient(400px circle at var(--x) var(--y), …)`}
      />
      <H3>Independent transform properties</H3>
      <P>
        When a component both plays an entrance animation and reacts to the pointer, use the
        individual <Code>scale</Code> and <Code>translate</Code> properties for the pointer part. A
        running <Code>transform</Code> animation otherwise overrides inline <Code>transform</Code>.
      </P>

      <H2 id="reduced-motion">Reduced motion</H2>
      <P>
        The token file includes a single rule that makes every animation and transition effectively
        instant when the user asks for less motion:
      </P>
      <CodeBlock
        language="css"
        code={`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`}
      />
      <P>
        Because exits wait for <Code>animationend</Code>, which still fires at 0.01ms, overlays close
        correctly under reduced motion.
      </P>

      <H2 id="disable">Turning motion down yourself</H2>
      <List>
        <li>Remove an <Code>animate-*</Code> class from a component file to take its entrance away.</li>
        <li>Shorten every transition by editing the <Code>duration-*</Code> values; there are no hidden timings.</li>
        <li>Delete the reduced-motion block&apos;s counterpart if you want the opposite: motion is never forced on.</li>
      </List>
    </>
  );
}
