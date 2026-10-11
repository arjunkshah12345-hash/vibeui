import type { Metadata } from "next";
import { Code, DocHeader, DocTable, H2, H3, Note, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CLI",
  description:
    "Every VibeUI CLI command, flag and exit code, with examples for people, scripts and CI.",
};

export default function Cli() {
  return (
    <>
      <DocHeader eyebrow="Tooling" title="CLI">
        One small command-line tool for browsing the registry and copying components, built to be
        pleasant for people and parseable for scripts.
      </DocHeader>

      <H2 id="run">Running it</H2>
      <P>
        The CLI is published on npm as <Code>@agents-npm-packages/vibeui</Code>. Nothing is installed globally, and{" "}
        <Code>npx</Code> caches the download.
      </P>
      <CodeBlock language="bash" code={`${site.cli} --help`} />
      <P>
        Inside a clone of the repo, the same binary is <Code>node bin/vibeui.mjs</Code> or{" "}
        <Code>npm run vibeui</Code>. The examples below say <Code>vibeui</Code> for short.
      </P>

      <H2 id="commands">Commands</H2>
      <DocTable
        head={["Command", "What it does"]}
        rows={[
          ["list", "Lists every component with category, description and dependencies."],
          [
            "search <query>",
            "Searches names, descriptions and tags. Multiple words must all match.",
          ],
          ["get <name>", "Shows one component's metadata, including its API."],
          ["add <name…>", "Copies components, plus the siblings they import, into a directory."],
          ["init", "Writes the token file, utils.ts and a short integration guide."],
          ["categories", "Lists the shelves and how many components each holds."],
          ["registry", "Regenerates registry/components.json from the source files."],
          ["guide", "Prints the install guide used by agents."],
          ["mcp", "Starts the MCP server over stdio."],
        ]}
      />

      <H2 id="add">add</H2>
      <CodeBlock
        language="bash"
        code={`vibeui add <name...> [--dir <path>] [--tokens] [--no-utils]`}
      />
      <DocTable
        head={["Flag", "Default", "Effect"]}
        rows={[
          ["--dir <path>", "./src/components/ui", "Where to write the component files."],
          [
            "--tokens",
            "off",
            "Also copy the token file to vibeui.tokens.css, three folders above --dir.",
          ],
          ["--no-utils", "off", "Skip creating src/lib/utils.ts (otherwise written if missing)."],
        ]}
      />
      <P>
        Names are kebab-case and case-insensitive (<Code>RotatingCarousel</Code> and{" "}
        <Code>rotating-carousel</Code> both work). Each added file is printed with its path, and
        files that were only added because another component imports them are marked.
      </P>
      <CodeBlock
        language="bash"
        code={`$ vibeui add footer-cta --dir ./src/components/ui
✓ footer-cta → /app/src/components/ui/footer-cta.tsx
✓ button → /app/src/components/ui/button.tsx  (required by another component)
✓ spinner → /app/src/components/ui/spinner.tsx  (required by another component)
✓ utils → /app/src/lib/utils.ts

Peers to install: npm i clsx tailwind-merge class-variance-authority`}
      />
      <Note title="It overwrites">
        <Code>add</Code> replaces an existing file of the same name. Commit first if you have local
        edits, then review the diff.
      </Note>

      <H2 id="init">init</H2>
      <CodeBlock language="bash" code={`vibeui init [--dir <path>]`} />
      <P>
        Creates <Code>src/components/ui/</Code> and <Code>src/lib/</Code>, writes{" "}
        <Code>src/lib/utils.ts</Code> and <Code>vibeui.tokens.css</Code> if they do not exist, and
        always refreshes <Code>VIBEUI.md</Code> (a short guide for you or your agent). It never
        overwrites your existing utils or tokens.
      </P>

      <H2 id="read">Reading the registry</H2>
      <CodeBlock
        language="bash"
        code={`# everything in a category
vibeui list --category forms

# find by need
vibeui search "date picker"

# metadata, then source
vibeui get calendar
vibeui get calendar --source`}
      />

      <H2 id="json">Structured output</H2>
      <P>
        Add <Code>--json</Code> to <Code>list</Code>, <Code>search</Code>, <Code>get</Code> and{" "}
        <Code>categories</Code> for machine-readable output. Pipe it to <Code>jq</Code> or read it
        from a script.
      </P>
      <CodeBlock
        language="bash"
        code={`vibeui search carousel --json | jq -r '.[].name'
vibeui get dialog --json | jq '.api[0].props[] | {name, type}'`}
      />

      <H2 id="exit-codes">Exit codes</H2>
      <DocTable
        head={["Code", "Meaning"]}
        rows={[
          ["0", "Success."],
          ["1", "Unknown component, missing arguments, or at least one add failed."],
        ]}
      />
      <H3>In CI</H3>
      <P>
        Because <Code>add</Code> exits non-zero on failure, it is safe to run in a script or a
        bootstrap step. Pin the version for reproducible installs:
      </P>
      <CodeBlock
        language="bash"
        code={`npx @agents-npm-packages/vibeui@0.3.0 add button dialog --dir ./src/components/ui`}
      />
    </>
  );
}
