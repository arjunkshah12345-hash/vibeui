"use client";

import {
  DecodeText,
  GradientText,
  HighlightText,
  HoverBorder,
  HoverExpand,
  HoverIcon,
  HoverLift,
  HoverShine,
  HoverSlide,
  HoverTilt,
  LetterHover,
  MagneticLink,
  Pill,
  RollingText,
  ScrambleText,
  StaggerWords,
  TextShimmer,
  UnderlineReveal,
} from "@/components/ui";
import { DemoFrame, ShowcaseSection } from "@/components/showcase/section";
import { Cursor, Sparkle } from "@phosphor-icons/react";

export function EffectsSection() {
  return (
    <>
      <ShowcaseSection
        id="text-effects"
        eyebrow="11 — Text"
        title="Text effects"
        description="Scramble, shimmer, stagger, roll — expressive type without neon gradients."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <Pill tone="sky">Type</Pill>
          <Pill tone="outline">Hover / scroll</Pill>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <DemoFrame label="GradientText · TextShimmer">
            <p className="text-2xl font-medium tracking-[-0.03em]">
              <GradientText>Quiet gradient ink</GradientText>
            </p>
            <p className="mt-4 text-lg font-medium">
              <TextShimmer>Loading the next surface…</TextShimmer>
            </p>
          </DemoFrame>
          <DemoFrame label="ScrambleText · LetterHover">
            <ScrambleText text="HOVER TO DECODE" className="text-base" />
            <div className="mt-5 text-2xl">
              <LetterHover text="Letter by letter" />
            </div>
          </DemoFrame>
          <DemoFrame label="UnderlineReveal · Highlight · Rolling">
            <p className="text-[15px] text-muted">
              Explore the{" "}
              <UnderlineReveal href="#hover-effects">craft layer</UnderlineReveal>{" "}
              with <HighlightText>scarce accent</HighlightText> highlights.
            </p>
            <p className="mt-5 text-xl font-medium text-ink">
              Build with <RollingText words={["calm", "craft", "clarity", "care"]} />
            </p>
          </DemoFrame>
          <DemoFrame label="StaggerWords · DecodeText">
            <StaggerWords text="Words arrive with quiet confidence." />
            <div className="mt-6">
              <DecodeText text="decode on scroll entry" />
            </div>
          </DemoFrame>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="hover-effects"
        eyebrow="12 — Hover"
        title="Hover effects"
        description="Lift, shine, tilt, expand — presence on pointer without glow spam."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <DemoFrame label="HoverLift · HoverBorder">
            <div className="grid gap-3 sm:grid-cols-2">
              <HoverLift>
                <p className="text-sm font-medium text-ink">Lift on hover</p>
                <p className="mt-1 text-xs text-muted">Ultra-quiet shadow.</p>
              </HoverLift>
              <HoverBorder>
                <p className="text-sm font-medium text-ink">Border draw</p>
                <p className="mt-1 text-xs text-muted">Top rule scales in.</p>
              </HoverBorder>
            </div>
          </DemoFrame>
          <DemoFrame label="HoverShine · HoverTilt">
            <div className="grid gap-3 sm:grid-cols-2">
              <HoverShine>
                <p className="text-sm font-medium text-ink">Cursor shine</p>
                <p className="mt-1 text-xs text-muted">Soft radial follow.</p>
              </HoverShine>
              <HoverTilt>
                <p className="text-sm font-medium text-ink">Tilt card</p>
                <p className="mt-1 text-xs text-muted">Perspective nudge.</p>
              </HoverTilt>
            </div>
          </DemoFrame>
          <DemoFrame label="HoverSlide · MagneticLink · HoverIcon">
            <HoverSlide
              title="Slide reveal"
              description="Description rises in when you hover the tile."
            />
            <div className="mt-4 flex items-center gap-4">
              <MagneticLink href="#footers">Magnetic link</MagneticLink>
              <HoverIcon icon={<Cursor size={16} weight="bold" />} label="Cursor" />
              <HoverIcon icon={<Sparkle size={16} weight="bold" />} label="Spark" />
            </div>
          </DemoFrame>
          <DemoFrame label="HoverExpand">
            <HoverExpand
              items={[
                { id: "01", label: "Type", body: "Scramble, shimmer, stagger." },
                { id: "02", label: "Hover", body: "Lift, shine, tilt, expand." },
                { id: "03", label: "Footer", body: "Simple, mega, CTA, legal." },
              ]}
            />
          </DemoFrame>
        </div>
      </ShowcaseSection>
    </>
  );
}
