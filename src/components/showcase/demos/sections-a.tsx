"use client";

import * as React from "react";
import {
  Archive,
  ChartBar,
  Code,
  FileText,
  Flag,
  Folder,
  Gear,
  House,
  Lightning,
  MapPin,
  Rocket,
  Trash,
  Users,
} from "@phosphor-icons/react";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { BarChart } from "@/components/ui/bar-chart";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { CopyButton } from "@/components/ui/copy-button";
import { DonutChart } from "@/components/ui/donut-chart";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Gauge } from "@/components/ui/gauge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { RangeSlider } from "@/components/ui/range-slider";
import { Segmented } from "@/components/ui/segmented";
import { Sidebar } from "@/components/ui/sidebar";
import { Sparkline } from "@/components/ui/sparkline";
import { SplitButton } from "@/components/ui/split-button";
import { StatusButton, type ButtonStatus } from "@/components/ui/status-button";
import { StatusIcon, type StatusKind } from "@/components/ui/status-icon";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

const hint = "font-mono text-[10px] uppercase tracking-[0.18em] text-muted";
const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

/** Steps through a list on a timer. */
function useRotation<T>(items: readonly T[], ms: number) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % items.length), ms);
    return () => window.clearInterval(id);
  }, [items.length, ms]);
  return items[i];
}

/* ─────────────────────────── actions ─────────────────────────── */

function StatusButtonDemo() {
  const [forced, setForced] = React.useState<ButtonStatus>("idle");
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <StatusButton onClick={() => wait(1600)}>Save changes</StatusButton>
        <StatusButton
          variant="secondary"
          loadingLabel="Deploying"
          successLabel="Live"
          errorLabel="Failed, retry"
          onClick={async () => {
            await wait(1400);
            throw new Error("nope");
          }}
        >
          Deploy
        </StatusButton>
      </div>
      <div className="flex flex-col items-center gap-3">
        <StatusButton status={forced} variant="accent" onClick={() => setForced("idle")}>
          Controlled
        </StatusButton>
        <Segmented
          options={(["idle", "loading", "success", "error"] as const).map((v) => ({
            value: v,
            label: v[0].toUpperCase() + v.slice(1),
          }))}
          value={forced}
          onChange={setForced}
        />
      </div>
      <p className={hint}>Click a button · or drive it from state</p>
    </div>
  );
}

function StatusButtonTile() {
  const status = useRotation(["idle", "loading", "success"] as const, 1500);
  return (
    <div className={cn(TILE_W, "grid place-items-center py-8")}>
      <StatusButton status={status}>Save changes</StatusButton>
    </div>
  );
}

function CopyDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-muted py-2 pl-4 pr-2 font-mono text-sm text-ink">
        <span className="truncate">npx @agents-npm-packages/vibeui add button</span>
        <CopyButton value="npx @agents-npm-packages/vibeui add button" />
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-2 pl-4 font-mono text-sm text-muted">
        <span className="truncate">sk_live_••••••••••••••••4f2a</span>
        <CopyButton value="sk_live_demo_token_4f2a" label="Copy key" copiedLabel="Copied" />
      </div>
      <p className={cn(hint, "text-center")}>Click to copy</p>
    </div>
  );
}

function CopyTile() {
  return (
    <div
      className={cn(
        TILE_W,
        "flex items-center justify-between gap-2 rounded-xl border border-line bg-surface-muted py-1.5 pl-3 pr-1.5 font-mono text-[11px] text-ink",
      )}
    >
      <span className="truncate">npx vibeui add button</span>
      <CopyButton value="npx vibeui add button" />
    </div>
  );
}

const publishItems = [
  { label: "Publish now", description: "Goes live immediately", icon: <Rocket />, shortcut: "⌘↵" },
  { label: "Schedule", description: "Pick a date and time", icon: <Flag /> },
  { label: "Save as draft", icon: <FileText />, shortcut: "⌘S" },
  { label: "Archive", icon: <Archive />, disabled: true },
  { label: "Delete", icon: <Trash />, danger: true },
];

