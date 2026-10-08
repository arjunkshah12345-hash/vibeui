"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { Progress } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/segmented";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Swatch = {
  id: string;
  label: string;
  light: [string, string];
  dark: [string, string];
};

const swatches: Swatch[] = [
  { id: "vermilion", label: "Vermilion", light: ["#d9480f", "#ffffff"], dark: ["#f4f2ee", "#14130f"] },
  { id: "indigo", label: "Indigo", light: ["#4f46e5", "#ffffff"], dark: ["#9aa2ff", "#0b0d33"] },
  { id: "emerald", label: "Emerald", light: ["#0f8a5f", "#ffffff"], dark: ["#4fd9a0", "#03271a"] },
  { id: "rose", label: "Rose", light: ["#d6336c", "#ffffff"], dark: ["#ff8fb3", "#3a0014"] },
  { id: "ink", label: "Ink", light: ["#1b1a17", "#f8f7f4"], dark: ["#f4f2ee", "#14130f"] },
];

/** Live token playground: the controls rewrite CSS variables on a scoped container. */
export function Playground() {
  const [swatch, setSwatch] = React.useState("indigo");
  const [radius, setRadius] = React.useState(12);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [notify, setNotify] = React.useState(true);
  const [progress, setProgress] = React.useState(64);

  const current = swatches.find((s) => s.id === swatch) ?? swatches[0];
  const [accent, ink] = theme === "dark" ? current.dark : current.light;

  const vars = {
    "--accent": accent,
    "--accent-ink": ink,
    "--accent-soft": `color-mix(in oklab, ${accent} 12%, transparent)`,
    "--ring": `color-mix(in oklab, ${accent} 30%, transparent)`,
    "--radius-sm": `${Math.round(radius * 0.67)}px`,
    "--radius-md": `${radius}px`,
    "--radius-lg": `${Math.round(radius * 1.33)}px`,
    "--radius-xl": `${Math.round(radius * 1.8)}px`,
  } as React.CSSProperties;

  const css = `:root {
  --accent: ${accent};
  --accent-ink: ${ink};
  --radius-md: ${radius}px;
}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* Controls */}
      <div className="flex flex-col gap-7 rounded-xl border border-line bg-surface p-6 shadow-quiet">
        <div>
          <p className="mb-3 text-[13px] font-medium text-ink">Accent</p>
          <div className="flex gap-2.5" role="radiogroup" aria-label="Accent color">
            {swatches.map((s) => {
              const c = (theme === "dark" ? s.dark : s.light)[0];
              const on = s.id === swatch;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={s.label}
                  title={s.label}
                  onClick={() => setSwatch(s.id)}
                  className={cn(
                    "relative size-9 rounded-full transition-[transform,box-shadow] duration-300 ease-spring hover:scale-110 active:scale-95",
                    on && "scale-110 shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--ink)]",
                  )}
                  style={{ background: c }}
                />
              );
            })}
          </div>
        </div>

        <Slider label="Corner radius" min={0} max={28} value={radius} onValueChange={setRadius} />

        <div>
          <p className="mb-3 text-[13px] font-medium text-ink">Theme</p>
          <Segmented
            value={theme}
            onChange={setTheme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </div>

        <div className="mt-auto">
          <CodeBlock language="css" filename="globals.css" code={css} />
        </div>
      </div>

      {/* Scoped preview: .light / .dark pin the palette, inline vars retint it. */}
      <div
        style={vars}
        className={cn(
          theme === "dark" ? "dark" : "light",
          "flex items-center rounded-xl border border-line bg-canvas p-5 text-ink shadow-quiet transition-colors duration-500 sm:p-7",
        )}
      >
        <div className="grid w-full gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-surface p-5 shadow-quiet">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-medium tracking-[-0.01em]">Weekly digest</p>
              <Pill tone="accent" dot pulse>
                Live
              </Pill>
            </div>
            <p className="mt-1 text-[13px] text-muted">Sent every Monday at 9:00.</p>
            <Input className="mt-4" placeholder="you@studio.com" readOnly />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm">Subscribe</Button>
              <Button size="sm" variant="accent">
                Upgrade
              </Button>
              <Button size="sm" variant="secondary">
                Later
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface p-5 shadow-quiet">
            <Tabs defaultValue="a">
              <TabsList>
                <TabsTrigger value="a">Overview</TabsTrigger>
                <TabsTrigger value="b">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="space-y-4">
                <Progress label="Storage used" value={progress} />
                <Slider label="Adjust" value={progress} onValueChange={setProgress} />
              </TabsContent>
              <TabsContent value="b">
                <p className="text-sm text-muted">Pro plan, renews on the 1st.</p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4 rounded-lg border border-line bg-surface p-5 shadow-quiet md:col-span-2 md:flex md:items-center md:justify-between md:space-y-0">
            <div className="space-y-3">
              <Checkbox label="Email me about new releases" defaultChecked />
              <Checkbox label="Include a changelog summary" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink-soft">Notifications</span>
              <Switch checked={notify} onCheckedChange={setNotify} aria-label="Notifications" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
