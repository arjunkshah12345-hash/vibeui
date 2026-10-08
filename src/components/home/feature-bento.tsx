import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { Progress } from "@/components/ui/progress";
import { RollingText } from "@/components/ui/rolling-text";
import { Spotlight } from "@/components/ui/spotlight";
import { Switch } from "@/components/ui/switch";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { site } from "@/lib/site";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[13px] font-medium text-accent">{children}</p>;
}

/** A sample UI panel pinned to one palette with `.light` / `.dark`, whatever the page is set to. */
function Sample({ dark }: { dark?: boolean }) {
  return (
    <div
      className={
        (dark ? "dark " : "light ") +
        "flex-1 rounded-lg border border-line bg-canvas p-4 text-ink shadow-quiet"
      }
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
          {dark ? <Moon size={14} weight="fill" /> : <Sun size={14} weight="fill" />}
          {dark ? "Dark" : "Light"}
        </span>
        <Pill tone="sage" dot>Synced</Pill>
      </div>
      <Input className="mt-3 h-9" placeholder="Search…" readOnly />
      <Progress className="mt-4" label="Syncing tokens" value={dark ? 72 : 48} />
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <Button size="sm">Save</Button>
          <Button size="sm" variant="secondary">Cancel</Button>
        </div>
        <Switch defaultChecked aria-label={`${dark ? "Dark" : "Light"} sample switch`} />
      </div>
    </div>
  );
}

export function FeatureBento() {
  const card =
    "relative overflow-hidden rounded-xl border border-line bg-surface p-7 shadow-quiet";
  const h3 = "font-display text-[34px] leading-[1.05] tracking-[-0.01em] text-ink";
  const p = "mt-3 max-w-md text-[15px] leading-relaxed text-muted";

  return (
    <div className="grid gap-4 md:grid-cols-6">
      <BlurReveal className="min-w-0 md:col-span-4">
        <div className={card + " h-full"}>
          <Eyebrow>Copy-owned</Eyebrow>
          <h3 className={h3}>One command. Your repo. Every line.</h3>
          <p className={p}>
            No runtime package to fight. The CLI drops the file (and the siblings it imports) into your
            project, and from then on it is simply your code.
          </p>
          <CodeBlock
            className="mt-6"
            language="bash"
            code={`$ ${site.cli} add dialog dock command
✓ dialog   → src/components/ui/dialog.tsx
✓ dock     → src/components/ui/dock.tsx
✓ command  → src/components/ui/command.tsx

Peers to install: npm i @phosphor-icons/react`}
          />
        </div>
      </BlurReveal>

      <BlurReveal delay={80} className="min-w-0 md:col-span-2">
        <Spotlight className="h-full min-h-72 rounded-xl p-7">
          <div className="flex h-full flex-col">
            <Eyebrow>Signature motion</Eyebrow>
            <h3 className={h3}>
              Motion with{" "}
              <RollingText words={["restraint", "purpose", "craft", "taste"]} className="font-display" />
            </h3>
            <p className="mt-auto pt-10 text-[15px] leading-relaxed text-muted">
              Transform and opacity only, and reduced motion is respected. Move your cursor across
              this card.
            </p>
          </div>
        </Spotlight>
      </BlurReveal>

      <BlurReveal delay={80} className="min-w-0 md:col-span-3">
        <div className={card + " h-full"}>
          <Eyebrow>Real dark mode</Eyebrow>
          <h3 className={h3}>Two palettes, one set of tokens.</h3>
          <p className={p}>
            Every surface, border and pastel retints together. The panels below are the same
            components under <code className="font-mono text-[13px] text-ink-soft">.dark</code>.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Sample />
            <Sample dark />
          </div>
        </div>
      </BlurReveal>

      <BlurReveal delay={160} className="min-w-0 md:col-span-3">
        <div className={card + " h-full"}>
          <Eyebrow>Agent-ready</Eyebrow>
          <h3 className={h3}>Built for you and your agent.</h3>
          <p className={p}>
            A registry, a CLI and an MCP server mean Claude, Cursor or Codex can search, read and
            install components without guessing at APIs.
          </p>
          <CodeBlock
            className="mt-6"
            language="json"
            filename=".cursor/mcp.json"
            code={`{
  "mcpServers": {
    "vibeui": {
      "command": "node",
      "args": ["mcp/server.mjs"]
    }
  }
}`}
          />
        </div>
      </BlurReveal>
    </div>
  );
}