function SplitDemo() {
  const [last, setLast] = React.useState("");
  const items = publishItems.map((i) => ({ ...i, onSelect: () => setLast(i.label) }));
  return (
    <div className="flex w-full flex-col items-center gap-6 pb-56">
      <div className="flex flex-wrap items-start justify-center gap-4">
        <SplitButton items={items} onClick={() => setLast("Publish")}>
          Publish
        </SplitButton>
        <SplitButton
          variant="secondary"
          items={items}
          align="start"
          onClick={() => setLast("Publish")}
        >
          Publish
        </SplitButton>
      </div>
      <p className={hint}>{last ? `Chose: ${last}` : "Open the chevron · use the arrow keys"}</p>
    </div>
  );
}

function SplitTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center py-9")}>
      <SplitButton items={publishItems.slice(0, 3)}>Publish</SplitButton>
    </div>
  );
}

/* ─────────────────────────── forms ─────────────────────────── */

function TextareaDemo() {
  const [sent, setSent] = React.useState("");
  return (
    <div className="w-full max-w-md space-y-3">
      <AutosizeTextarea
        placeholder="What are you working on?"
        maxLength={140}
        minRows={2}
        maxRows={7}
        onSubmit={(t) => setSent(t)}
      />
      <p className={hint}>{sent ? `Submitted ${sent.length} characters` : "Type · ⌘↵ to submit"}</p>
    </div>
  );
}

function TextareaTile() {
  return (
    <div className={TILE_W}>
      <AutosizeTextarea
        defaultValue="It grows with every line you add, and the ring fills as you go."
        maxLength={90}
        minRows={2}
        maxRows={4}
      />
    </div>
  );
}

const PLACES = [
  { value: "pt", label: "Portugal", hint: "Lisbon", icon: <MapPin /> },
  { value: "no", label: "Norway", hint: "Oslo", icon: <MapPin /> },
  { value: "jp", label: "Japan", hint: "Tokyo", icon: <MapPin /> },
  { value: "ke", label: "Kenya", hint: "Nairobi", icon: <MapPin /> },
  { value: "is", label: "Iceland", hint: "Reykjavík", icon: <MapPin /> },
  { value: "ma", label: "Morocco", hint: "Marrakech", icon: <MapPin /> },
  { value: "cl", label: "Chile", hint: "Valparaíso", icon: <MapPin /> },
  { value: "sg", label: "Singapore", hint: "Singapore", icon: <MapPin /> },
  { value: "ar", label: "Argentina", hint: "Buenos Aires", icon: <MapPin /> },
  { value: "tr", label: "Türkiye", hint: "Istanbul", icon: <MapPin /> },
];

function ComboDemo() {
  return (
    <div className="w-full max-w-sm space-y-3 pb-64">
      <Combobox options={PLACES} defaultValue="jp" clearable placeholder="Where to?" />
      <p className={hint}>Type to filter · arrows and Enter</p>
    </div>
  );
}

function ComboTile() {
  return (
    <div className={cn(TILE_W, "pb-2")}>
      <Combobox options={PLACES.slice(0, 5)} defaultValue="no" />
    </div>
  );
}

const PRICES = [3, 6, 9, 14, 20, 26, 24, 19, 13, 9, 6, 4, 3, 2, 2, 1];

function RangeDemo() {
  const [range, setRange] = React.useState<[number, number]>([40, 320]);
  return (
    <div className="w-full max-w-md space-y-4">
      <RangeSlider
        label="Nightly price"
        min={0}
        max={500}
        step={5}
        minGap={20}
        value={range}
        onChange={setRange}
        histogram={PRICES}
        format={(n) => `$${n}`}
      />
      <p className={hint}>Drag either handle · arrow keys when focused</p>
    </div>
  );
}

function RangeTile() {
  return (
    <div className={TILE_W}>
      <RangeSlider
        min={0}
        max={500}
        step={5}
        defaultValue={[120, 340]}
        histogram={PRICES.slice(0, 12)}
        format={(n) => `$${n}`}
      />
    </div>
  );
}

/* ─────────────────────────── feedback ─────────────────────────── */

