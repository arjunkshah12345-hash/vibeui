"use client";

import { Cube, GearSix, House } from "@phosphor-icons/react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { ComparisonBar } from "@/components/ui/comparison";
import { List, ListItem } from "@/components/ui/list";
import { Pill } from "@/components/ui/pill";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Stat } from "@/components/ui/stat";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TILE_W, art, type Demo } from "../demo";

function CardDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Card interactive>
        <CardHeader>
          <Pill tone="accent" className="w-fit">New</Pill>
          <CardTitle>Interactive card</CardTitle>
          <CardDescription>Lifts gently on hover. No glow.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm" variant="ghost">Open</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Static card</CardTitle>
          <CardDescription>For grouping content.</CardDescription>
        </CardHeader>
        <CardContent>Header, content and footer slots compose freely.</CardContent>
      </Card>
    </div>
  );
}

function TableDemo() {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Component</TH>
          <TH>Category</TH>
          <TH>Status</TH>
        </TR>
      </THead>
      <TBody>
        <TR><TD className="font-medium text-ink">Button</TD><TD>Actions</TD><TD><Pill tone="sage" dot>Stable</Pill></TD></TR>
        <TR><TD className="font-medium text-ink">Dialog</TD><TD>Overlays</TD><TD><Pill tone="sage" dot>Stable</Pill></TD></TR>
        <TR><TD className="font-medium text-ink">Dock</TD><TD>Signature</TD><TD><Pill tone="sky">New</Pill></TD></TR>
      </TBody>
    </Table>
  );
}

function ListDemo() {
  return (
    <List>
      <ListItem leading={<House size={16} weight="bold" />} title="Home" description="Overview and recent work" trailing={<Pill tone="outline">⌘1</Pill>} />
      <ListItem leading={<Cube size={16} weight="bold" />} title="Components" description="112 pieces" trailing={<Pill tone="sage" dot>Live</Pill>} />
      <ListItem leading={<GearSix size={16} weight="bold" />} title="Settings" description="Tokens and theme" onClick={() => undefined} />
    </List>
  );
}

function AvatarDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-3">
        <Avatar fallback="Ada Lovelace" size="xs" />
        <Avatar fallback="Grace Hopper" size="sm" />
        <Avatar fallback="Alan Turing" size="md" />
        <Avatar fallback="Margaret Hamilton" size="lg" />
        <Avatar fallback="Linus" size="xl" src={art("#d9480f", "#7048e8")} alt="" />
      </div>
      <AvatarGroup max={4}>
        <Avatar fallback="Maya Kline" />
        <Avatar fallback="Rishi Shah" />
        <Avatar fallback="Ana López" />
        <Avatar fallback="Sam Ito" />
        <Avatar fallback="Jo Park" />
        <Avatar fallback="Eli Voss" />
      </AvatarGroup>
    </div>
  );
}

function StatDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      <Stat label="Components" value="112" delta="12 this release" trend="up" />
      <Stat label="Bundle" value="0 kb" delta="Copy-owned" trend="neutral" />
      <Stat label="Errors" value="0.4%" delta="0.2% vs last week" trend="down" />
    </div>
  );
}

function CodeDemo() {
  return (
    <CodeBlock
      className="w-full"
      language="tsx"
      filename="app/page.tsx"
      code={`import { Button } from "@/components/ui/button"

export default function Page() {
  // Own every line. Retint the tokens.
  return <Button variant="accent">Get started</Button>
}`}
    />
  );
}

function SwatchDemo() {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <ColorSwatch color="var(--ink)" label="Ink" value="--ink" />
      <ColorSwatch color="var(--accent)" label="Accent" value="--accent" />
      <ColorSwatch color="var(--canvas)" label="Canvas" value="--canvas" />
      <ColorSwatch color="var(--pastel-sage)" label="Sage" value="--pastel-sage" />
    </div>
  );
}

function ComparisonDemo() {
  return (
    <div className="w-full space-y-6">
      <ComparisonBar left="Light" right="Dark" leftValue={42} rightValue={58} />
      <ComparisonBar left="Mobile" right="Desktop" leftValue={71} rightValue={29} />
    </div>
  );
}

