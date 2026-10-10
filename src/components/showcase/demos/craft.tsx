"use client";

import * as React from "react";
import {
  ChatCircle,
  Compass,
  Gear,
  House,
  MagnifyingGlass,
  Plus,
  Image as ImageIcon,
  PencilSimple,
  Share,
  SquaresFour,
  Trash,
} from "@phosphor-icons/react";
import { ArrowFillButton } from "@/components/ui/arrow-fill-button";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { BookFlip } from "@/components/ui/book-flip";
import { CircleMenu } from "@/components/ui/circle-menu";
import { CountUp } from "@/components/ui/count-up";
import { Dock } from "@/components/ui/dock";
import { DottedGrid } from "@/components/ui/dotted-grid";
import { FlipCard } from "@/components/ui/flip-card";
import { FolderPreview } from "@/components/ui/folder-preview";
import { JellyLoader } from "@/components/ui/jelly-loader";
import { MagnetTabs } from "@/components/ui/magnet-tabs";
import { Marquee } from "@/components/ui/marquee";
import { Masonry } from "@/components/ui/masonry";
import { OrbitRing } from "@/components/ui/orbit-ring";
import { RotatingCarousel } from "@/components/ui/rotating-carousel";
import { ScrollStack } from "@/components/ui/scroll-stack";
import { SplitShowcase } from "@/components/ui/split-showcase";
import { Spotlight } from "@/components/ui/spotlight";
import { StackedCards } from "@/components/ui/stacked-cards";
import { TradingCard } from "@/components/ui/trading-card";
import { Pill } from "@/components/ui/pill";
import type { Demo } from "../demo";
import { carouselItems } from "../sample-data";


function CarouselDemo() {
  return <RotatingCarousel items={carouselItems} />;
}

function TradingCardDemo() {
  return (
    <TradingCard meta="No. 001" title="Vibe" subtitle="Tilts with the cursor and catches a soft glare.">
      <Pill tone="accent">Holo</Pill>
    </TradingCard>
  );
}

function DockDemo() {
  const icon = (Icon: typeof House) => <Icon size={20} weight="duotone" />;
  return (
    <Dock
      items={[
        { id: "home", label: "Home", icon: icon(House) },
        { id: "grid", label: "Components", icon: icon(SquaresFour) },
        { id: "find", label: "Search", icon: icon(MagnifyingGlass) },
        { id: "chat", label: "Messages", icon: icon(ChatCircle) },
        { id: "explore", label: "Explore", icon: icon(Compass) },
        { id: "gear", label: "Settings", icon: icon(Gear) },
      ]}
    />
  );
}

function CircleMenuDemo() {
  return (
    <CircleMenu
      items={[
        { id: "edit", label: "Edit", icon: <PencilSimple size={18} weight="bold" /> },
        { id: "share", label: "Share", icon: <Share size={18} weight="bold" /> },
        { id: "image", label: "Image", icon: <ImageIcon size={18} weight="bold" /> },
        { id: "trash", label: "Delete", icon: <Trash size={18} weight="bold" /> },
        { id: "add", label: "Add", icon: <Plus size={18} weight="bold" /> },
      ]}
    />
  );
}

function MagnetTabsDemo() {
  const [v, setV] = React.useState("motion");
  return (
    <div className="flex flex-col items-center gap-4">
      <MagnetTabs
        value={v}
        onChange={setV}
        tabs={[
          { value: "motion", label: "Motion" },
          { value: "layout", label: "Layout" },
          { value: "type", label: "Type" },
          { value: "color", label: "Color" },
        ]}
      />
      <p className="text-xs text-muted">Hover to glide · click to select ({v}).</p>
    </div>
  );
}

function BookDemo() {
  return (
    <BookFlip
      pages={[
        { title: "Quiet first", body: "Hairline borders and scarce color before any flourish." },
        { title: "Motion earns it", body: "Transform and opacity only. Reduced motion respected." },
        { title: "Own the code", body: "Copy the file, retint the tokens, keep every line." },
      ]}
    />
  );
}

function FolderDemo() {
  return (
    <FolderPreview
      title="components/ui"
      files={["button.tsx", "dialog.tsx", "dock.tsx", "tabs.tsx"]}
    />
  );
}

function ScrollStackDemo() {
  return (
    <ScrollStack
      height={320}
      items={[
        { title: "Primitives first", body: "Buttons, fields and surfaces that disappear into the product." },
        { title: "Overlays second", body: "Dialogs and sheets that feel like paper, not glass." },
        { title: "Signature last", body: "The memorable pieces, used sparingly." },
      ]}
    />
  );
}

function DottedGridDemo() {
  return (
    <DottedGrid className="h-52">
      <div className="flex h-36 flex-col items-center justify-center text-center">
        <p className="font-display text-3xl tracking-[-0.01em] text-ink">Move your cursor</p>
        <p className="mt-1 text-[13px] text-muted">The dots light up where you point.</p>
      </div>
    </DottedGrid>
  );
}

function CountUpDemo() {
  return (
    <div className="flex items-end gap-10">
      <div>
        <CountUp value={112} className="text-6xl" />
        <p className="mt-1 text-[13px] text-muted">components</p>
      </div>
      <div>
        <CountUp value={99.9} decimals={1} suffix="%" className="text-6xl" />
        <p className="mt-1 text-[13px] text-muted">pure CSS motion</p>
      </div>
    </div>
  );
}

function BlurRevealDemo() {
  return (
    <div className="space-y-3 text-center">
      <BlurReveal>
        <p className="font-display text-4xl tracking-[-0.01em] text-ink">Resolve into focus</p>
      </BlurReveal>
      <BlurReveal delay={200}>
        <p className="text-sm text-muted">Staggered with a delay, once, on entry.</p>
      </BlurReveal>
    </div>
  );
}