function RingDemo() {
  const [v, setV] = React.useState(72);
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <ProgressRing value={v} from="#ff7a3d" to="#c13a8f" size={128} thickness={11}>
          <span className="font-display text-4xl tabular-nums text-ink">{v}</span>
        </ProgressRing>
        <ProgressRing value={v} variant="ticks" size={128} thickness={9}>
          <span className="font-mono text-sm tabular-nums text-ink">{v}%</span>
        </ProgressRing>
        <ProgressRing size={128} thickness={11} label="Loading">
          <span className="text-xs text-muted">Loading</span>
        </ProgressRing>
      </div>
      <Segmented
        options={[0, 25, 50, 72, 100].map((n) => ({ value: String(n), label: `${n}%` }))}
        value={String(v)}
        onChange={(s) => setV(Number(s))}
      />
    </div>
  );
}

function RingTile() {
  const v = useRotation([18, 64, 92, 40] as const, 1700);
  return (
    <div className={cn(TILE_W, "grid place-items-center py-5")}>
      <ProgressRing value={v} from="#ff7a3d" to="#c13a8f" size={120} thickness={11}>
        <span className="font-display text-4xl tabular-nums text-ink">{v}</span>
      </ProgressRing>
    </div>
  );
}

const ZONES = [
  { to: 40, color: "#16a34a" },
  { to: 75, color: "#d97706" },
  { to: 100, color: "#dc2626" },
];

function GaugeDemo() {
  const [v, setV] = React.useState(58);
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Gauge value={v} zones={ZONES} unit="%" label="CPU load" />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Segmented
          options={[12, 35, 58, 82, 97].map((n) => ({ value: String(n), label: String(n) }))}
          value={String(v)}
          onChange={(s) => setV(Number(s))}
        />
        <Button size="sm" variant="secondary" onClick={() => setV(Math.round(Math.random() * 100))}>
          <Lightning size={14} weight="fill" /> Surge
        </Button>
      </div>
    </div>
  );
}

function GaugeTile() {
  const v = useRotation([22, 71, 94, 48] as const, 1900);
  return (
    <div className={cn(TILE_W, "grid place-items-center py-2")}>
      <Gauge value={v} zones={ZONES} unit="%" label="CPU load" className="max-w-[210px]" />
    </div>
  );
}

function IconDemo() {
  const [round, setRound] = React.useState(0);
  const kinds: StatusKind[] = ["success", "error", "warning", "info"];
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-8">
        {kinds.map((k) => (
          <div key={`${k}-${round}`} className="flex flex-col items-center gap-3">
            <StatusIcon status={k} size={72} filled={k === "info" || k === "warning"} />
            <span className={hint}>{k}</span>
          </div>
        ))}
      </div>
      <Button size="sm" variant="secondary" onClick={() => setRound((n) => n + 1)}>
        Replay
      </Button>
    </div>
  );
}

function IconTile() {
  const k = useRotation(["success", "error", "warning", "info"] as const, 2200);
  return (
    <div className={cn(TILE_W, "grid place-items-center py-6")}>
      <StatusIcon status={k} size={84} filled />
    </div>
  );
}

/* ─────────────────────────── data ─────────────────────────── */

const REVENUE = [
  { label: "Jan", values: [32, 18] },
  { label: "Feb", values: [41, 22] },
  { label: "Mar", values: [38, 27] },
  { label: "Apr", values: [52, 31] },
  { label: "May", values: [61, 35] },
  { label: "Jun", values: [58, 42] },
];

function BarDemo() {
  const [mode, setMode] = React.useState<"grouped" | "stacked">("grouped");
  return (
    <div className="w-full space-y-4">
      <BarChart
        data={REVENUE}
        series={["Subscriptions", "One-off"]}
        stacked={mode === "stacked"}
        format={(n) => `$${n}k`}
        height={280}
      />
      <div className="flex justify-center">
        <Segmented
          options={[
            { value: "grouped", label: "Grouped" },
            { value: "stacked", label: "Stacked" },
          ]}
          value={mode}
          onChange={setMode}
        />
      </div>
    </div>
  );
}

function BarTile() {
  return (
    <div className={TILE_W}>
      <BarChart data={REVENUE} series={["Subs", "One-off"]} height={170} format={(n) => `$${n}k`} />
    </div>
  );
}

