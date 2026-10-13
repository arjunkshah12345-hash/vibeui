"use client";

import * as React from "react";
import { ImageSphere } from "@/components/ui/image-sphere";
import { InkTrail } from "@/components/ui/ink-trail";
import { PlasmaBall } from "@/components/ui/plasma-ball";
import { Segmented } from "@/components/ui/segmented";
import { WarpField } from "@/components/ui/warp-field";
import { cn } from "@/lib/utils";
import { TILE_W, art, type Demo } from "../demo";

const hint = "font-mono text-[10px] uppercase tracking-[0.18em] text-muted";

/* ─────────────────────────── plasma ball ─────────────────────────── */

const GAS = { violet: "#b06bff", cyan: "#2ee6ff", rose: "#ff4d8d", lime: "#9dff4d" } as const;

function PlasmaDemo() {
  const [gas, setGas] = React.useState<keyof typeof GAS>("violet");
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <PlasmaBall color={GAS[gas]} className="w-72" />
      <Segmented
        options={(Object.keys(GAS) as (keyof typeof GAS)[]).map((k) => ({
          value: k,
          label: k[0].toUpperCase() + k.slice(1),
        }))}
        value={gas}
        onChange={setGas}
      />
      <p className={hint}>Move your pointer over it · hold for a storm</p>
    </div>
  );
}

function PlasmaTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center py-4")}>
      <PlasmaBall className="w-44" />
    </div>
  );
}

/* ─────────────────────────── image sphere ─────────────────────────── */

const SPHERE = Array.from({ length: 52 }, (_, i) => {
  const hues = [
    ["#ff9a8b", "#6a3093"],
    ["#43cea2", "#185a9d"],
    ["#f7971e", "#ffd200"],
    ["#614385", "#516395"],
    ["#11998e", "#38ef7d"],
    ["#fc5c7d", "#6a82fb"],
    ["#30cfd0", "#330867"],
  ][i % 7];
  return { src: art(hues[0], hues[1], String(i + 1).padStart(2, "0")), alt: `Picture ${i + 1}` };
});

function SphereDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-3 overflow-hidden">
      <ImageSphere images={SPHERE} radius={200} tile={78} />
      <p className={hint}>Drag to spin it</p>
    </div>
  );
}

function SphereTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center overflow-hidden py-2")}>
      <ImageSphere images={SPHERE.slice(0, 20)} radius={90} tile={34} speed={0.2} />
    </div>
  );
}

/* ─────────────────────────── ink trail ─────────────────────────── */

function InkDemo() {
  return (
    <InkTrail
      size={22}
      className="grid h-80 w-full place-items-center rounded-3xl border border-line bg-surface"
    >
      <div className="pointer-events-none text-center">
        <p className="font-display text-5xl tracking-tight text-white mix-blend-difference sm:text-6xl">
          Write on it
        </p>
        <p className={cn(hint, "mt-3 !text-white mix-blend-difference")}>
          Move across the page · press to blot
        </p>
      </div>
    </InkTrail>
  );
}

function InkTile() {
  return (
    <InkTrail
      size={14}
      className={cn(
        TILE_W,
        "grid h-36 place-items-center rounded-xl border border-line bg-surface",
      )}
    >
      <p className="pointer-events-none font-display text-2xl text-white mix-blend-difference">
        Write on it
      </p>
    </InkTrail>
  );
}

/* ─────────────────────────── warp field ─────────────────────────── */

function WarpDemo() {
  return (
    <WarpField className="grid h-80 w-full place-items-center rounded-3xl">
      <div className="pointer-events-none text-center">
        <p className="font-display text-5xl tracking-tight sm:text-6xl">Hold to warp</p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
          Steer with the pointer · press and hold
        </p>
      </div>
    </WarpField>
  );
}

function WarpTile() {
  return (
    <WarpField stars={220} className={cn(TILE_W, "grid h-36 place-items-center rounded-xl")}>
      <p className="pointer-events-none font-display text-2xl">Hold to warp</p>
    </WarpField>
  );
}

export const signatureFive: Record<string, Demo> = {
  "plasma-ball": { Component: PlasmaDemo, width: "md", Tile: PlasmaTile },
  "image-sphere": { Component: SphereDemo, width: "lg", Tile: SphereTile },
  "ink-trail": { Component: InkDemo, width: "lg", Tile: InkTile },
  "warp-field": { Component: WarpDemo, width: "lg", Tile: WarpTile },
};
