"use client";

import * as React from "react";
import {
  Copy,
  Image as ImageIcon,
  Link as LinkIcon,
  PencilSimple,
  ShareNetwork,
  Star,
  Trash,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ContextMenu, type ContextItem } from "@/components/ui/context-menu";
import { CurveText } from "@/components/ui/curve-text";
import { FooterGiant } from "@/components/ui/footer-giant";
import { FooterStatus } from "@/components/ui/footer-status";
import { GlitchText } from "@/components/ui/glitch-text";
import { GlowCard, HoverGlowGrid } from "@/components/ui/hover-glow-grid";
import { HoverImageList } from "@/components/ui/hover-image-list";
import { Lightbox } from "@/components/ui/lightbox";
import { NeonText } from "@/components/ui/neon-text";
import { Segmented } from "@/components/ui/segmented";
import { Tour } from "@/components/ui/tour";
import { WeightText } from "@/components/ui/weight-text";
import { cn } from "@/lib/utils";
import { TILE_W, art, type Demo } from "../demo";

const hint = "font-mono text-[10px] uppercase tracking-[0.18em] text-muted";

/* ─────────────────────────── overlays ─────────────────────────── */

const MENU: ContextItem[] = [
  { label: "Copy link", icon: <LinkIcon />, shortcut: "⌘L" },
  { label: "Duplicate", icon: <Copy />, shortcut: "⌘D" },
  { label: "Rename", icon: <PencilSimple />, shortcut: "F2" },
  {
    label: "Share",
    icon: <ShareNetwork />,
    children: [
      { label: "Email" },
      { label: "Slack" },
      { label: "Copy embed code", shortcut: "⌘E" },
    ],
  },
  { type: "separator" },
  { label: "Add to favourites", icon: <Star /> },
  { label: "Export as image", icon: <ImageIcon />, disabled: true },
  { type: "separator" },
  { label: "Delete", icon: <Trash />, danger: true, shortcut: "⌫" },
];

function ContextDemo() {
  return (
    <ContextMenu
      items={MENU}
      className="grid h-72 w-full place-items-center rounded-2xl border border-dashed border-line-strong bg-surface-muted"
    >
      <div className="text-center">
        <p className="font-display text-4xl tracking-tight text-ink">Right-click here</p>
        <p className={cn(hint, "mt-3")}>Or long-press on touch · Shift + F10 from the keyboard</p>
      </div>
    </ContextMenu>
  );
}

function ContextTile() {
  return (
    <ContextMenu
      items={MENU.slice(0, 5)}
      className={cn(
        TILE_W,
        "grid h-40 place-items-center rounded-xl border border-dashed border-line-strong bg-surface-muted",
      )}
    >
      <p className="font-display text-2xl text-ink">Right-click me</p>
    </ContextMenu>
  );
}

const PHOTOS = [
  {
    src: art("#ff9a8b", "#6a3093", "Dusk"),
    alt: "Dusk over the hills",
    caption: "Dusk over the hills",
  },
  { src: art("#43cea2", "#185a9d", "Lagoon"), alt: "A green lagoon", caption: "A green lagoon" },
  { src: art("#f7971e", "#ffd200", "Dune"), alt: "Sunlit dunes", caption: "Sunlit dunes" },
  { src: art("#614385", "#516395", "Nebula"), alt: "A violet nebula", caption: "A violet nebula" },
  { src: art("#11998e", "#38ef7d", "Moss"), alt: "Fresh moss", caption: "Fresh moss" },
  { src: art("#fc5c7d", "#6a82fb", "Neon"), alt: "Neon haze", caption: "Neon haze" },
];

function LightboxDemo() {
  return (
    <div className="w-full space-y-3">
      <Lightbox images={PHOTOS} columns={3} />
      <p className={cn(hint, "text-center")}>Open one · arrows, swipe or Escape</p>
    </div>
  );
}

function LightboxTile() {
  return (
    <div className={TILE_W}>
      <Lightbox images={PHOTOS.slice(0, 4)} columns={2} gap={8} />
    </div>
  );
}

function TourDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-full">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <p id="tour-title" className="font-display text-2xl tracking-tight text-ink">
            Q3 report
          </p>
          <div className="flex gap-2">
            <Button id="tour-share" size="sm" variant="secondary">
              Share
            </Button>
            <Button id="tour-export" size="sm">
              Export
            </Button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {["Revenue", "Users", "Churn"].map((t, i) => (
            <div
              key={t}
              id={i === 0 ? "tour-card" : undefined}
              className="rounded-xl border border-line bg-surface-muted p-4"
            >
              <p className="text-xs text-muted">{t}</p>
              <p className="mt-1 font-display text-3xl tabular-nums text-ink">
                {["$31k", "2,481", "4.2%"][i]}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-col items-center gap-3">
        <Button onClick={() => setOpen(true)}>Take the tour</Button>
        <p className={hint}>The spotlight glides from step to step</p>
      </div>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          {
            target: "#tour-title",
            title: "Your report",
            body: "Everything in this view is saved automatically as you work.",
            placement: "bottom",
          },
          {
            target: "#tour-card",
            title: "Key numbers",
            body: "The big three sit at the top, and each updates live from your data.",
          },
          {
            target: "#tour-share",
            title: "Share it",
            body: "Send a read-only link, or invite people to edit with you.",
          },
          {
            target: "#tour-export",
            title: "Take it with you",
            body: "Export to PDF, CSV or a slide deck in one click.",
            placement: "bottom",
          },
        ]}
      />
    </div>
  );
}

function TourTile() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={cn(TILE_W, "flex flex-col items-center gap-3 py-5")}>
      <div className="w-full rounded-xl border border-line bg-surface p-3">
        <p id="tour-tile-title" className="font-display text-xl text-ink">
          Q3 report
        </p>
        <div className="mt-2 h-8 rounded-lg bg-surface-muted" />
      </div>
      <Button size="sm" onClick={() => setOpen(true)}>
        Take the tour
      </Button>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          {
            target: "#tour-tile-title",
            title: "Your report",
            body: "Saved automatically as you work.",
          },
        ]}
      />
    </div>
  );
}

/* ─────────────────────────── footers ─────────────────────────── */

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Components", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

function GiantDemo() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-line bg-surface">
      <FooterGiant
        brand="Northwind"
        tagline="Software for people who notice the details."
        columns={COLS}
        legal={
          <>
            <span>© 2026 Northwind Inc.</span>
            <span>Made with care, everywhere.</span>
          </>
        }
      />
    </div>
  );
}

function StatusFooterDemo() {
  const [status, setStatus] = React.useState<"ok" | "degraded" | "down">("ok");
  return (
    <div className="w-full space-y-4">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <FooterStatus
          brand={<span className="font-display text-xl">Northwind</span>}
          links={[
            { label: "Docs", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "Status", href: "#" },
            { label: "Contact", href: "#" },
          ]}
          status={status}
          note="© 2026 Northwind"
          actions={
            <Segmented
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              value="light"
              onChange={() => {}}
            />
          }
        />
      </div>
      <div className="flex justify-center">
        <Segmented
          options={[
            { value: "ok", label: "Normal" },
            { value: "degraded", label: "Degraded" },
            { value: "down", label: "Down" },
          ]}
          value={status}
          onChange={setStatus}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────── text ─────────────────────────── */

const NEON = { pink: "#ff3d9a", cyan: "#19e6ff", amber: "#ffb020", green: "#5dff8a" } as const;

function NeonDemo() {
  const [c, setC] = React.useState<keyof typeof NEON>("pink");
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="grid w-full place-items-center rounded-3xl bg-[#0a0910] px-6 py-16 shadow-lift">
        <NeonText color={NEON[c]} className="text-6xl sm:text-7xl">
          open late
        </NeonText>
      </div>
      <Segmented
        options={(Object.keys(NEON) as (keyof typeof NEON)[]).map((k) => ({
          value: k,
          label: k[0].toUpperCase() + k.slice(1),
        }))}
        value={c}
        onChange={setC}
      />
    </div>
  );
}

function NeonTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center rounded-xl bg-[#0a0910] py-10")}>
      <NeonText color="#ff3d9a" className="text-4xl">
        open late
      </NeonText>
    </div>
  );
}

function WeightDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <WeightText className="text-5xl text-ink sm:text-7xl" radius={170}>
        Variable
      </WeightText>
      <WeightText className="text-5xl text-ink sm:text-7xl" radius={170}>
        type moves
      </WeightText>
      <p className={cn(hint, "mt-4")}>Move the pointer across the letters</p>
    </div>
  );
}

function WeightTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center py-8")}>
      <WeightText className="text-5xl text-ink" radius={90}>
        Weight
      </WeightText>
    </div>
  );
}

function GlitchDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <GlitchText
        className="font-display text-7xl tracking-tight text-ink sm:text-8xl"
        intensity={9}
      >
        Signal lost
      </GlitchText>
      <p className={hint}>It fires by itself · hover for more</p>
    </div>
  );
}

function GlitchTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center py-10")}>
      <GlitchText className="font-display text-5xl tracking-tight text-ink">Signal lost</GlitchText>
    </div>
  );
}

