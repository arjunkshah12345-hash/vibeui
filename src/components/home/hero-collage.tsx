"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Cube, MagnifyingGlass, Moon, Palette } from "@phosphor-icons/react";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command } from "@/components/ui/command";
import { Dock } from "@/components/ui/dock";
import { FooterSimple } from "@/components/ui/footer-simple";
import { Input } from "@/components/ui/input";
import { NotificationItem } from "@/components/ui/notification";
import { Pill } from "@/components/ui/pill";
import { Progress } from "@/components/ui/progress";
import { Stat } from "@/components/ui/stat";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const card = "rounded-lg border border-line bg-surface shadow-quiet";

const ease = [0.16, 1, 0.3, 1] as const;

function Piece({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: delay / 1000, ease }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Expanded live collage of real library components under the hero.
 * Everything here is interactive: type, pick a date, flip the switch.
 */
export function HeroCollage() {
  const [date, setDate] = React.useState(() => new Date(2026, 9, 14));
  const [notify, setNotify] = React.useState(true);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface-muted/40">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" />
      <div className="relative mx-auto grid gap-4 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-5 lg:p-8">
        {/* left column */}
        <div className="flex flex-col gap-4 lg:col-span-4 lg:gap-5">
          <Piece delay={40} className={cn(card, "p-5")}>
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">Shipping 0.2</p>
              <Pill tone="sage" dot>
                On track
              </Pill>
            </div>
            <p className="mt-1 text-[13px] text-muted">128 components · 15 docs pages</p>
            <AvatarGroup max={4} className="mt-4">
              <Avatar fallback="Maya Kline" />
              <Avatar fallback="Rishi Shah" />
              <Avatar fallback="Ana López" />
              <Avatar fallback="Sam Ito" />
              <Avatar fallback="Jo Park" />
            </AvatarGroup>
            <Progress className="mt-4" label="Docs coverage" value={92} />
          </Piece>

          <Piece delay={120} className="hidden sm:block">
            <Calendar value={date} onChange={setDate} defaultMonth={new Date(2026, 9, 1)} />
          </Piece>

          <Piece delay={200} className={cn(card, "overflow-hidden")}>
            <FooterSimple
              className="border-t-0"
              brand={<span className="font-display text-xl tracking-[-0.01em]">VibeUI</span>}
              links={[
                { label: "Components", href: "/components" },
                { label: "Docs", href: "/docs" },
                { label: "GitHub", href: "https://github.com/arjunkshah12345-hash/vibeui" },
              ]}
              note="MIT · yours to keep"
            />
          </Piece>
        </div>

        {/* center */}
        <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
          <Piece delay={80}>
            <Command
              className="w-full"
              items={[
                {
                  id: "components",
                  label: "Go to components",
                  hint: "G C",
                  group: "Navigate",
                  icon: <MagnifyingGlass size={14} weight="bold" />,
                },
                {
                  id: "theme",
                  label: "Toggle theme",
                  hint: "T",
                  group: "Navigate",
                  icon: <Moon size={14} weight="bold" />,
                },
                {
                  id: "tokens",
                  label: "Open the token file",
                  group: "Navigate",
                  icon: <Palette size={14} weight="bold" />,
                },
                {
                  id: "button",
                  label: "Copy Button source",
                  group: "Components",
                  icon: <Cube size={14} weight="bold" />,
                },
                {
                  id: "dialog",
                  label: "Copy Dialog source",
                  group: "Components",
                  icon: <Cube size={14} weight="bold" />,
                },
              ]}
            />
          </Piece>

          <Piece delay={160} className={cn(card, "p-1.5")}>
            <NotificationItem
              unread
              title="Draft published"
              body="Your changelog is live on the preview URL."
              time="2m"
            />
            <NotificationItem
              unread
              title="New comment"
              body="Maya left a note on the pricing section."
              time="1h"
            />
            <NotificationItem title="Theme synced" body="Dark tokens were updated." time="3h" />
          </Piece>

          <Piece delay={240} className={cn(card, "p-4")}>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-3 text-[13px] text-muted">
                A quiet interface built from the same tokens as every other shelf.
              </TabsContent>
              <TabsContent value="activity" className="pt-3 text-[13px] text-muted">
                Three publishes this week. One open review.
              </TabsContent>
              <TabsContent value="settings" className="pt-3 text-[13px] text-muted">
                Accent is monochrome. Radius and type stay yours.
              </TabsContent>
            </Tabs>
          </Piece>

          <Piece delay={300} className="flex justify-center py-2">
            <Dock
              items={[
                { id: "home", label: "Home", icon: <Cube size={18} weight="bold" /> },
                { id: "search", label: "Search", icon: <MagnifyingGlass size={18} weight="bold" /> },
                { id: "theme", label: "Theme", icon: <Moon size={18} weight="bold" /> },
                { id: "palette", label: "Tokens", icon: <Palette size={18} weight="bold" /> },
              ]}
            />
          </Piece>
        </div>

        {/* right */}
        <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-3 lg:gap-5">
          <Piece delay={100} className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <Stat label="Components" value="128" delta="12 new" trend="up" />
            <Stat label="Runtime" value="0 kb" delta="Copy-owned" trend="neutral" />
          </Piece>

          <Piece delay={180} className={cn(card, "p-5")}>
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">Weekly digest</p>
              <Pill tone="accent" dot pulse>
                Live
              </Pill>
            </div>
            <p className="mt-1 text-[13px] text-muted">Sent every Monday at 9:00.</p>
            <Input className="mt-4" placeholder="you@studio.com" />
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5 text-sm text-ink-soft">
                <Switch checked={notify} onCheckedChange={setNotify} aria-label="Notifications" />
                Notify me
              </span>
              <Button size="sm">Subscribe</Button>
            </div>
          </Piece>

          <Piece delay={260}>
            <Alert tone="sage" title="Tokens synced">
              Accent and radius updated across 128 components.
            </Alert>
          </Piece>

          {/* Hero-style section card */}
          <Piece delay={320} className={cn(card, "overflow-hidden p-6")}>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Hero</p>
            <h3 className="mt-2 font-display text-[28px] leading-[1.05] tracking-[-0.02em] text-ink">
              Components with taste
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              One line, one CTA, live pieces underneath — the same pattern this page uses.
            </p>
            <Button size="sm" className="mt-4">
              Browse library
            </Button>
          </Piece>
        </div>
      </div>
    </div>
  );
}
