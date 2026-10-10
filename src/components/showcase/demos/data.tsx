"use client";

import * as React from "react";
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
import { AreaChart } from "@/components/ui/area-chart";
import { Heatmap, type HeatmapDay } from "@/components/ui/heatmap";
import { Resizable } from "@/components/ui/resizable";
import { SortableList, type SortableItem } from "@/components/ui/sortable-list";

import { cn } from "@/lib/utils";
import { TILE_W, art, type Demo } from "../demo";

function CardDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Card interactive>
        <CardHeader>
          <Pill tone="accent" className="w-fit">
            New
          </Pill>
          <CardTitle>Interactive card</CardTitle>
          <CardDescription>Lifts gently on hover. No glow.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm" variant="ghost">
            Open
          </Button>
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
        <TR>
          <TD className="font-medium text-ink">Button</TD>
          <TD>Actions</TD>
          <TD>
            <Pill tone="sage" dot>
              Stable
            </Pill>
          </TD>
        </TR>
        <TR>
          <TD className="font-medium text-ink">Dialog</TD>
          <TD>Overlays</TD>
          <TD>
            <Pill tone="sage" dot>
              Stable
            </Pill>
          </TD>
        </TR>
        <TR>
          <TD className="font-medium text-ink">Dock</TD>
          <TD>Signature</TD>
          <TD>
            <Pill tone="sky">New</Pill>
          </TD>
        </TR>
      </TBody>
    </Table>
  );
}

function ListDemo() {
  return (
    <List>
      <ListItem
        leading={<House size={16} weight="bold" />}
        title="Home"
        description="Overview and recent work"
        trailing={<Pill tone="outline">⌘1</Pill>}
      />
      <ListItem
        leading={<Cube size={16} weight="bold" />}
        title="Components"
        description="136 pieces"
        trailing={
          <Pill tone="sage" dot>
            Live
          </Pill>
        }
      />
      <ListItem
        leading={<GearSix size={16} weight="bold" />}
        title="Settings"
        description="Tokens and theme"
        onClick={() => undefined}
      />
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
      <Stat label="Components" value="136" delta="12 this release" trend="up" />
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
        <Pill tone="accent" className="w-fit">
          New
        </Pill>
        <CardTitle>Interactive card</CardTitle>
        <CardDescription>
          Lifts on hover. Header, content and footer compose freely.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Open
        </Button>
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
          <TR>
            <TD className="font-medium text-ink">Button</TD>
            <TD>
              <Pill tone="sage" dot>
                Stable
              </Pill>
            </TD>
          </TR>
          <TR>
            <TD className="font-medium text-ink">Dialog</TD>
            <TD>
              <Pill tone="sage" dot>
                Stable
              </Pill>
            </TD>
          </TR>
          <TR>
            <TD className="font-medium text-ink">Dock</TD>
            <TD>
              <Pill tone="sky">New</Pill>
            </TD>
          </TR>
        </TBody>
      </Table>
    </div>
  );
}

