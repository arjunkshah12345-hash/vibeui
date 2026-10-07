"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CaretDown,
  FolderOpen,
  DotsThree,
} from "@phosphor-icons/react";
import {
  Accordion,
  Alert,
  AspectRatio,
  Avatar,
  AvatarGroup,
  Banner,
  Breadcrumb,
  Button,
  Calendar,
  Callout,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  CodeBlock,
  ColorSwatch,
  Command,
  ComparisonBar,
  Dialog,
  DialogContent,
  DialogTrigger,
  DropdownMenu,
  Empty,
  Field,
  FileDrop,
  FlipCard,
  HoverCard,
  Input,
  Kbd,
  List,
  ListItem,
  Marquee,
  Meter,
  NotificationItem,
  NumberField,
  OtpField,
  Pagination,
  PasswordField,
  Pill,
  Popover,
  Progress,
  Quote,
  RadioGroup,
  RadioItem,
  Rating,
  RotatingCarousel,
  ScrollArea,
  SearchField,
  Segmented,
  Select,
  Separator,
  Sheet,
  Skeleton,
  Slider,
  Spinner,
  Spotlight,
  StackedCards,
  Stat,
  Stepper,
  Switch,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TagInput,
  TBody,
  TD,
  Textarea,
  TextLink,
  TH,
  THead,
  Timeline,
  ToastDemoButton,
  Toggle,
  ToggleGroup,
  Tooltip,
  TR,
} from "@/components/ui";
import { CraftSection } from "@/components/showcase/craft-section";
import { DemoFrame, ShowcaseSection } from "@/components/showcase/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#catalog", label: "Catalog" },
  { href: "#actions", label: "Actions" },
  { href: "#feedback", label: "Feedback" },
  { href: "#forms", label: "Forms" },
  { href: "#data", label: "Data" },
  { href: "#overlays", label: "Overlays" },
  { href: "#navigation", label: "Navigation" },
  { href: "#display", label: "Display" },
  { href: "#craft", label: "Craft" },
  { href: "#signature", label: "Signature" },
  { href: "#motion", label: "Motion" },
];

const catalog = [
  "Button", "Pill", "Chip", "Toggle", "Tooltip", "Kbd",
  "Alert", "Banner", "Callout", "Progress", "Meter", "Spinner", "Skeleton", "Toast", "Rating",
  "Input", "Textarea", "Select", "SearchField", "PasswordField", "NumberField", "OtpField",
  "Checkbox", "Radio", "Switch", "Slider", "TagInput", "FileDrop", "Field",
  "Card", "Stat", "Table", "List", "Avatar", "ColorSwatch", "CodeBlock", "Quote", "TextLink",
  "Dialog", "Sheet", "Popover", "DropdownMenu", "HoverCard", "Command",
  "Tabs", "Segmented", "Accordion", "Breadcrumb", "Pagination", "Stepper", "Timeline",
  "Calendar", "Empty", "Notification", "AspectRatio", "ScrollArea", "Separator",
  "RotatingCarousel", "FlipCard", "StackedCards", "Spotlight", "Marquee", "ComparisonBar",
  "MagneticButton", "ArrowFillButton", "FlipText", "Typewriter", "TextReveal",
  "TradingCard", "HoverImage", "Masonry", "Dock", "CircleMenu", "MagnetTabs",
  "BookFlip", "FolderPreview", "ScrollStack", "DottedGrid", "CountUp",
  "BlurReveal", "SplitShowcase", "OrbitRing", "JellyLoader",
];

const carouselItems = [
  { id: "1", meta: "01", title: "Spatial rhythm", description: "Whitespace does the hierarchy.", accent: "#1c1c1a" },
  { id: "2", meta: "02", title: "Quiet contrast", description: "Serif for brand. Sans for controls.", accent: "#1f6c9f" },
  { id: "3", meta: "03", title: "Scarce accents", description: "Pastels only for status.", accent: "#346538" },
  { id: "4", meta: "04", title: "Invisible polish", description: "Transform + opacity only.", accent: "#9f2f2d" },
  { id: "5", meta: "05", title: "Hairline borders", description: "Structure without weight.", accent: "#8a5a00" },
  { id: "6", meta: "06", title: "Own the source", description: "Copy. Retint. Ship.", accent: "#1c1c1a" },
];

