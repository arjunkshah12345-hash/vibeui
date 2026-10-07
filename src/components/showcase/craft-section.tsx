"use client";

import { useState } from "react";
import {
  House,
  Magnet,
  Image as ImageIcon,
  Gear,
  PencilSimple,
  SquaresFour,
} from "@phosphor-icons/react";
import {
  ArrowFillButton,
  BlurReveal,
  BookFlip,
  CircleMenu,
  CountUp,
  Dock,
  DottedGrid,
  FlipTextTrigger,
  FolderPreview,
  HoverImage,
  JellyLoader,
  MagnetTabs,
  MagneticButton,
  Masonry,
  OrbitRing,
  Pill,
  ScrollStack,
  SplitShowcase,
  TextReveal,
  TradingCard,
  Typewriter,
} from "@/components/ui";
import { DemoFrame, ShowcaseSection } from "@/components/showcase/section";

export function CraftSection() {
  const [magnet, setMagnet] = useState("motion");

  return (
    <ShowcaseSection
      id="craft"
      eyebrow="08 — Craft"
      title="Signature craft"
      description="ObsidianUI / Magic UI energy — magnetic buttons, trading cards, docks, flip text — tuned down to VibeUI restraint. No neon, no glass spam."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Pill tone="sky">Interactive</Pill>
        <Pill tone="sage">Motion</Pill>
        <Pill tone="outline">Own the source</Pill>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DemoFrame label="MagneticButton · ArrowFill">
          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton>Pull me</MagneticButton>
            <ArrowFillButton>Get started</ArrowFillButton>
          </div>
        </DemoFrame>

        <DemoFrame label="FlipText · Typewriter">
          <div className="space-y-4">
            <FlipTextTrigger text="Hover to flip" />
            <p className="text-sm text-muted">
              Build with{" "}
              <Typewriter
                phrases={["calm tokens", "quiet motion", "owned source"]}
              />
            </p>
          </div>
        </DemoFrame>

        <DemoFrame label="TradingCard" className="flex justify-center">
          <TradingCard
            meta="Card 01"
            title="Vibe face"
            subtitle="Tilt with the cursor. Soft specular, no hologram chrome."
          >
            <Pill tone="sand">3D tilt</Pill>
          </TradingCard>
        </DemoFrame>

        <DemoFrame label="CircleMenu · Dock">
          <div className="flex flex-col items-center gap-8 py-2">
            <CircleMenu
              items={[
                { id: "1", label: "Home", icon: <House size={16} weight="bold" /> },
                { id: "2", label: "Edit", icon: <PencilSimple size={16} weight="bold" /> },
                { id: "3", label: "Media", icon: <ImageIcon size={16} weight="bold" /> },
                { id: "4", label: "Settings", icon: <Gear size={16} weight="bold" /> },
              ]}
            />
            <Dock
              items={[
                { id: "a", label: "Home", icon: <House size={18} weight="bold" /> },
                { id: "b", label: "Grid", icon: <SquaresFour size={18} weight="bold" /> },
                { id: "c", label: "Magnet", icon: <Magnet size={18} weight="bold" /> },
                { id: "d", label: "Gear", icon: <Gear size={18} weight="bold" /> },
              ]}
            />
          </div>
        </DemoFrame>

        <DemoFrame label="MagnetTabs">
          <MagnetTabs
            value={magnet}
            onChange={setMagnet}
            tabs={[
              { value: "motion", label: "Motion" },
              { value: "layout", label: "Layout" },
              { value: "type", label: "Type" },
            ]}
          />
          <p className="mt-4 text-sm text-muted">
            Sliding pill follows{" "}
            <span className="font-medium text-ink">{magnet}</span>.
          </p>
        </DemoFrame>

        <DemoFrame label="FolderPreview · JellyLoader · CountUp">
          <div className="flex flex-wrap items-end gap-6">
            <FolderPreview
              title="components/ui"
              files={[
                "magnetic-button.tsx",
                "trading-card.tsx",
                "orbit-ring.tsx",
                "book-flip.tsx",
              ]}
            />
            <div>
              <JellyLoader />
              <p className="mt-3 text-2xl">
                <CountUp value={81} suffix="+" />
              </p>
              <p className="text-xs text-muted">components</p>
            </div>
          </div>
        </DemoFrame>

        <DemoFrame label="BookFlip" className="md:col-span-2">
          <BookFlip
            pages={[
              {
                title: "Quiet first",
                body: "Hairline borders and scarce color before any flourish.",
              },
              {
                title: "Earn the motion",
                body: "Signature pieces should feel inevitable, not demoware.",
              },
              {
                title: "Own the source",
                body: "Copy the file. Retint the tokens. Ship your taste.",
              },
            ]}
          />
        </DemoFrame>

        <DemoFrame label="HoverImage · TextReveal" className="md:col-span-2">
          <p className="mb-6 text-[15px] leading-relaxed text-muted">
            Hover{" "}
            <HoverImage
              label="atelier"
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80"
            />{" "}
            or{" "}
            <HoverImage
              label="paper grain"
              src="https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80"
            />{" "}
            for a floating preview — Obsidian-style hover media, quieter finish.
          </p>
          <TextReveal text="Design less. Ship quieter interfaces." />
        </DemoFrame>

        <DemoFrame label="SplitShowcase" className="md:col-span-2">
          <SplitShowcase
            left={
              <div className="flex h-full items-center justify-center p-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                    Before
                  </p>
                  <p className="mt-2 text-lg font-medium text-ink">Generic SaaS</p>
                  <p className="mt-1 text-sm text-muted">Purple glow, card spam.</p>
                </div>
              </div>
            }
            right={
              <div className="flex h-full items-center justify-center p-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                    After
                  </p>
                  <p className="mt-2 text-lg font-medium text-ink">VibeUI</p>
                  <p className="mt-1 text-sm text-muted">Ink, bone, intentional motion.</p>
                </div>
              </div>
            }
          />
        </DemoFrame>

        <DemoFrame label="Masonry">
          <Masonry
            items={[
              { id: "01", title: "Magnetic", height: "sm", tone: "var(--pastel-sky)" },
              { id: "02", title: "Orbit", height: "lg", tone: "var(--pastel-sage)" },
              { id: "03", title: "Dock", height: "md" },
              { id: "04", title: "Flip", height: "sm", tone: "var(--pastel-sand)" },
              { id: "05", title: "Book", height: "md", tone: "var(--pastel-rose)" },
              { id: "06", title: "Split", height: "lg" },
            ]}
          />
        </DemoFrame>

        <DemoFrame label="OrbitRing · DottedGrid">
          <DottedGrid className="mb-4">
            <BlurReveal>
              <p className="text-sm font-medium text-ink">Blur reveal on scroll</p>
              <p className="mt-1 text-xs text-muted">
                Softens in as it enters the viewport.
              </p>
            </BlurReveal>
          </DottedGrid>
          <OrbitRing
            items={[
              { id: "1", label: "React" },
              { id: "2", label: "TW" },
              { id: "3", label: "Motion" },
              { id: "4", label: "A11y" },
              { id: "5", label: "Tokens" },
            ]}
          />
        </DemoFrame>

        <DemoFrame label="ScrollStack" className="md:col-span-2">
          <div className="max-h-[320px] overflow-y-auto pr-1">
            <ScrollStack
              items={[
                {
                  title: "Primitives first",
                  body: "Buttons, forms, and surfaces that disappear into the product.",
                },
                {
                  title: "Overlays second",
                  body: "Dialogs and sheets that feel like paper, not glass.",
                },
                {
                  title: "Craft last",
                  body: "Signature motion only where the page needs a memory.",
                },
              ]}
            />
          </div>
        </DemoFrame>
      </div>
    </ShowcaseSection>
  );
}
