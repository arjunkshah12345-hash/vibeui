"use client";

import * as React from "react";
import {
  ArrowFatUp,
  ArrowLeft,
  ArrowRight,
  Check,
  Command,
  Confetti as ConfettiIcon,
  Ticket,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Confetti, type ConfettiHandle } from "@/components/ui/confetti";
import { Keycap } from "@/components/ui/keycap";
import { PanZoom } from "@/components/ui/pan-zoom";
import { PeelCard } from "@/components/ui/peel-card";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Segmented } from "@/components/ui/segmented";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";
import { VelocityMarquee } from "@/components/ui/velocity-marquee";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

const hint = "font-mono text-[10px] uppercase tracking-[0.18em] text-muted";

/* ─────────────────────────── velocity marquee ─────────────────────────── */

const WORDS = ["Motion", "Craft", "Tokens", "Detail", "Taste", "Rhythm"];

function Words({ outline }: { outline?: boolean }) {
  return (
    <>
      {WORDS.map((w) => (
        <span key={w} className="flex items-center gap-10">
          <span
            className={cn(
              "font-display text-6xl leading-none tracking-tight",
              outline ? "text-transparent [-webkit-text-stroke:1.5px_var(--ink)]" : "text-ink",
            )}
          >
            {w}
          </span>
          <span aria-hidden className="size-2.5 rotate-45 bg-ink/70" />
        </span>
      ))}
    </>
  );
}

function MarqueeDemo() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 py-6">
        <VelocityMarquee speed={60} skew={14} gap={40}>
          <Words />
        </VelocityMarquee>
        <VelocityMarquee speed={60} direction={-1} skew={14} gap={40}>
          <Words outline />
        </VelocityMarquee>
      </div>
      <p className={cn(hint, "text-center")}>Scroll the page · drag and fling</p>
    </div>
  );
}

function MarqueeTile() {
  return (
    <div className={cn(TILE_W, "py-4")}>
      <VelocityMarquee speed={50} gap={24}>
        {WORDS.map((w) => (
          <span key={w} className="flex items-center gap-6 font-display text-3xl text-ink">
            {w}
            <span aria-hidden className="size-1.5 rotate-45 bg-ink/70" />
          </span>
        ))}
      </VelocityMarquee>
    </div>
  );
}

/* ─────────────────────────── slide to confirm ─────────────────────────── */

function SlideDemo() {
  const [paid, setPaid] = React.useState(0);
  return (
    <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 shadow-quiet">
      <p className={hint}>Order total</p>
      <p className="mt-1 font-display text-5xl leading-none tracking-tight text-ink">$48.20</p>
      <p className="mt-2 text-sm text-muted">Two items · delivery by Friday</p>
      <SlideToConfirm
        className="mt-6 max-w-none"
        confirmedLabel="Paid"
        onConfirm={() => setPaid((n) => n + 1)}
      >
        Slide to pay
      </SlideToConfirm>
      <p className="mt-3 text-center text-xs text-muted">
        {paid > 0
          ? `Paid ${paid} time${paid > 1 ? "s" : ""}. It resets so you can try again.`
          : "Drag all the way across. Or focus it and press the arrow keys."}
      </p>
    </div>
  );
}

function SlideTile() {
  return (
    <div className={TILE_W}>
      <SlideToConfirm>Slide to pay</SlideToConfirm>
    </div>
  );
}

/* ─────────────────────────── confetti ─────────────────────────── */