function ListTile() {
  return (
    <List className={TILE_W}>
      <ListItem
        leading={<House size={16} weight="bold" />}
        title="Home"
        description="Recent work"
      />
      <ListItem
        leading={<Cube size={16} weight="bold" />}
        title="Components"
        description="136 pieces"
        trailing={
          <Pill tone="sage" dot>
            Live
          </Pill>
        }
      />
      <ListItem
        leading={<GearSix size={16} weight="bold" />}
        title="Settings"
        description="Tokens, theme"
        onClick={() => undefined}
      />
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
      <Stat label="Components" value="136" delta="12 new" trend="up" />
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
          <Pill tone="outline" className="border-white/40 bg-white/20 text-white backdrop-blur">
            16:9
          </Pill>
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

/* ─────────────────────────── area chart ─────────────────────────── */

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function AreaChartDemo() {
  return (
    <AreaChart
      labels={months}
      format={(n) => compact.format(n)}
      height={260}
      series={[
        {
          name: "Visitors",
          values: [4200, 5100, 4800, 6400, 7900, 7400, 9300, 10800, 10200, 12900, 14100, 15600],
        },
        {
          name: "Signups",
          values: [900, 1250, 1100, 1900, 2400, 2100, 3000, 3600, 3300, 4500, 5100, 5800],
        },
      ]}
    />
  );
}

function AreaChartTile() {
  return (
    <div className={TILE_W}>
      <AreaChart
        labels={months.slice(0, 9)}
        format={(n) => compact.format(n)}
        height={150}
        series={[
          { name: "Visitors", values: [4200, 5100, 4800, 6400, 7900, 7400, 9300, 10800, 10200] },
        ]}
      />
    </div>
  );
}

/* ─────────────────────────── heatmap ─────────────────────────── */

// Deterministic pseudo-random activity, so server and client render identically.
function activity(end: string, days: number): HeatmapDay[] {
  const [y, m, d] = end.split("-").map(Number);
  const out: HeatmapDay[] = [];
  for (let i = 0; i < days; i++) {
    const t = new Date(Date.UTC(y, m - 1, d - i));
    const noise = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
    const dow = t.getUTCDay();
    const base = dow === 0 || dow === 6 ? 0.25 : 1;
    const burst = Math.abs(Math.sin(i / 9)) > 0.8 ? 2.4 : 1;
    const v = noise < 0.22 ? 0 : Math.round(noise * 9 * base * burst);
    out.push({ date: t.toISOString().slice(0, 10), value: v });
  }
  return out;
}

const history = activity("2026-10-08", 26 * 7);

function HeatmapDemo() {
  return <Heatmap data={history} weeks={26} unit="commits" />;
}

function HeatmapTile() {
  return (
    <div className={TILE_W}>
      <Heatmap data={history} weeks={17} unit="commits" />
    </div>
  );
}

/* ─────────────────────────── sortable list ─────────────────────────── */

const tasks: SortableItem[] = [
  {
    id: "tokens",
    label: "Design the token file",
    content: <span className="text-sm text-ink">Design the token file</span>,
  },
  {
    id: "motion",
    label: "Tune the motion",
    content: <span className="text-sm text-ink">Tune the motion</span>,
  },
  {
    id: "docs",
    label: "Write the docs",
    content: <span className="text-sm text-ink">Write the docs</span>,
  },
  {
    id: "film",
    label: "Cut the launch film",
    content: <span className="text-sm text-ink">Cut the launch film</span>,
  },
  { id: "ship", label: "Ship it", content: <span className="text-sm text-ink">Ship it</span> },
];

function SortableDemo() {
  const [items, setItems] = React.useState(tasks);
  return (
    <div className="w-full max-w-sm">
      <SortableList items={items} onItemsChange={setItems} aria-label="Launch checklist" />
      <p className="mt-3 text-center text-xs text-muted">
        Drag a grip, or focus it and press Space, then the arrow keys.
      </p>
    </div>
  );
}

function SortableTile() {
  const [items, setItems] = React.useState(tasks.slice(0, 4));
  return (
    <div className={TILE_W}>
      <SortableList
        items={items}
        onItemsChange={setItems}
        aria-label="Checklist"
        className="gap-1.5"
      />
    </div>
  );
}

/* ─────────────────────────── resizable ─────────────────────────── */

function Pane({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("h-full bg-surface p-3", className)}>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{title}</p>
      {children}
    </div>
  );
}

function ResizableDemo() {
  return (
    <div className="h-72 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-quiet">
      <Resizable defaultSizes={[28, 72]} minSize={16}>
        <Pane title="Files" className="bg-surface-muted/60">
          <ul className="space-y-1.5 font-mono text-xs text-muted">
            <li className="text-ink">button.tsx</li>
            <li>dialog.tsx</li>
            <li>dock.tsx</li>
            <li>drawer.tsx</li>
            <li>tokens.css</li>
          </ul>
        </Pane>
        <Resizable direction="vertical" defaultSizes={[62, 38]} minSize={20} className="h-full">
          <Pane title="Editor">
            <pre className="font-mono text-xs leading-5 text-muted">
              <span className="text-ink">export function</span> Button() {"{"}
              {"\n"} <span className="text-ink">return</span> {"<button className="}
              {'"…"'} {"/>"}
              {"\n"}
              {"}"}
            </pre>
          </Pane>
          <Pane title="Terminal" className="bg-surface-muted/60">
            <p className="font-mono text-xs text-muted">
              <span className="text-faint">$</span> npx @agents-npm-packages/vibeui add drawer
            </p>
            <p className="font-mono text-xs text-ink">✓ drawer → src/components/ui/drawer.tsx</p>
          </Pane>
        </Resizable>
      </Resizable>
    </div>
  );
}

function ResizableTile() {
  return (
    <div
      className={cn(
        TILE_W,
        "h-[150px] overflow-hidden rounded-xl border border-line bg-surface shadow-quiet",
      )}
    >
      <Resizable defaultSizes={[40, 60]} minSize={20}>
        <Pane title="Files" className="bg-surface-muted/60" />
        <Pane title="Editor" />
      </Resizable>
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
  "area-chart": { Component: AreaChartDemo, width: "lg", Tile: AreaChartTile },
  heatmap: { Component: HeatmapDemo, width: "lg", Tile: HeatmapTile },
  "sortable-list": { Component: SortableDemo, width: "sm", Tile: SortableTile },
  resizable: { Component: ResizableDemo, width: "lg", Tile: ResizableTile },
};
