"use client";

import { DecodeText } from "@/components/ui/decode-text";
import { FlipText, FlipTextTrigger } from "@/components/ui/flip-text";
import { GradientText } from "@/components/ui/gradient-text";
import { HighlightText } from "@/components/ui/highlight-text";
import { LetterHover } from "@/components/ui/letter-hover";
import { Quote } from "@/components/ui/quote";
import { RollingText } from "@/components/ui/rolling-text";
import { ScrambleText } from "@/components/ui/scramble-text";
import { StaggerWords } from "@/components/ui/stagger-words";
import { TextLink } from "@/components/ui/text-link";
import { TextReveal } from "@/components/ui/text-reveal";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Typewriter } from "@/components/ui/typewriter";
import { UnderlineReveal } from "@/components/ui/underline-reveal";
import type { Demo } from "../demo";

const headline = "font-display text-5xl leading-none tracking-[-0.01em] text-ink";

function GradientDemo() {
  return <p className={headline}>Quiet <GradientText>gradient</GradientText> ink</p>;
}

function ScrambleDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ScrambleText text="Hover to decode" className="text-lg" />
      <p className="text-xs text-muted">Also fires on keyboard focus.</p>
    </div>
  );
}

function LetterDemo() {
  return <LetterHover text="Letter by letter" className="font-display text-5xl font-normal" />;
}

function UnderlineDemo() {
  return (
    <p className="text-lg text-ink-soft">
      Explore the <UnderlineReveal href="#">craft layer</UnderlineReveal> and the{" "}
      <UnderlineReveal href="#">token system</UnderlineReveal>.
    </p>
  );
}

function ShimmerDemo() {
  return <TextShimmer className="text-2xl font-medium tracking-[-0.02em]">Thinking through it…</TextShimmer>;
}

function StaggerDemo() {
  return <StaggerWords text="Words arrive with quiet confidence." className="text-center" />;
}

function HighlightDemo() {
  return (
    <p className="text-center text-xl leading-relaxed text-ink-soft">
      Components that feel <HighlightText>finished</HighlightText> on day one.
    </p>
  );
}

function RollingDemo() {
  return (
    <p className={headline}>
      Build with <RollingText words={["calm", "craft", "clarity", "care", "taste"]} />
    </p>
  );
}

function DecodeDemo() {
  return <DecodeText text="npx @agents-npm-packages/vibeui add dock" className="text-xl" />;
}

function FlipDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <FlipText text="Hover this headline" className="font-display text-5xl font-normal" />
      <FlipTextTrigger text="Hover to flip" />
    </div>
  );
}

function RevealDemo() {
  return <TextReveal text="Interfaces that earn their motion." className="text-center" />;
}

function TypewriterDemo() {
  return (
    <p className="text-2xl text-ink-soft">
      Build{" "}
      <Typewriter
        className="text-accent"
        phrases={["calm interfaces", "owned components", "dark mode that works"]}
      />
    </p>
  );
}

function LinkDemo() {
  return (
    <p className="text-base text-ink-soft">
      Read the <TextLink href="#">installation guide</TextLink> or{" "}
      <TextLink href="#" external>view the source</TextLink>.
    </p>
  );
}

function QuoteDemo() {
  return (
    <Quote cite="VibeUI principles">
      Restraint first. If removing a shadow does not hurt clarity, remove it.
    </Quote>
  );
}

export const text: Record<string, Demo> = {
  "gradient-text": { Component: GradientDemo, tileScale: 0.8 },
  "scramble-text": { Component: ScrambleDemo },
  "letter-hover": { Component: LetterDemo, tileScale: 0.8 },
  "underline-reveal": { Component: UnderlineDemo, width: "md" },
  "text-shimmer": { Component: ShimmerDemo },
  "stagger-words": { Component: StaggerDemo },
  "highlight-text": { Component: HighlightDemo },
  "rolling-text": { Component: RollingDemo, tileScale: 0.8 },
  "decode-text": { Component: DecodeDemo },
  "flip-text": { Component: FlipDemo, tileScale: 0.8 },
  "text-reveal": { Component: RevealDemo },
  typewriter: { Component: TypewriterDemo },
  "text-link": { Component: LinkDemo },
  quote: { Component: QuoteDemo },
};
