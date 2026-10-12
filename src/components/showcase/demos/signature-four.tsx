"use client";

import * as React from "react";
import { ArrowRight, Check, DiceFive } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dice, type DiceHandle } from "@/components/ui/dice";
import { DitherImage } from "@/components/ui/dither-image";
import { FallingSand } from "@/components/ui/falling-sand";
import { Lanyard } from "@/components/ui/lanyard";
import { Loupe } from "@/components/ui/loupe";
import { PluckString } from "@/components/ui/pluck-string";
import { Segmented } from "@/components/ui/segmented";
import { SignaturePad, type SignaturePadHandle } from "@/components/ui/signature-pad";
import { SplitFlap } from "@/components/ui/split-flap";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

const hint = "font-mono text-[10px] uppercase tracking-[0.18em] text-muted";

/** Steps through a list on a timer. */
function useRotation<T>(items: readonly T[], ms: number) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % items.length), ms);
    return () => window.clearInterval(id);
  }, [items.length, ms]);
  return [items[i], i] as const;
}

/* ─────────────────────────── split flap ─────────────────────────── */

const FLIGHTS = [
  [
    ["LISBON", "09:15", "A12"],
    ["OSLO", "09:40", "B03"],
    ["KYOTO", "10:05", "C21"],
    ["NAIROBI", "10:30", "A07"],
  ],
  [
    ["REYKJAVIK", "11:10", "B14"],
    ["MARRAKECH", "11:35", "C02"],
    ["VALPARAISO", "12:00", "A19"],
    ["SINGAPORE", "12:25", "B08"],
  ],
] as const;

function FlapDemo() {
  const [set] = useRotation(FLIGHTS, 6500);
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="w-full overflow-x-auto rounded-3xl bg-[#14130f] p-5 shadow-lift">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4f2ee]/50">
          Departures
        </p>
        <div className="flex flex-col gap-2">
          {set.map(([to, at, gate], i) => (
            <div key={i} className="flex w-max items-center gap-4">
              <SplitFlap value={to} length={10} size="sm" stagger={32} />
              <SplitFlap value={at} length={5} size="sm" stagger={32} />
              <SplitFlap value={gate} length={3} size="sm" stagger={32} />
            </div>
          ))}
        </div>
      </div>
      <p className={hint}>The board updates itself</p>
    </div>
  );
}

const CITIES = ["BERLIN", "TOKYO", "LAGOS", "QUITO", "OSLO", "DELHI"] as const;

function FlapTile() {
  const [city] = useRotation(CITIES, 3600);
  return (
    <div className={cn(TILE_W, "grid place-items-center rounded-xl bg-[#14130f] py-6")}>
      <SplitFlap value={city} length={6} size="md" stagger={55} />
    </div>
  );
}

/* ─────────────────────────── dither image ─────────────────────────── */

const SCENE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
<defs>
<linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a2a73'/><stop offset='.45' stop-color='#d4527a'/><stop offset='.75' stop-color='#ff9a62'/><stop offset='1' stop-color='#ffe0a6'/></linearGradient>
<radialGradient id='g' cx='.5' cy='.5' r='.5'><stop offset='0' stop-color='#fff6d8'/><stop offset='.6' stop-color='#ffd36b'/><stop offset='1' stop-color='#ff9a62' stop-opacity='0'/></radialGradient>
<linearGradient id='w' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ff9a62'/><stop offset='1' stop-color='#3a2a73'/></linearGradient>
</defs>
<rect width='800' height='600' fill='url(#s)'/>
<circle cx='520' cy='330' r='190' fill='url(#g)'/>
<circle cx='520' cy='330' r='62' fill='#fff3cf'/>
<polygon points='0,420 120,330 230,410 360,300 500,420 640,350 800,430 800,470 0,470' fill='#5d3b7e'/>
<polygon points='0,470 90,410 210,470 330,400 470,470 600,420 720,470 800,445 800,500 0,500' fill='#3a2a62'/>
<polygon points='0,500 140,450 280,500 420,455 560,500 700,460 800,490 800,520 0,520' fill='#231a45'/>
<rect y='520' width='800' height='80' fill='url(#w)'/>
<ellipse cx='520' cy='548' rx='120' ry='9' fill='#ffd8a0' opacity='.7'/>
<ellipse cx='520' cy='566' rx='70' ry='5' fill='#ffd8a0' opacity='.45'/>
</svg>`,
)}`;

const DITHER_LOOKS = {
  mono: { fg: undefined, bg: undefined },
  ember: { fg: "#3b0d12", bg: "#ffe2b8" },
  ocean: { fg: "#06233f", bg: "#c9ecff" },
} as const;