function ConfettiDemo() {
  const ref = React.useRef<ConfettiHandle>(null);
  const [style, setStyle] = React.useState<"burst" | "cannons" | "rain">("burst");
  const celebrate = () => {
    const h = ref.current;
    if (!h) return;
    if (style === "cannons") {
      const y = window.innerHeight * 0.85;
      h.fire({ x: 0, y, angle: 315, spread: 55, count: 70, power: 1500 });
      h.fire({ x: window.innerWidth, y, angle: 225, spread: 55, count: 70, power: 1500 });
    } else if (style === "rain") {
      for (let i = 0; i < 6; i++)
        setTimeout(
          () =>
            h.fire({
              x: window.innerWidth * (0.1 + Math.random() * 0.8),
              y: -20,
              angle: 90,
              spread: 60,
              count: 28,
              power: 160,
            }),
          i * 120,
        );
    } else h.fire({ count: 120, spread: 90 });
  };
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Confetti ref={ref} onClickFire={false}>
        <Button size="lg" onClick={celebrate}>
          <ConfettiIcon size={20} weight="fill" /> Celebrate
        </Button>
      </Confetti>
      <Segmented
        options={[
          { value: "burst", label: "Burst" },
          { value: "cannons", label: "Cannons" },
          { value: "rain", label: "Rain" },
        ]}
        value={style}
        onChange={setStyle}
      />
      <p className={hint}>Pieces tumble, flip and fade</p>
    </div>
  );
}

function ConfettiTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center py-6")}>
      <Confetti options={{ count: 80, spread: 80 }}>
        <Button>
          <ConfettiIcon size={16} weight="fill" /> Pop it
        </Button>
      </Confetti>
    </div>
  );
}

/* ─────────────────────────── pan zoom ─────────────────────────── */

const BOARD = [
  { x: -250, y: -110, w: 180, t: "Brief", c: "bg-surface" },
  { x: -20, y: -150, w: 180, t: "Research", c: "bg-surface" },
  { x: 200, y: -60, w: 190, t: "Concept A", c: "bg-ink text-surface" },
  { x: -120, y: 60, w: 180, t: "Concept B", c: "bg-surface" },
  { x: 120, y: 120, w: 170, t: "Ship", c: "bg-surface" },
];