function ScrollDemo() {
  return (
    <ScrollArea maxHeight={200} className="w-full">
      <ul className="divide-y divide-line">
        {Array.from({ length: 12 }, (_, i) => (
          <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-ink-soft">Release note #{12 - i}</span>
            <span className="font-mono text-[11px] text-faint">v0.{12 - i}.0</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

function AspectDemo() {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <AspectRatio ratio={16 / 9} className="rounded-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={art("#0ea5e9", "#6366f1", "16:9")} alt="" className="size-full object-cover" />
      </AspectRatio>
      <AspectRatio ratio={1} className="rounded-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={art("#d9480f", "#f59f00", "1:1")} alt="" className="size-full object-cover" />
      </AspectRatio>
    </div>
  );
}


/* Gallery tiles: one fixed-width, evenly spaced composition per component. */

function CardTile() {
  return (
    <Card interactive className={TILE_W}>
      <CardHeader>
        <Pill tone="accent" className="w-fit">New</Pill>
        <CardTitle>Interactive card</CardTitle>
        <CardDescription>Lifts on hover. Header, content and footer compose freely.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="sm" variant="secondary">Open</Button>
      </CardFooter>
    </Card>
  );
}

function TableTile() {
  return (
    <div className={TILE_W}>
    <Table>
      <THead>
        <TR>
          <TH>Component</TH>
          <TH>Status</TH>
        </TR>
      </THead>
      <TBody>
        <TR><TD className="font-medium text-ink">Button</TD><TD><Pill tone="sage" dot>Stable</Pill></TD></TR>
        <TR><TD className="font-medium text-ink">Dialog</TD><TD><Pill tone="sage" dot>Stable</Pill></TD></TR>
        <TR><TD className="font-medium text-ink">Dock</TD><TD><Pill tone="sky">New</Pill></TD></TR>
      </TBody>
    </Table>
    </div>
  );
}

function ListTile() {
  return (
    <List className={TILE_W}>
      <ListItem leading={<House size={16} weight="bold" />} title="Home" description="Recent work" />
      <ListItem leading={<Cube size={16} weight="bold" />} title="Components" description="112 pieces" trailing={<Pill tone="sage" dot>Live</Pill>} />
      <ListItem leading={<GearSix size={16} weight="bold" />} title="Settings" description="Tokens, theme" onClick={() => undefined} />
    </List>
  );
}

function AvatarTile() {
  return (
    <div className={cn(TILE_W, "flex flex-col items-center gap-6")}>
      <div className="flex items-center gap-3">
        <Avatar fallback="Ada Lovelace" size="xs" />
        <Avatar fallback="Grace Hopper" size="sm" />
        <Avatar fallback="Alan Turing" size="md" />
        <Avatar fallback="Margaret Hamilton" size="lg" />
        <Avatar fallback="Linus" size="lg" src={art("#d9480f", "#7048e8")} alt="" />
      </div>
      <AvatarGroup max={4}>
        <Avatar fallback="Maya Kline" />
        <Avatar fallback="Rishi Shah" />
        <Avatar fallback="Ana López" />
        <Avatar fallback="Sam Ito" />
        <Avatar fallback="Jo Park" />
        <Avatar fallback="Eli Voss" />
      </AvatarGroup>
    </div>
  );
}

function StatTile() {
  return (
    <div className={cn(TILE_W, "grid grid-cols-2 gap-3")}>
      <Stat label="Components" value="112" delta="12 new" trend="up" />
      <Stat label="Errors" value="0.4%" delta="0.2%" trend="down" />
    </div>
  );
}

function CodeTile() {
  return (
    <CodeBlock
      className={TILE_W}
      language="tsx"
      filename="page.tsx"
      code={`import { Button } from "./ui"

<Button variant="accent">
  Get started
</Button>`}
    />
  );
}

function SwatchTile() {
  return (
    <div className={cn(TILE_W, "grid grid-cols-2 gap-x-3 gap-y-4")}>
      <ColorSwatch color="var(--ink)" label="Ink" value="--ink" />
      <ColorSwatch color="var(--accent)" label="Accent" value="--accent" />
      <ColorSwatch color="var(--canvas)" label="Canvas" value="--canvas" />
      <ColorSwatch color="var(--pastel-sage)" label="Sage" value="--sage" />
    </div>
  );
}

function ComparisonTile() {
  return (
    <div className={cn(TILE_W, "space-y-6")}>
      <ComparisonBar left="Light" right="Dark" leftValue={42} rightValue={58} />
      <ComparisonBar left="Mobile" right="Desktop" leftValue={71} rightValue={29} />
    </div>
  );
}

function ScrollTile() {
  return (
    <ScrollArea maxHeight={176} className={TILE_W}>
      <ul className="divide-y divide-line">
        {Array.from({ length: 12 }, (_, i) => (
          <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-ink-soft">Release note #{12 - i}</span>
            <span className="font-mono text-[11px] text-faint">v0.{12 - i}.0</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

function AspectTile() {
  return (
    <div className={cn(TILE_W, "space-y-2.5")}>
      <AspectRatio ratio={16 / 9} className="rounded-md shadow-quiet">
        <div
          className="flex size-full items-end p-3"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
        >
          <Pill tone="outline" className="border-white/40 bg-white/20 text-white backdrop-blur">16:9</Pill>
        </div>
      </AspectRatio>
      <div className="flex items-center justify-between px-1">
        {(
          [
            ["1:1", 1],
            ["4:3", 4 / 3],
            ["3:4", 3 / 4],
          ] as const
        ).map(([label, ratio]) => (
          <div
            key={label}
            style={{ height: 44, aspectRatio: String(ratio) }}
            className="flex items-center justify-center rounded-sm border border-line-strong bg-surface-muted"
          >
            <span className="font-mono text-[10px] text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const data: Record<string, Demo> = {
  card: { Component: CardDemo, width: "lg", Tile: CardTile },
  table: { Component: TableDemo, width: "lg", Tile: TableTile },
  list: { Component: ListDemo, Tile: ListTile },
  avatar: { Component: AvatarDemo, Tile: AvatarTile },
  stat: { Component: StatDemo, width: "lg", Tile: StatTile },
  "code-block": { Component: CodeDemo, width: "lg", Tile: CodeTile },
  "color-swatch": { Component: SwatchDemo, Tile: SwatchTile },
  comparison: { Component: ComparisonDemo, Tile: ComparisonTile },
  "scroll-area": { Component: ScrollDemo, width: "sm", Tile: ScrollTile },
  "aspect-ratio": { Component: AspectDemo, Tile: AspectTile },
};