export default function GalleryPage() {
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");
  const [notify, setNotify] = useState(true);
  const [plan, setPlan] = useState("pro");
  const [volume, setVolume] = useState(62);
  const [page, setPage] = useState(2);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState(["minimal", "tokens"]);
  const [filters, setFilters] = useState<string[]>(["dark"]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [qty, setQty] = useState(3);
  const [stars, setStars] = useState(4);
  const [catalogQ, setCatalogQ] = useState("");

  useEffect(() => {
    setDate(new Date(2026, 9, 7));
  }, []);

  const filteredCatalog = useMemo(
    () =>
      catalog.filter((c) =>
        c.toLowerCase().includes(catalogQ.toLowerCase()),
      ),
    [catalogQ],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-5 pb-28 pt-10">
      <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-44 shrink-0 overflow-y-auto lg:block">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
          On this page
        </p>
        <nav className="flex flex-col gap-0.5">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] px-2 py-1.5 text-[13px] text-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Separator className="my-5" />
        <p className="text-xs leading-relaxed text-faint">
          {catalog.length} components · light + dark · own the source
        </p>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="mb-2 max-w-2xl animate-fade-up">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
            Component gallery
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.03em] text-ink">
            {catalog.length} quiet pieces
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            A full catalog on one token language. Flip the theme in the header —
            every surface, pastel, and border retints together.
          </p>
        </header>

        <ShowcaseSection
          id="catalog"
          eyebrow="00"
          title="Catalog index"
          description="Search the library. Click a name to jump when it appears below."
        >
          <SearchField
            value={catalogQ}
            onChange={setCatalogQ}
            placeholder="Filter components…"
            className="mb-4 max-w-md"
          />
          <div className="flex flex-wrap gap-1.5">
            {filteredCatalog.map((name) => (
              <Pill key={name} tone="outline" className="normal-case tracking-normal">
                {name}
              </Pill>
            ))}
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="actions" eyebrow="01" title="Actions" description="Buttons, chips, toggles, tips.">
          <div className="grid gap-4 md:grid-cols-2">
            <DemoFrame label="Button">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="soft">Soft</Button>
                <Button size="sm">Small</Button>
                <Button disabled>Disabled</Button>
              </div>
            </DemoFrame>
            <DemoFrame label="Pill · Chip">
              <div className="mb-3 flex flex-wrap gap-2">
                <Pill tone="sage" dot>Live</Pill>
                <Pill tone="sky">Beta</Pill>
                <Pill tone="sand">Queued</Pill>
                <Pill tone="rose">Alert</Pill>
                <Pill tone="outline">Outline</Pill>
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip selected={filters.includes("dark")} onClick={() => setFilters((f) => f.includes("dark") ? f.filter((x) => x !== "dark") : [...f, "dark"])}>
                  Dark mode
                </Chip>
                <Chip selected={filters.includes("a11y")} onClick={() => setFilters((f) => f.includes("a11y") ? f.filter((x) => x !== "a11y") : [...f, "a11y"])}>
                  A11y
                </Chip>
                <Chip onRemove={() => undefined}>Removable</Chip>
              </div>
            </DemoFrame>
            <DemoFrame label="Toggle · ToggleGroup">
              <div className="mb-3 flex gap-2">
                <Toggle defaultPressed>Bold</Toggle>
                <Toggle>Italic</Toggle>
              </div>
              <ToggleGroup
                value={filters}
                onChange={setFilters}
                options={[
                  { value: "dark", label: "Dark" },
                  { value: "motion", label: "Motion" },
                  { value: "a11y", label: "A11y" },
                ]}
              />
            </DemoFrame>
            <DemoFrame label="Tooltip · Kbd · TextLink">
              <div className="flex flex-wrap items-center gap-3">
                <Tooltip content="Copy token path">
                  <Button variant="secondary" size="sm">Hover</Button>
                </Tooltip>
                <span className="text-sm text-muted">
                  <Kbd>⌘</Kbd> <Kbd>K</Kbd>
                </span>
                <TextLink href="#signature">Jump to carousel</TextLink>
              </div>
            </DemoFrame>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="feedback" eyebrow="02" title="Feedback" description="Status without shouting.">
          <div className="mb-4 space-y-3">
            <Banner dismissible action={<Button size="sm" variant="secondary">Update</Button>}>
              VibeUI 0.2 adds sheets, command, and calendar.
            </Banner>
            <div className="grid gap-3 md:grid-cols-2">
              <Alert title="Synced" tone="sage">Tokens match light and dark.</Alert>
              <Alert title="Draft" tone="sand">Publish when copy is ready.</Alert>
              <Alert title="Tip" tone="sky">Prefer hairlines over shadows.</Alert>
              <Alert title="Required" tone="rose">Connect theme before ship.</Alert>
            </div>
            <Callout title="Note">
              Callouts use a left ink rule — quieter than a filled alert.
            </Callout>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <DemoFrame label="Progress · Meter">
              <Progress value={68} label="Components" className="mb-4" />
              <Meter value={42} label="Tokens used" />
            </DemoFrame>
            <DemoFrame label="Spinner · Rating">
              <div className="mb-4 flex items-center gap-3">
                <Spinner />
                <Spinner size={22} />
              </div>
              <Rating value={stars} onChange={setStars} />
            </DemoFrame>
            <DemoFrame label="Toast · Skeleton">
              <ToastDemoButton />
              <div className="mt-4 flex gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </DemoFrame>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="forms" eyebrow="03" title="Forms" description="Every field on the same focus language.">
          <div className="grid gap-4 md:grid-cols-2">
            <DemoFrame label="Text fields">
              <div className="space-y-3">
                <Field label="Name"><Input defaultValue="VibeUI" /></Field>
                <Field label="Search"><SearchField value={search} onChange={setSearch} /></Field>
                <Field label="Password"><PasswordField placeholder="••••••••" /></Field>
                <Field label="Notes"><Textarea rows={2} placeholder="Notes…" /></Field>
              </div>
            </DemoFrame>
            <DemoFrame label="Specialized">
              <div className="space-y-4">
                <Field label="Framework">
                  <Select defaultValue="next" options={[
                    { value: "next", label: "Next.js" },
                    { value: "vite", label: "Vite" },
                  ]} />
                </Field>
                <Field label="Quantity"><NumberField value={qty} onChange={setQty} /></Field>
                <Field label="OTP"><OtpField /></Field>
                <Field label="Tags"><TagInput tags={tags} onChange={setTags} /></Field>
                <Field label="Volume"><Slider value={volume} onValueChange={setVolume} /></Field>
              </div>
            </DemoFrame>
            <DemoFrame label="Choices">
              <div className="space-y-3">
                <Checkbox label="Include dark tokens" defaultChecked />
                <Checkbox label="Export CSS variables" />
                <Separator />
                <RadioGroup value={plan} onValueChange={setPlan}>
                  <RadioItem value="free" label="Free" />
                  <RadioItem value="pro" label="Pro" />
                  <RadioItem value="team" label="Team" />
                </RadioGroup>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink">Notifications</span>
                  <Switch checked={notify} onCheckedChange={setNotify} aria-label="Notifications" />
                </div>
              </div>
            </DemoFrame>
            <DemoFrame label="FileDrop · Calendar">
              <FileDrop className="mb-4" onFiles={() => undefined} />
              <Calendar value={date} onChange={setDate} />
            </DemoFrame>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="data" eyebrow="04" title="Data & surfaces" description="Tables, lists, stats, cards.">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <Stat label="Components" value={String(catalog.length)} delta="Full catalog" trend="up" />
            <Stat label="Themes" value="2" delta="Light + dark" trend="neutral" />
            <Stat label="Install" value="0kb" delta="Copy-owned" trend="up" />
          </div>
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <Card interactive>
              <CardHeader>
                <Pill tone="sky" className="mb-2 w-fit">New</Pill>
                <CardTitle>Spatial card</CardTitle>
                <CardDescription>Quiet hover lift. No glow.</CardDescription>
              </CardHeader>
              <CardFooter><Button size="sm" variant="ghost">Open</Button></CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>Avatar stacks with canvas rings.</CardDescription>
              </CardHeader>
              <AvatarGroup>
                <Avatar fallback="MK" size="sm" />
                <Avatar fallback="RS" size="sm" />
                <Avatar fallback="AL" size="sm" />
              </AvatarGroup>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tokens</CardTitle>
                <CardDescription>Swatches from the active theme.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ColorSwatch color="var(--ink)" label="Ink" value="--ink" />
                <ColorSwatch color="var(--canvas)" label="Canvas" value="--canvas" />
              </CardContent>
            </Card>
          </div>
          <DemoFrame label="Table" className="mb-4">
            <Table>
              <THead>
                <TR>
                  <TH>Component</TH>
                  <TH>Kind</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                <TR><TD>Button</TD><TD>Action</TD><TD><Pill tone="sage">Stable</Pill></TD></TR>
                <TR><TD>Sheet</TD><TD>Overlay</TD><TD><Pill tone="sky">New</Pill></TD></TR>
                <TR><TD>Carousel</TD><TD>Signature</TD><TD><Pill tone="sand">Featured</Pill></TD></TR>
              </TBody>
            </Table>
          </DemoFrame>
          <div className="grid gap-4 md:grid-cols-2">
            <DemoFrame label="List">
              <List>
                <ListItem title="Design tokens" description="globals.css" trailing={<Pill tone="outline">22</Pill>} />
                <ListItem title="Gallery route" description="/gallery" trailing={<Pill tone="sage">Live</Pill>} />
                <ListItem title="Theme toggle" description="Header" trailing={<Pill tone="sky">Dark</Pill>} />
              </List>
            </DemoFrame>
            <DemoFrame label="Notifications · ScrollArea">
              <ScrollArea maxHeight={200}>
                <div className="space-y-2 p-2">
                  <NotificationItem unread title="Draft published" body="Gallery is live on preview." time="2m" />
                  <NotificationItem title="Theme synced" body="Dark tokens updated." time="1h" />
                  <NotificationItem title="New component" body="FlipCard landed." time="3h" />
                </div>
              </ScrollArea>
            </DemoFrame>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <DemoFrame label="CodeBlock">
              <CodeBlock
                language="tsx"
                code={`import { Button } from "@/components/ui"\n\n<Button>Primary</Button>`}
              />
            </DemoFrame>
            <DemoFrame label="Quote · AspectRatio">
              <Quote cite="VibeUI principles" className="mb-4">
                Restraint first. If removing a shadow does not hurt clarity, remove it.
              </Quote>
              <AspectRatio ratio={16 / 7} className="rounded-[var(--radius-md)] border border-line bg-surface-muted">
                <div className="flex h-full items-center justify-center text-xs text-muted">
                  16∶7 media frame
                </div>
              </AspectRatio>
            </DemoFrame>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="overlays" eyebrow="05" title="Overlays" description="Dialogs, sheets, menus, command.">
          <div className="grid gap-4 md:grid-cols-2">
            <DemoFrame label="Dialog · Sheet · Popover">
              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger className={cn(buttonVariants({ size: "sm" }))}>
                    Dialog
                  </DialogTrigger>
                  <DialogContent title="Publish" description="Make the catalog public.">
                    <Button size="sm">Confirm</Button>
                  </DialogContent>
                </Dialog>
                <Sheet
                  title="Inspector"
                  trigger={<Button size="sm" variant="secondary">Sheet</Button>}
                >
                  <p className="text-sm text-muted">
                    Side panels for settings, filters, and detail views.
                  </p>
                </Sheet>
                <Popover
                  trigger={<Button size="sm" variant="ghost">Popover</Button>}
                >
                  <p className="text-sm text-muted">Anchored content without a modal.</p>
                </Popover>
              </div>
            </DemoFrame>
            <DemoFrame label="Dropdown · HoverCard">
              <div className="flex flex-wrap items-center gap-4">
                <DropdownMenu
                  trigger={
                    <Button size="sm" variant="secondary">
                      Menu <CaretDown size={12} weight="bold" />
                    </Button>
                  }
                  items={[
                    { label: "Duplicate" },
                    { label: "Export" },
                    { separator: true, label: "" },
                    { label: "Delete", danger: true },
                  ]}
                />
                <HoverCard
                  trigger={
                    <button type="button" className="text-sm font-medium text-ink underline decoration-line-strong underline-offset-4">
                      Maya Kline
                    </button>
                  }
                >
                  <div className="flex items-center gap-3">
                    <Avatar fallback="MK" />
                    <div>
                      <p className="text-sm font-medium text-ink">Maya Kline</p>
                      <p className="text-xs text-muted">Design systems</p>
                    </div>
                  </div>
                </HoverCard>
                <Button size="icon" variant="ghost" className="size-8" aria-label="More">
                  <DotsThree size={18} weight="bold" />
                </Button>
              </div>
            </DemoFrame>
            <DemoFrame label="Command" className="md:col-span-2">
              <Command
                items={[
                  { id: "1", label: "Open gallery", hint: "G", group: "Navigate" },
                  { id: "2", label: "Toggle theme", hint: "T", group: "Navigate" },
                  { id: "3", label: "Copy Button", group: "Components" },
                  { id: "4", label: "Copy Carousel", group: "Components" },
                ]}
              />
            </DemoFrame>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="navigation" eyebrow="06" title="Navigation" description="Tabs, steps, breadcrumbs, pages.">
          <div className="grid gap-4 md:grid-cols-2">
            <DemoFrame label="Breadcrumb · Pagination">
              <Breadcrumb
                className="mb-4"
                items={[
                  { label: "VibeUI", href: "/" },
                  { label: "Gallery", href: "/gallery" },
                  { label: "Navigation" },
                ]}
              />
              <Pagination page={page} totalPages={8} onPageChange={setPage} />
            </DemoFrame>
            <DemoFrame label="Tabs · Segmented">
              <Tabs defaultValue="a" className="mb-4">
                <TabsList>
                  <TabsTrigger value="a">Overview</TabsTrigger>
                  <TabsTrigger value="b">Tokens</TabsTrigger>
                </TabsList>
                <TabsContent value="a">
                  <p className="text-sm text-muted">Calm selection chrome.</p>
                </TabsContent>
                <TabsContent value="b">
                  <p className="text-sm text-muted">CSS variables in globals.css.</p>
                </TabsContent>
              </Tabs>
              <Segmented
                value={density}
                onChange={setDensity}
                options={[
                  { value: "compact", label: "Compact" },
                  { value: "comfortable", label: "Comfortable" },
                ]}
              />
            </DemoFrame>
            <DemoFrame label="Stepper">
              <Stepper
                current={1}
                steps={[
                  { label: "Tokens", description: "Define canvas and ink" },
                  { label: "Primitives", description: "Ship the everyday kit" },
                  { label: "Signature", description: "Add carousel + motion" },
                ]}
              />
            </DemoFrame>
            <DemoFrame label="Timeline · Accordion">
              <Timeline
                className="mb-4"
                items={[
                  { title: "Primitives", time: "Week 1", body: "Buttons, forms, cards." },
                  { title: "Overlays", time: "Week 2", body: "Dialog, sheet, command." },
                  { title: "Signature", time: "Week 3", body: "3D carousel + flip." },
                ]}
              />
              <Accordion
                items={[
                  { id: "1", title: "Dark mode?", content: ".dark class swaps CSS variables. ThemeScript prevents flash." },
                  { id: "2", title: "Own the code?", content: "Copy components into your repo — shadcn model." },
                ]}
              />
            </DemoFrame>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="display" eyebrow="07" title="Display & comparison" description="Editorial and product surfaces.">
          <div className="grid gap-4 md:grid-cols-2">
            <DemoFrame label="ComparisonBar">
              <ComparisonBar left="Light" right="Dark" leftValue={58} rightValue={42} />
            </DemoFrame>
            <DemoFrame label="Empty">
              <Empty
                icon={<FolderOpen size={18} weight="bold" />}
                title="Nothing selected"
                description="Pick a component from the catalog index."
                action={<Button size="sm" variant="secondary">Browse</Button>}
              />
            </DemoFrame>
          </div>
        </ShowcaseSection>

        <CraftSection />

        <ShowcaseSection id="signature" eyebrow="09 — Signature" title="Signature pieces" description="The memorable ones — still restrained.">
          <DemoFrame className="mb-4 overflow-hidden bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-muted)_100%)]">
            <RotatingCarousel items={carouselItems} />
          </DemoFrame>
          <div className="grid gap-4 md:grid-cols-2">
            <DemoFrame label="FlipCard">
              <FlipCard
                front={
                  <>
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">Front</p>
                    <p className="mt-2 text-sm font-medium text-ink">Click to flip</p>
                    <p className="mt-1 text-xs text-muted">3D rotateY with preserve-3d.</p>
                  </>
                }
                back={
                  <>
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">Back</p>
                    <p className="mt-2 text-sm font-medium text-ink">Same tokens</p>
                    <p className="mt-1 text-xs text-muted">Works in light and dark.</p>
                  </>
                }
              />
            </DemoFrame>
            <DemoFrame label="StackedCards">
              <StackedCards
                items={[
                  { title: "Primary layer", body: "Front-most card stays sharp." },
                  { title: "Depth cue", body: "Scale + opacity for stack." },
                  { title: "Third", body: "Quiet background presence." },
                ]}
              />
            </DemoFrame>
            <DemoFrame label="Spotlight" className="md:col-span-2">
              <Spotlight>
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                  Spotlight
                </p>
                <p className="mt-2 text-lg font-medium tracking-[-0.02em] text-ink">
                  Move your cursor — the light follows.
                </p>
                <p className="mt-1 max-w-md text-sm text-muted">
                  A soft radial that respects the ink token. No neon glow.
                </p>
              </Spotlight>
            </DemoFrame>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="motion" eyebrow="10" title="Quiet motion" description="Marquee atmosphere.">
          <Marquee className="rounded-[var(--radius-lg)] border border-line">
            {catalog.slice(0, 12).map((name) => (
              <span key={name} className="whitespace-nowrap text-sm font-medium text-ink-soft">
                {name}
                <span className="ml-8 text-faint">·</span>
              </span>
            ))}
          </Marquee>
        </ShowcaseSection>
      </main>
    </div>
  );
}