const TRAFFIC = [
  { label: "Direct", value: 4210 },
  { label: "Search", value: 3180 },
  { label: "Social", value: 1840 },
  { label: "Referral", value: 960 },
  { label: "Email", value: 540 },
];

function DonutDemo() {
  return (
    <DonutChart
      data={TRAFFIC}
      total="Visits"
      format={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n))}
      size={240}
      thickness={30}
    />
  );
}

function DonutTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center py-2")}>
      <DonutChart
        data={TRAFFIC}
        legend={false}
        size={170}
        thickness={22}
        total="Visits"
        format={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n))}
      />
    </div>
  );
}

const SERIES: [string, number[], string][] = [
  ["Revenue", [12, 14, 13, 18, 17, 22, 21, 27, 26, 31], "$"],
  ["Churn", [4.2, 4.4, 4.1, 4.6, 5.0, 4.9, 5.4, 5.3, 5.9, 6.2], "%"],
  ["Active users", [220, 224, 223, 223, 222, 224, 223, 222, 224, 223], ""],
  ["Latency", [310, 290, 260, 240, 250, 210, 190, 180, 170, 150], "ms"],
];

function SparkDemo() {
  return (
    <div className="w-full max-w-lg divide-y divide-line rounded-2xl border border-line bg-surface">
      {SERIES.map(([name, data, unit]) => {
        const last = data[data.length - 1];
        return (
          <div key={name} className="flex items-center gap-4 px-4 py-3.5">
            <span className="w-28 text-sm text-ink-soft">{name}</span>
            <Sparkline
              data={data}
              className="flex-1"
              format={(n) => (unit === "$" ? `$${n}k` : `${n}${unit}`)}
            />
            <span className="w-16 text-right font-mono text-sm tabular-nums text-ink">
              {unit === "$" ? `$${last}k` : `${last}${unit}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SparkTile() {
  return (
    <div className={cn(TILE_W, "space-y-3")}>
      {SERIES.slice(0, 3).map(([name, data, unit]) => (
        <div key={name} className="flex items-center gap-3">
          <span className="w-16 text-xs text-muted">{name}</span>
          <Sparkline data={data} format={(n) => `${n}${unit}`} />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── navigation ─────────────────────────── */

const NAV = [
  { value: "home", label: "Home", icon: <House weight="fill" /> },
  { value: "work", label: "Work", icon: <Folder weight="fill" /> },
  { value: "notes", label: "Notes", icon: <FileText weight="fill" /> },
  { value: "about", label: "About", icon: <Users weight="fill" /> },
];

function NavDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <FloatingNav items={NAV} defaultValue="work" />
      <FloatingNav items={NAV.map((n) => ({ ...n, icon: undefined }))} defaultValue="notes" />
      <p className={hint}>Hover to preview · click to move</p>
    </div>
  );
}

function NavTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center py-8")}>
      <FloatingNav
        items={NAV.slice(0, 3).map((n) => ({ ...n, icon: undefined }))}
        defaultValue="work"
      />
    </div>
  );
}

const SECTIONS = [
  {
    title: "Workspace",
    items: [
      { value: "overview", label: "Overview", icon: <House /> },
      { value: "analytics", label: "Analytics", icon: <ChartBar />, badge: "3" },
      {
        value: "projects",
        label: "Projects",
        icon: <Folder />,
        children: [
          { value: "p-web", label: "Website" },
          { value: "p-app", label: "Mobile app" },
          { value: "p-api", label: "API" },
        ],
      },
      { value: "team", label: "Team", icon: <Users /> },
    ],
  },
  {
    title: "Build",
    items: [
      { value: "deploys", label: "Deploys", icon: <Rocket /> },
      { value: "logs", label: "Logs", icon: <Code /> },
      { value: "settings", label: "Settings", icon: <Gear /> },
    ],
  },
];

function SidebarDemo() {
  const [page, setPage] = React.useState("analytics");
  return (
    <div className="h-[460px] w-full overflow-hidden rounded-2xl border border-line">
      <div className="flex h-full">
        <Sidebar
          sections={SECTIONS}
          value={page}
          onChange={setPage}
          header={<span className="font-display text-xl text-ink">Northwind</span>}
          footer={
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-medium text-surface">
                AL
              </span>
              <span className="min-w-0 text-xs leading-tight">
                <span className="block truncate font-medium text-ink">Ada Lovelace</span>
                <span className="block truncate text-muted">ada@northwind.io</span>
              </span>
            </div>
          }
        />
        <div className="grid flex-1 place-items-center bg-surface-muted">
          <div className="text-center">
            <p className="font-display text-4xl capitalize tracking-tight text-ink">
              {page.replace("p-", "")}
            </p>
            <p className={cn(hint, "mt-2")}>Collapse the sidebar with the button</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarTile() {
  const [page, setPage] = React.useState("analytics");
  return (
    <div className={cn(TILE_W, "h-[210px] overflow-hidden rounded-xl border border-line")}>
      <Sidebar
        sections={SECTIONS.slice(0, 1)}
        value={page}
        onChange={setPage}
        defaultCollapsed
        className="h-full"
      />
    </div>
  );
}

const TOC = [
  { id: "toc-intro", label: "Introduction" },
  { id: "toc-install", label: "Installation" },
  { id: "toc-cli", label: "Using the CLI", depth: 2 as const },
  { id: "toc-manual", label: "Manual setup", depth: 2 as const },
  { id: "toc-theme", label: "Theming" },
  { id: "toc-ship", label: "Shipping" },
];

function TocDemo() {
  const scroller = React.useRef<HTMLDivElement>(null);
  return (
    <div className="grid h-[400px] w-full grid-cols-[1fr_190px] gap-6 overflow-hidden rounded-2xl border border-line bg-surface p-5">
      <div ref={scroller} className="overflow-y-auto pr-4 [scrollbar-width:thin]">
        {TOC.map((t) => (
          <section key={t.id} id={t.id} tabIndex={-1} className="pb-14 outline-none">
            <h3
              className={cn(
                "font-display tracking-tight text-ink",
                t.depth ? "text-xl" : "text-3xl",
              )}
            >
              {t.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Copy-owned components, one token file, and nothing hidden behind a package. Scroll
              this panel and the list on the right keeps track of where you are, with a rail that
              fills as you read.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Click an entry to glide to it. The current one is marked, and the marker moves with a
              spring.
            </p>
          </section>
        ))}
      </div>
      <TableOfContents items={TOC} scrollRoot={scroller} offset={12} />
    </div>
  );
}

function TocTile() {
  return (
    <div className={cn(TILE_W, "rounded-xl border border-line bg-surface p-4")}>
      <TableOfContents items={TOC.slice(0, 5)} offset={12} title="On this page" />
    </div>
  );
}

export const sectionsA: Record<string, Demo> = {
  "status-button": { Component: StatusButtonDemo, width: "md", Tile: StatusButtonTile },
  "copy-button": { Component: CopyDemo, width: "md", Tile: CopyTile },
  "split-button": { Component: SplitDemo, width: "md", height: 420, Tile: SplitTile },
  "autosize-textarea": { Component: TextareaDemo, width: "md", Tile: TextareaTile },
  combobox: { Component: ComboDemo, width: "sm", height: 420, Tile: ComboTile },
  "range-slider": { Component: RangeDemo, width: "md", Tile: RangeTile },
  "progress-ring": { Component: RingDemo, width: "lg", Tile: RingTile },
  gauge: { Component: GaugeDemo, width: "sm", Tile: GaugeTile },
  "status-icon": { Component: IconDemo, width: "lg", Tile: IconTile },
  "bar-chart": { Component: BarDemo, width: "lg", Tile: BarTile },
  "donut-chart": { Component: DonutDemo, width: "md", Tile: DonutTile },
  sparkline: { Component: SparkDemo, width: "md", Tile: SparkTile },
  "floating-nav": { Component: NavDemo, width: "md", Tile: NavTile },
  sidebar: { Component: SidebarDemo, width: "lg", Tile: SidebarTile },
  "table-of-contents": { Component: TocDemo, width: "lg", Tile: TocTile },
};