function CurveDemo() {
  const [shape, setShape] = React.useState<"arc" | "wave" | "circle">("arc");
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <CurveText
        shape={shape}
        height={shape === "circle" ? 340 : 260}
        fontSize={shape === "circle" ? 34 : 50}
        className="text-ink"
      >
        Words on a curve
      </CurveText>
      <Segmented
        options={[
          { value: "arc", label: "Arc" },
          { value: "wave", label: "Wave" },
          { value: "circle", label: "Ring" },
        ]}
        value={shape}
        onChange={setShape}
      />
      <p className={hint}>Move up and down across it</p>
    </div>
  );
}

function CurveTile() {
  return (
    <div className={cn(TILE_W, "text-ink")}>
      <CurveText shape="arc" height={150} fontSize={30} speed={50}>
        Words on a curve
      </CurveText>
    </div>
  );
}

/* ─────────────────────────── hover ─────────────────────────── */

const WORK = [
  { title: "Aurora", meta: "Brand · 2026", image: art("#a18cd1", "#fbc2eb", "Aurora"), href: "#" },
  {
    title: "Meridian",
    meta: "Web app · 2025",
    image: art("#fa709a", "#fee140", "Meridian"),
    href: "#",
  },
  {
    title: "Kintsugi",
    meta: "Identity · 2025",
    image: art("#30cfd0", "#330867", "Kintsugi"),
    href: "#",
  },
  {
    title: "Halcyon",
    meta: "Editorial · 2024",
    image: art("#f093fb", "#f5576c", "Halcyon"),
    href: "#",
  },
  {
    title: "Tessera",
    meta: "Product · 2024",
    image: art("#4facfe", "#00f2fe", "Tessera"),
    href: "#",
  },
];

function ImageListDemo() {
  return (
    <div className="w-full">
      <HoverImageList items={WORK} />
      <p className={cn(hint, "mt-4 text-center")}>Hover a row</p>
    </div>
  );
}

function ImageListTile() {
  return (
    <div className={cn(TILE_W, "[&_span.flex-1]:text-2xl")}>
      <HoverImageList items={WORK.slice(0, 4)} />
    </div>
  );
}

const FEATURES = [
  ["Tokens, not themes", "One CSS file re-tints every component."],
  ["You own the code", "Copy a file into your repo and it is yours."],
  ["Real dark mode", "Designed in both, never inverted."],
  ["Motion with purpose", "Springs and easing that earn their place."],
  ["Agent friendly", "An MCP server and a CLI that read the source."],
  ["Accessible by default", "Keyboard, focus rings, reduced motion."],
];

function GlowDemo() {
  return (
    <div className="w-full space-y-3">
      <HoverGlowGrid columns={3}>
        {FEATURES.map(([t, d]) => (
          <GlowCard key={t}>
            <p className="font-display text-2xl leading-tight tracking-tight text-ink">{t}</p>
            <p className="mt-2 text-sm text-muted">{d}</p>
          </GlowCard>
        ))}
      </HoverGlowGrid>
      <p className={cn(hint, "text-center")}>Move across the cards</p>
    </div>
  );
}

function GlowTile() {
  return (
    <div className={TILE_W}>
      <HoverGlowGrid columns={2} gap={8} size={200} className="!grid-cols-2">
        {FEATURES.slice(0, 4).map(([t]) => (
          <GlowCard key={t} className="p-3">
            <p className="font-display text-lg leading-tight text-ink">{t}</p>
          </GlowCard>
        ))}
      </HoverGlowGrid>
    </div>
  );
}

export const sectionsB: Record<string, Demo> = {
  "context-menu": { Component: ContextDemo, width: "md", Tile: ContextTile },
  lightbox: { Component: LightboxDemo, width: "lg", Tile: LightboxTile },
  tour: { Component: TourDemo, width: "md", Tile: TourTile },
  "footer-giant": { Component: GiantDemo, width: "full", top: true, tileScale: 0.34 },
  "footer-status": { Component: StatusFooterDemo, width: "lg", tileScale: 0.45 },
  "neon-text": { Component: NeonDemo, width: "md", Tile: NeonTile },
  "weight-text": { Component: WeightDemo, width: "lg", Tile: WeightTile },
  "glitch-text": { Component: GlitchDemo, width: "lg", Tile: GlitchTile },
  "curve-text": { Component: CurveDemo, width: "md", Tile: CurveTile },
  "hover-image-list": { Component: ImageListDemo, width: "lg", Tile: ImageListTile },
  "hover-glow-grid": { Component: GlowDemo, width: "lg", Tile: GlowTile },
};
