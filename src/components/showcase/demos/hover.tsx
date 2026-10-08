"use client";

import { Cursor, Sparkle } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { HoverBorder } from "@/components/ui/hover-border";
import { HoverCard } from "@/components/ui/hover-card";
import { HoverExpand } from "@/components/ui/hover-expand";
import { HoverIcon } from "@/components/ui/hover-icon";
import { HoverImage } from "@/components/ui/hover-image";
import { HoverLift } from "@/components/ui/hover-lift";
import { HoverShine } from "@/components/ui/hover-shine";
import { HoverSlide } from "@/components/ui/hover-slide";
import { HoverTilt } from "@/components/ui/hover-tilt";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { MagneticLink } from "@/components/ui/magnetic-link";
import type { Demo } from "../demo";
import { art } from "../demo";

const body = (title: string, text: string) => (
  <>
    <p className="text-sm font-medium tracking-[-0.01em] text-ink">{title}</p>
    <p className="mt-1 text-[13px] text-muted">{text}</p>
  </>
);

function LiftDemo() {
  return (
    <HoverLift className="w-60">{body("Lift on hover", "Rises with a deeper shadow.")}</HoverLift>
  );
}
function BorderDemo() {
  return (
    <HoverBorder className="w-60">{body("Border draw", "Accent edge and a top rule.")}</HoverBorder>
  );
}
function ShineDemo() {
  return (
    <HoverShine className="w-64">{body("Cursor shine", "A soft light tracks your pointer.")}</HoverShine>
  );
}
function SlideDemo() {
  return (
    <HoverSlide
      className="w-64"
      title="Slide reveal"
      description="The description rises from beneath the title when you hover or focus."
    />
  );
}
function TiltDemo() {
  return <HoverTilt className="w-60">{body("Tilt card", "Leans toward the cursor in perspective.")}</HoverTilt>;
}
function ExpandDemo() {
  return (
    <HoverExpand
      className="w-full"
      items={[
        { id: "01", label: "Type", body: "Scramble, shimmer, stagger and roll." },
        { id: "02", label: "Hover", body: "Lift, shine, tilt and expand." },
        { id: "03", label: "Footer", body: "Simple, mega, CTA and legal." },
      ]}
    />
  );
}
function MagneticLinkDemo() {
  return (
    <div className="flex items-center gap-8">
      <MagneticLink href="#">Read the docs</MagneticLink>
      <MagneticLink href="#">View source</MagneticLink>
    </div>
  );
}
function IconDemo() {
  return (
    <div className="flex gap-3 pt-8">
      <HoverIcon icon={<Cursor size={18} weight="bold" />} label="Cursor" />
      <HoverIcon icon={<Sparkle size={18} weight="bold" />} label="Sparkle" />
    </div>
  );
}
function MagneticButtonDemo() {
  return <MagneticButton>Pull me closer</MagneticButton>;
}
function ImageDemo() {
  return (
    <p className="max-w-sm text-center text-base leading-relaxed text-ink-soft">
      Hover{" "}
      <HoverImage label="atelier" src={art("#d9480f", "#862e9c", "Atelier")} /> or{" "}
      <HoverImage label="paper grain" src={art("#1c7ed6", "#0b7285", "Paper")} /> for a floating
      preview.
    </p>
  );
}
function HoverCardDemo() {
  return (
    <HoverCard
      trigger={
        <button
          type="button"
          className="font-medium text-ink underline decoration-line-strong underline-offset-[5px] transition-colors hover:decoration-accent"
        >
          @maya
        </button>
      }
    >
      <div className="flex items-center gap-3">
        <Avatar fallback="Maya Kline" size="lg" />
        <div>
          <p className="text-sm font-medium text-ink">Maya Kline</p>
          <p className="text-[13px] text-muted">Design systems · Brooklyn</p>
        </div>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        Building calm interfaces. Previously at a few places you’ve heard of.
      </p>
    </HoverCard>
  );
}

export const hover: Record<string, Demo> = {
  "hover-lift": { Component: LiftDemo },
  "hover-border": { Component: BorderDemo },
  "hover-shine": { Component: ShineDemo },
  "hover-slide": { Component: SlideDemo },
  "hover-tilt": { Component: TiltDemo },
  "hover-expand": { Component: ExpandDemo, width: "md" },
  "magnetic-link": { Component: MagneticLinkDemo },
  "hover-icon": { Component: IconDemo },
  "magnetic-button": { Component: MagneticButtonDemo },
  "hover-image": { Component: ImageDemo },
  "hover-card": { Component: HoverCardDemo, top: true, height: 300 },
};
