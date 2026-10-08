import type { Metadata } from "next";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Code, DocHeader, H2, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CLI",
  description: "Search, read and add VibeUI components from the terminal.",
};

const commands: [string, string][] = [
  ["list [--category <cat>]", "List every component, optionally by category."],
  ["search <query>", "Search names, descriptions and tags."],
  ["get <name> [--source]", "Show metadata, or print the full source."],
  ["add <name…> [--dir <path>]", "Copy components (and the siblings they import) into a directory."],
  ["init [--dir <path>]", "Create utils.ts, the tokens file and a short integration guide."],
  ["categories", "List the categories and how many components each holds."],
];

export default function Cli() {
  return (
    <>
      <DocHeader eyebrow="Tooling" title="CLI">
        One small command-line tool for browsing the registry and copying components, built to be
        pleasant for people and parseable for scripts.
      </DocHeader>

      <H2 id="run">Running it</H2>
      <P>
        VibeUI is not on npm yet, so run it straight from GitHub. Nothing is installed globally.
      </P>
      <CodeBlock language="bash" code={`${site.cli} --help`} />

      <H2 id="commands">Commands</H2>
      <div className="mt-5">
        <Table>
          <THead>
            <TR>
              <TH>Command</TH>
              <TH>What it does</TH>
            </TR>
          </THead>
          <TBody>
            {commands.map(([c, d]) => (
              <TR key={c}>
                <TD className="whitespace-nowrap font-mono text-[12.5px] text-ink">{c}</TD>
                <TD>{d}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>

      <H2 id="examples">Examples</H2>
      <CodeBlock
        language="bash"
        code={`# find something
${site.cli} search carousel

# read before you copy
${site.cli} get rotating-carousel --source

# copy two components and everything they import
${site.cli} add dialog trading-card --dir ./src/components/ui`}
      />

      <H2 id="json">Structured output</H2>
      <P>
        Pass <Code>--json</Code> to <Code>list</Code>, <Code>search</Code>, <Code>get</Code> or{" "}
        <Code>categories</Code> to get machine-readable output. Each component entry includes its{" "}
        <Code>dependencies</Code> (npm peers) and <Code>registryDependencies</Code> (sibling
        components), which is what <Code>add</Code> uses to resolve imports.
      </P>
      <CodeBlock
        language="json"
        code={`{
  "name": "footer-cta",
  "category": "footers",
  "dependencies": [],
  "registryDependencies": ["button"],
  "client": false
}`}
      />
    </>
  );
}