function DitherDemo() {
  const [look, setLook] = React.useState<keyof typeof DITHER_LOOKS>("mono");
  const [pixel, setPixel] = React.useState(3);
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <DitherImage
        src={SCENE}
        alt="A sunset over layered purple mountains and still water"
        pixel={pixel}
        radius={130}
        fg={DITHER_LOOKS[look].fg}
        bg={DITHER_LOOKS[look].bg}
        className="shadow-lift"
      />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Segmented
          options={(Object.keys(DITHER_LOOKS) as (keyof typeof DITHER_LOOKS)[]).map((k) => ({
            value: k,
            label: k[0].toUpperCase() + k.slice(1),
          }))}
          value={look}
          onChange={setLook}
        />
        <Segmented
          options={[
            { value: "2", label: "Fine" },
            { value: "3", label: "Medium" },
            { value: "5", label: "Chunky" },
          ]}
          value={String(pixel)}
          onChange={(v) => setPixel(Number(v))}
        />
      </div>
      <p className={hint}>Move across the picture</p>
    </div>
  );
}

function DitherTile() {
  return (
    <div className={TILE_W}>
      <DitherImage src={SCENE} alt="A sunset over mountains" pixel={3} radius={80} />
    </div>
  );
}

/* ─────────────────────────── loupe ─────────────────────────── */

function Specimen({ compact }: { compact?: boolean }) {
  return (
    <div className={cn("bg-surface text-ink", compact ? "p-4" : "p-7")}>
      <div className="flex items-baseline justify-between border-b border-ink pb-2">
        <p
          className={cn(
            "font-display leading-none tracking-tight",
            compact ? "text-2xl" : "text-5xl",
          )}
        >
          Field Notes
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">No. 042</p>
      </div>
      <div className={cn("mt-3 grid gap-3", compact ? "grid-cols-2" : "grid-cols-[1.2fr_1fr]")}>
        <p className={cn("leading-snug text-muted", compact ? "text-[7px]" : "text-[10px]")}>
          Kerning is the quiet art of space between letters. Too tight and the eye stumbles; too
          loose and the word falls apart into strangers. A good setter adjusts by sight, pair by
          pair, until the line reads as one even grey. Hold a loupe to any well set page and the
          care shows: every join, every counter, every serif meeting its stem at the same angle.
          Poor type hides behind size; fine type holds up under magnification.
        </p>
        <div className="space-y-2">
          <div
            className={cn("rounded-md", compact ? "h-14" : "h-24")}
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #ffd36b 0 14%, transparent 15%), repeating-linear-gradient(45deg, #d4527a 0 3px, #3a2a73 3px 6px)",
            }}
          />
          <p className="font-mono text-[6px] uppercase tracking-widest text-muted">
            Plate 4. Hand-ruled hatching, 6 lines to the millimetre, shown actual size.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoupeDemo() {
  const [zoom, setZoom] = React.useState(2.6);
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <Loupe
        zoom={zoom}
        className="w-full rounded-2xl border border-line shadow-lift"
        aria-label="A specimen page. Move the pointer over it to magnify."
      >
        <Specimen />
      </Loupe>
      <Segmented
        options={[
          { value: "1.8", label: "1.8×" },
          { value: "2.6", label: "2.6×" },
          { value: "4", label: "4×" },
        ]}
        value={String(zoom)}
        onChange={(v) => setZoom(Number(v))}
      />
      <p className={hint}>Move across the page</p>
    </div>
  );
}

function LoupeTile() {
  return (
    <Loupe zoom={2.6} size={110} className={cn(TILE_W, "rounded-xl border border-line")}>
      <Specimen compact />
    </Loupe>
  );
}

/* ─────────────────────────── pluck string ─────────────────────────── */

const GUITAR = ["E4", "B3", "G3", "D3", "A2", "E2"] as const;

function StringsDemo() {
  const [last, setLast] = React.useState("");
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="w-full rounded-3xl border border-line bg-surface p-5 shadow-quiet">
        <div className="flex flex-col">
          {GUITAR.map((n, i) => (
            <div key={n} className="flex items-center gap-3">
              <span className="w-7 font-mono text-[11px] text-muted">{n}</span>
              <PluckString
                note={n}
                thickness={1 + i * 0.45}
                onPluck={setLast}
                className="h-12 flex-1"
              />
            </div>
          ))}
        </div>
      </div>
      <p className={hint}>
        {last ? `Played ${last}` : "Sweep across the strings, or pull one and let go"}
      </p>
    </div>
  );
}

function StringsTile() {
  return (
    <div className={cn(TILE_W, "flex flex-col")}>
      {(["A3", "D3", "G2"] as const).map((n, i) => (
        <PluckString key={n} note={n} thickness={1.2 + i * 0.6} className="h-12" />
      ))}
    </div>
  );
}

/* ─────────────────────────── signature pad ─────────────────────────── */