function Board() {
  return (
    <div className="relative h-[340px] w-[640px]">
      <svg className="absolute inset-0 size-full overflow-visible text-ink/30" aria-hidden>
        <path
          d="M 160 90 C 230 90 230 60 300 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <path
          d="M 400 60 C 450 60 450 130 500 160"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <path
          d="M 160 90 C 160 170 200 240 250 230"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
      </svg>
      {BOARD.map((b) => (
        <div
          key={b.t}
          className={cn("absolute rounded-xl border border-line p-3.5 shadow-quiet", b.c)}
          style={{ left: 320 + b.x - 130, top: 170 + b.y - 20, width: b.w }}
        >
          <p className="font-display text-xl leading-none">{b.t}</p>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-current opacity-15" />
            <div className="h-1.5 w-2/3 rounded-full bg-current opacity-15" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PanDemo() {
  return (
    <div className="w-full">
      <PanZoom className="h-[380px]">
        <Board />
      </PanZoom>
      <p className={cn(hint, "mt-3 text-center")}>Drag · pinch or scroll to zoom · double-click</p>
    </div>
  );
}

function PanTile() {
  return (
    <div className={TILE_W}>
      <PanZoom className="h-44" initialScale={0.38} minScale={0.2} controls={false}>
        <Board />
      </PanZoom>
    </div>
  );
}

/* ─────────────────────────── peel card ─────────────────────────── */

function Coupon({ small }: { small?: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div className="flex items-center justify-between">
        <span className={hint}>Member offer</span>
        <Ticket size={small ? 18 : 22} weight="duotone" className="text-ink" />
      </div>
      <div>
        <p
          className={cn(
            "font-display leading-none tracking-tight text-ink",
            small ? "text-4xl" : "text-6xl",
          )}
        >
          30% off
        </p>
        <p className="mt-2 text-xs text-muted">Peel the corner for your code</p>
      </div>
    </div>
  );
}

function Code() {
  return (
    <div className="grid h-full place-items-center bg-ink text-surface">
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">Your code</p>
        <p className="mt-1.5 font-mono text-2xl font-semibold tracking-[0.12em]">VIBE30</p>
      </div>
    </div>
  );
}

function PeelDemo() {
  const [corner, setCorner] = React.useState<"br" | "bl" | "tr" | "tl">("br");
  const [seen, setSeen] = React.useState(false);
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <PeelCard
        corner={corner}
        under={<Code />}
        className="h-56 max-w-sm"
        onPeel={() => setSeen(true)}
      >
        <Coupon />
      </PeelCard>
      <Segmented
        options={[
          { value: "br", label: "Bottom right" },
          { value: "bl", label: "Bottom left" },
          { value: "tr", label: "Top right" },
          { value: "tl", label: "Top left" },
        ]}
        value={corner}
        onChange={setCorner}
      />
      <p className={hint}>{seen ? "Code revealed" : "Drag the corner toward the middle"}</p>
    </div>
  );
}

function PeelTile() {
  return (
    <PeelCard under={<Code />} className={cn(TILE_W, "h-40")}>
      <Coupon small />
    </PeelCard>
  );
}

/* ─────────────────────────── keycap ─────────────────────────── */

function KeysDemo() {
  const [sound, setSound] = React.useState(false);
  const [hits, setHits] = React.useState(0);
  const bump = () => setHits((n) => n + 1);
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-1.5 rounded-3xl border border-line bg-surface-muted p-5 shadow-[inset_0_2px_8px_rgb(0_0_0/0.06)]">
        {rows.map((r, i) => (
          <div key={r} className="flex gap-1.5" style={{ marginLeft: i * 8 }}>
            {[...r].map((k) => (
              <Keycap key={k} size="sm" shortcut={k} sound={sound} onPress={bump}>
                {k.toUpperCase()}
              </Keycap>
            ))}
          </div>
        ))}
        <div className="mt-1 flex items-center gap-1.5">
          <Keycap size="sm" className="min-w-14" legend="⌘" shortcut="mod+k" sound={sound}>
            K
          </Keycap>
          <Keycap size="sm" className="min-w-40" shortcut="space" sound={sound} onPress={bump}>
            space
          </Keycap>
          <Keycap size="sm" className="min-w-14" shortcut="enter" sound={sound} onPress={bump}>
            return
          </Keycap>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Segmented
          options={[
            { value: "off", label: "Silent" },
            { value: "on", label: "Clicky" },
          ]}
          value={sound ? "on" : "off"}
          onChange={(v) => setSound(v === "on")}
        />
        <span className="font-mono text-xs tabular-nums text-muted">
          {hits} {hits === 1 ? "press" : "presses"}
        </span>
      </div>
      <p className={hint}>Type on your keyboard</p>
    </div>
  );
}

function KeysTile() {
  return (
    <div className={cn(TILE_W, "flex flex-col items-center gap-2.5 py-4")}>
      <div className="flex gap-2">
        <Keycap size="lg" legend="⌘" shortcut="mod+k">
          <Command size={22} weight="bold" />
        </Keycap>
        <Keycap size="lg" shortcut="k">
          K
        </Keycap>
      </div>
      <div className="flex gap-2">
        <Keycap size="md" shortcut="arrowleft">
          <ArrowLeft size={18} weight="bold" />
        </Keycap>
        <Keycap size="md" shortcut="shift+arrowup">
          <ArrowFatUp size={18} weight="bold" />
        </Keycap>
        <Keycap size="md" shortcut="arrowright">
          <ArrowRight size={18} weight="bold" />
        </Keycap>
      </div>
    </div>
  );
}

/* ─────────────────────────── progressive blur ─────────────────────────── */

const FEED = [
  ["Linear", "Shipped keyboard-first triage", "#6d5dfc"],
  ["Arc", "A browser with a sidebar", "#ff6b4a"],
  ["Raycast", "Launcher with an extension store", "#ff4d6d"],
  ["Things", "Calm tasks, quietly beautiful", "#2f80ed"],
  ["Craft", "Documents that feel like paper", "#22c55e"],
  ["Superhuman", "Email at the speed of thought", "#8b5cf6"],
  ["Cron", "A calendar worth opening", "#0ea5e9"],
  ["Notion", "Blocks all the way down", "#f59e0b"],
  ["Figma", "Design in the browser", "#ec4899"],
] as const;

function Feed({ pad = "py-24" }: { pad?: string }) {
  return (
    <ul className={cn("space-y-2.5 px-3", pad)}>
      {FEED.map(([name, line, c]) => (
        <li
          key={name}
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"
        >
          <span
            className="grid size-10 place-items-center rounded-xl font-display text-lg text-white"
            style={{ background: c }}
          >
            {name[0]}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-ink">{name}</span>
            <span className="block truncate text-xs text-muted">{line}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function BlurDemo() {
  const [blur, setBlur] = React.useState<"soft" | "strong">("soft");
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="relative h-[380px] w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-surface-muted">
        <div className="h-full overflow-y-auto [scrollbar-width:none]">
          <Feed />
        </div>
        <ProgressiveBlur side="top" size={88} blur={blur === "soft" ? 12 : 28} tint />
        <ProgressiveBlur side="bottom" size={110} blur={blur === "soft" ? 12 : 28} tint />
        <p className="absolute inset-x-0 top-5 z-20 text-center font-display text-2xl text-ink">
          Made with care
        </p>
      </div>
      <Segmented
        options={[
          { value: "soft", label: "Soft" },
          { value: "strong", label: "Strong" },
        ]}
        value={blur}
        onChange={setBlur}
      />
      <p className={hint}>Scroll the list</p>
    </div>
  );
}

function BlurTile() {
  return (
    <div className={cn(TILE_W, "relative h-44 overflow-hidden rounded-xl bg-surface-muted")}>
      <div className="h-full overflow-y-auto [scrollbar-width:none]">
        <Feed pad="pb-24 pt-12" />
      </div>
      <ProgressiveBlur side="top" size={56} blur={10} tint />
      <ProgressiveBlur side="bottom" size={70} blur={10} tint />
    </div>
  );
}

/* ─────────────────────────── color picker ─────────────────────────── */

function PickerDemo() {
  const [color, setColor] = React.useState("#6d5dfc");
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-6">
      <ColorPicker value={color} onChange={setColor} alpha />
      <div className="w-full max-w-[240px] space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-quiet">
        <div className="h-20 rounded-xl" style={{ background: color }} />
        <p className="font-display text-2xl leading-none text-ink">Live preview</p>
        <p className="text-sm text-muted">
          The card, the button and the text all follow the colour you pick.
        </p>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-white shadow-sm"
          style={{ background: color }}
        >
          <Check size={14} weight="bold" /> Looks good
        </button>
      </div>
    </div>
  );
}

function PickerTile() {
  const [color, setColor] = React.useState("#ff5d73");
  return (
    <div className={TILE_W}>
      <ColorPicker
        value={color}
        onChange={setColor}
        swatches={[]}
        className="max-w-none [&>[role=slider]]:h-24"
      />
    </div>
  );
}

export const signatureThree: Record<string, Demo> = {
  "velocity-marquee": { Component: MarqueeDemo, width: "lg", Tile: MarqueeTile },
  "slide-to-confirm": { Component: SlideDemo, width: "sm", Tile: SlideTile },
  confetti: { Component: ConfettiDemo, width: "md", Tile: ConfettiTile },
  "pan-zoom": { Component: PanDemo, width: "lg", Tile: PanTile },
  "peel-card": { Component: PeelDemo, width: "md", Tile: PeelTile },
  keycap: { Component: KeysDemo, width: "lg", Tile: KeysTile },
  "progressive-blur": { Component: BlurDemo, width: "md", Tile: BlurTile },
  "color-picker": { Component: PickerDemo, width: "lg", Tile: PickerTile },
};
