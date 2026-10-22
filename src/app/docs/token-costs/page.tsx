import type { Metadata } from "next";
import { Code, DocHeader, DocLink, DocTable, H2, List, Note, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Token costs with coding agents",
  description:
    "Use VibeUI with Claude Code, Cursor or Codex without burning tokens: fetch one component at a time, install instead of pasting, and trim build output, tool results and long sessions.",
};

export default function TokenCosts() {
  return (
    <>
      <DocHeader eyebrow="Tooling" title="Token costs with coding agents">
        Building UI with an agent is token-hungry: component sources, build logs and screenshots all
        land in the context and are re-sent on every turn. These habits keep the bill down without
        changing what you build.
      </DocHeader>

      <H2 id="one-at-a-time">Fetch one component at a time</H2>
      <P>
        Ask the agent to search first and read only what it will use. Over MCP that is{" "}
        <Code>search_components</Code> followed by <Code>get_component</Code> for the one match, rather than{" "}
        <Code>list_components</Code> and every source. From the shell:
      </P>
      <CodeBlock code={`${site.cli} search "date picker" --json\n${site.cli} get calendar --source`} language="bash" />

      <H2 id="install-dont-paste">Install instead of pasting</H2>
      <P>
        <Code>add_component</Code> (or <Code>{`${site.cli} add <name>`}</Code>) writes the file straight into your
        project. The agent does not need to read the source back into the conversation to use it; it only
        needs the import path and props.
      </P>

      <H2 id="build-output">Trim build and lint output</H2>
      <P>
        A failing <Code>next build</Code> can print hundreds of lines to report one type error. Run the narrow
        check (<Code>tsc --noEmit</Code> on one file, or the single failing test), and consider a shell output
        filter such as <DocLink href="https://github.com/rtk-ai/rtk">RTK</DocLink>, which runs common commands
        through output filters before the agent reads them.
      </P>

      <H2 id="large-results">Shrink large file reads and tool results</H2>
      <P>
        When an agent must read something big, a long log, a large file or a bulky MCP result, a context
        compression tool can cut it before it reaches the model:
      </P>
      <List>
        <li>
          <DocLink href="https://www.supercompress.dev/?utm_source=vibeui&utm_medium=referral&utm_campaign=docs">SuperCompress</DocLink>{" "}
          is hosted and question-aware: it keeps the original lines that answer the current question, word for
          word, so class names, props and paths survive. It installs into Claude Code, Cursor, Codex and other
          agents with one command.
        </li>
        <li>
          <DocLink href="https://github.com/chopratejas/headroom">Headroom</DocLink> does similar work locally and is
          open source.
        </li>
        <li>
          <DocLink href="https://github.com/mksglu/context-mode">Context Mode</DocLink> keeps large MCP results out of
          the conversation and lets the agent search them instead.
        </li>
      </List>
      <CodeBlock code="npm install -g supercompress-proxy && supercompress setup" language="bash" />

      <H2 id="sessions">Keep sessions short</H2>
      <P>
        Every turn re-sends the history, including old screenshots. Crop screenshots to the region that matters,
        run <Code>/compact</Code> between phases (layout, then states, then polish), and start a fresh session once a
        screen is done.
      </P>

      <H2 id="summary">At a glance</H2>
      <DocTable
        head={["Where tokens go", "What to do"]}
        rows={[
          ["Browsing the catalog", "search_components, then get_component for one match"],
          ["Component source in chat", "add_component writes the file; the agent uses the import"],
          ["Build and lint output", "Run the narrow check; filter shell output (RTK)"],
          ["Large logs, files, MCP results", "Context compression (SuperCompress, Headroom, Context Mode)"],
          ["Long sessions and screenshots", "Crop, /compact between phases, fresh sessions per screen"],
        ]}
      />

      <Note title="Disclosure">
        VibeUI and SuperCompress are made by the same author. The other tools are listed from their own
        documentation. Measure any tool on your own tasks before relying on it.
      </Note>
    </>
  );
}