function SplitDemo() {
  return (
    <SplitShowcase
      left={
        <div className="flex h-full flex-col justify-center bg-surface px-8">
          <p className="font-mono text-[11px] text-faint">BEFORE</p>
          <p className="mt-2 font-display text-3xl text-ink">Generic SaaS</p>
          <p className="mt-1 text-sm text-muted">Purple glow, card spam.</p>
        </div>
      }
      right={
        <div className="flex h-full flex-col items-end justify-center bg-accent-soft px-8 text-right">
          <p className="font-mono text-[11px] text-accent">AFTER</p>
          <p className="mt-2 font-display text-3xl text-ink">VibeUI</p>
          <p className="mt-1 text-sm text-muted">Warm, calm, intentional.</p>
        </div>
      }
    />
  );
}

function OrbitDemo() {
  return (
    <OrbitRing
      center="Vibe"
      items={[
        { id: "react", label: "React" },
        { id: "tw", label: "Tailwind" },
        { id: "a11y", label: "A11y" },
        { id: "dark", label: "Dark" },
        { id: "motion", label: "Motion" },
      ]}
    />
  );
}

function JellyDemo() {
  return (
    <div className="flex items-center gap-8">
      <JellyLoader />
      <JellyLoader className="h-10" />
    </div>
  );
}

function ArrowFillDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <ArrowFillButton>Get started</ArrowFillButton>
      <ArrowFillButton>Browse components</ArrowFillButton>
    </div>
  );
}

function FlipCardDemo() {
  return (
    <FlipCard
      front={
        <>
          <p className="font-mono text-[11px] text-faint">FRONT</p>
          <p className="mt-2 text-[15px] font-medium text-ink">Click to flip</p>
          <p className="mt-1 text-[13px] text-muted">A real 3D turn with preserved depth.</p>
        </>
      }
      back={
        <>
          <p className="font-mono text-[11px] text-accent">BACK</p>
          <p className="mt-2 text-[15px] font-medium text-ink">Same tokens</p>
          <p className="mt-1 text-[13px] text-muted">Looks right in light and dark.</p>
        </>
      }
    />
  );
}

function StackedDemo() {
  return (
    <StackedCards
      items={[
        { title: "Primary layer", body: "Click to send me to the back." },
        { title: "Depth cue", body: "Scale and opacity sell the stack." },
        { title: "Third card", body: "Quiet background presence." },
        { title: "Fourth card", body: "Waiting its turn." },
      ]}
    />
  );
}

function SpotlightDemo() {
  return (
    <Spotlight className="h-44">
      <p className="font-mono text-[11px] text-faint">SPOTLIGHT</p>
      <p className="mt-3 font-display text-3xl tracking-[-0.01em] text-ink">The light follows you.</p>
      <p className="mt-1.5 max-w-sm text-[13px] text-muted">A soft accent radial plus a lit border. No neon.</p>
    </Spotlight>
  );
}

function MarqueeDemo() {
  const names = ["Button", "Dialog", "Dock", "Tabs", "Command", "Carousel", "Toast", "Calendar", "Slider", "Table"];
  return (
    <div className="w-full space-y-1">
      <Marquee>
        {names.map((n) => (
          <span key={n} className="whitespace-nowrap font-display text-3xl text-ink">
            {n}
          </span>
        ))}
      </Marquee>
      <Marquee reverse duration={55}>
        {names.map((n) => (
          <span key={n} className="whitespace-nowrap font-display text-3xl text-faint">
            {n}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

function MasonryDemo() {
  return (
    <Masonry
      items={[
        { id: "01", title: "Magnetic", height: "md", tone: "var(--pastel-sky)" },
        { id: "02", title: "Orbit", height: "lg", tone: "var(--pastel-sage)" },
        { id: "03", title: "Dock", height: "sm" },
        { id: "04", title: "Flip", height: "md", tone: "var(--pastel-sand)" },
        { id: "05", title: "Book", height: "sm", tone: "var(--pastel-rose)" },
        { id: "06", title: "Split", height: "lg" },
      ]}
    />
  );
}

export const craft: Record<string, Demo> = {
  "rotating-carousel": { Component: CarouselDemo, width: "lg", tileScale: 0.7 },
  "trading-card": { Component: TradingCardDemo, width: "sm", tileScale: 0.6 },
  dock: { Component: DockDemo, tileScale: 0.85 },
  "circle-menu": { Component: CircleMenuDemo, tileScale: 0.85 },
  "magnet-tabs": { Component: MagnetTabsDemo },
  "book-flip": { Component: BookDemo, tileScale: 0.85 },
  "folder-preview": { Component: FolderDemo, width: "sm" },
  "scroll-stack": { Component: ScrollStackDemo, width: "sm", tileScale: 0.65 },
  "dotted-grid": { Component: DottedGridDemo, width: "md" },
  "count-up": { Component: CountUpDemo },
  "blur-reveal": { Component: BlurRevealDemo },
  "split-showcase": { Component: SplitDemo, width: "lg", tileScale: 0.8 },
  "orbit-ring": { Component: OrbitDemo, tileScale: 0.72 },
  "jelly-loader": { Component: JellyDemo },
  "arrow-fill-button": { Component: ArrowFillDemo, width: "lg" },
  "flip-card": { Component: FlipCardDemo, width: "sm" },
  "stacked-cards": { Component: StackedDemo, width: "sm" },
  spotlight: { Component: SpotlightDemo, width: "md" },
  marquee: { Component: MarqueeDemo, width: "full" },
  masonry: { Component: MasonryDemo, width: "md", tileScale: 0.52 },
};