function SignDemo() {
  const pad = React.useRef<SignaturePadHandle>(null);
  const [png, setPng] = React.useState<string | null>(null);
  const [accepted, setAccepted] = React.useState(false);
  return (
    <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-5 shadow-quiet">
      <p className="font-display text-2xl leading-none text-ink">Sign to accept</p>
      <p className="mt-2 text-sm text-muted">
        Draw with a mouse, a pen or a finger. Slow strokes swell; fast ones thin out.
      </p>
      <SignaturePad
        ref={pad}
        className="mt-4 bg-surface-muted"
        onChange={(url) => {
          setAccepted(false);
          setPng(url ? (pad.current?.toDataURL("#14130f") ?? null) : null);
        }}
      />
      <div className="mt-4 flex items-center gap-3">
        <Button disabled={!png} onClick={() => setAccepted(true)}>
          {accepted ? (
            <>
              <Check size={16} weight="bold" /> Signed
            </>
          ) : (
            <>
              Accept <ArrowRight size={16} weight="bold" />
            </>
          )}
        </Button>
        {png && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={png}
            alt="Your signature"
            className="h-10 w-24 rounded-md border border-line bg-white object-contain"
          />
        )}
      </div>
    </div>
  );
}

function SignTile() {
  return (
    <div className={TILE_W}>
      <SignaturePad className="h-36" controls={false} placeholder="Sign here" />
    </div>
  );
}

/* ─────────────────────────── falling sand ─────────────────────────── */

function SandDemo() {
  return (
    <div className="w-full">
      <FallingSand className="h-96" />
      <p className={cn(hint, "mt-3 text-center")}>Press and drag to pour</p>
    </div>
  );
}

function SandTile() {
  return <FallingSand cell={3} bandMs={1000} className={cn(TILE_W, "h-44 rounded-xl")} />;
}

/* ─────────────────────────── dice ─────────────────────────── */

function DiceDemo() {
  const a = React.useRef<DiceHandle>(null);
  const b = React.useRef<DiceHandle>(null);
  const [roll, setRoll] = React.useState<[number, number]>([1, 1]);
  const both = () => {
    a.current?.roll();
    b.current?.roll();
  };
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex items-center">
        <Dice ref={a} size={76} onRoll={(v) => setRoll((r) => [v, r[1]])} />
        <Dice ref={b} size={76} defaultValue={4} onRoll={(v) => setRoll((r) => [r[0], v])} />
      </div>
      <p className="font-display text-5xl leading-none tabular-nums text-ink">
        {roll[0] + roll[1]}
      </p>
      <Button onClick={both}>
        <DiceFive size={18} weight="fill" /> Roll both
      </Button>
      <p className={hint}>Or click a die</p>
    </div>
  );
}

function DiceTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center")}>
      <Dice size={64} defaultValue={5} />
    </div>
  );
}

/* ─────────────────────────── lanyard ─────────────────────────── */

function Pass({ small }: { small?: boolean }) {
  return (
    <div className={cn("text-ink", small ? "px-3 pb-3" : "px-5 pb-5")}>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
        {small ? "VibeUI 26" : "VibeUI Conf 26"}
      </p>
      <p
        className={cn(
          "mt-1 font-display leading-none tracking-tight",
          small ? "text-2xl" : "text-4xl",
        )}
      >
        Ada
        <br />
        Lovelace
      </p>
      <p className="mt-1.5 text-[11px] text-muted">Speaker · Engineering</p>
      {!small && (
        <div className="mt-4 flex items-end justify-between">
          <div
            aria-hidden
            className="size-16 rounded-md"
            style={{
              background:
                "conic-gradient(from 90deg, #14130f 25%, #fff 0 50%, #14130f 0 75%, #fff 0) 0 0 / 8px 8px, #fff",
              boxShadow: "inset 0 0 0 4px #fff, inset 0 0 0 5px #14130f",
            }}
          />
          <p className="font-mono text-[10px] text-muted">№ 0042</p>
        </div>
      )}
    </div>
  );
}

function LanyardDemo() {
  return (
    <div className="w-full">
      <Lanyard
        className="h-[520px] rounded-3xl border border-line bg-surface-muted"
        strapText="VIBEUI CONF 26"
      >
        <Pass />
      </Lanyard>
      <p className={cn(hint, "mt-3 text-center")}>Grab the badge, swing it, let go</p>
    </div>
  );
}

function LanyardTile() {
  return (
    <Lanyard
      width={128}
      strapText="VIBEUI"
      className={cn(TILE_W, "h-[290px] rounded-xl bg-surface-muted")}
    >
      <Pass small />
    </Lanyard>
  );
}

export const signatureFour: Record<string, Demo> = {
  "split-flap": { Component: FlapDemo, width: "lg", Tile: FlapTile },
  "dither-image": { Component: DitherDemo, width: "md", Tile: DitherTile },
  loupe: { Component: LoupeDemo, width: "md", Tile: LoupeTile },
  "pluck-string": { Component: StringsDemo, width: "md", Tile: StringsTile },
  "signature-pad": { Component: SignDemo, width: "md", Tile: SignTile },
  "falling-sand": { Component: SandDemo, width: "md", Tile: SandTile },
  dice: { Component: DiceDemo, width: "sm", Tile: DiceTile },
  lanyard: { Component: LanyardDemo, width: "sm", height: 600, Tile: LanyardTile },
};
