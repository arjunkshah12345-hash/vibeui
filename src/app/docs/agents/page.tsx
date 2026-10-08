import type { Metadata } from "next";
import { Code, DocHeader, DocLink, DocTable, H2, H3, List, Note, OL, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Agents and MCP",
  description: "Connect Claude, Cursor or Codex to VibeUI over MCP, with the full tool reference.",
};

export default function Agents() {
  return (
    <>
      <DocHeader eyebrow="Tooling" title="Agents and MCP">
        Coding agents are bad at guessing component APIs. VibeUI gives them tools instead: a registry,
        a CLI and a Model Context Protocol server, so they search, read and install real source.
      </DocHeader>

      <H2 id="surfaces">Three ways in</H2>
      <DocTable
        head={["Surface", "Best for", "Entry"]}
        mono={[0]}
        rows={[
          ["MCP server", "Interactive agents (Claude Code, Cursor, Claude Desktop, Codex)", "node mcp/server.mjs"],
          ["CLI + --json", "Scripts and agents that can run shell commands", `${site.cli} …`],
          ["llms.txt", "Agents with no tooling, as a short brief", "llms.txt, docs/agents.md"],
        ]}
      />

      <H2 id="setup">MCP setup</H2>
      <P>
        The server speaks stdio and needs a local copy of the repo, because it reads the source files
        it hands to the agent.
      </P>
      <CodeBlock language="bash" code={`git clone ${site.url}.git\ncd vibeui && npm install`} />
      <Tabs defaultValue="claude" className="mt-5">
        <TabsList>
          <TabsTrigger value="claude">Claude Code</TabsTrigger>
          <TabsTrigger value="cursor">Cursor</TabsTrigger>
          <TabsTrigger value="desktop">Claude Desktop</TabsTrigger>
        </TabsList>
        <TabsContent value="claude">
          <CodeBlock language="bash" code={`claude mcp add vibeui -- node /absolute/path/to/vibeui/mcp/server.mjs`} />
        </TabsContent>
        <TabsContent value="cursor">
          <CodeBlock
            language="json"
            filename=".cursor/mcp.json"
            code={`{
  "mcpServers": {
    "vibeui": {
      "command": "node",
      "args": ["\${workspaceFolder}/mcp/server.mjs"]
    }
  }
}`}
          />
          <P>Use an absolute path if the repo is not your workspace.</P>
        </TabsContent>
        <TabsContent value="desktop">
          <CodeBlock
            language="json"
            filename="claude_desktop_config.json"
            code={`{
  "mcpServers": {
    "vibeui": {
      "command": "node",
      "args": ["/absolute/path/to/vibeui/mcp/server.mjs"]
    }
  }
}`}
          />
        </TabsContent>
      </Tabs>
      <Note title="Where does add_component write?">
        Relative to the server&apos;s working directory, unless you pass an absolute <Code>dir</Code>.
        Agents should pass the target project&apos;s <Code>src/components/ui</Code> explicitly.
      </Note>

      <H2 id="tools">Tools</H2>
      <DocTable
        head={["Tool", "Inputs", "Returns"]}
        mono={[0, 1]}
        rows={[
          ["library_info", "none", "Version, component count, categories, peers."],
          ["list_components", "category?", "Name, title, category, description, peers, registryDependencies."],
          ["search_components", "query, category?", "Matches with description and dependencies."],
          ["get_component", "name", "Full source plus metadata and the generated api table."],
          ["add_component", "names (string | string[]), dir?, tokens?", "Per-file results (siblings included) and the peers to install."],
          ["get_tokens", "none", "The contents of templates/vibeui.css."],
          ["get_utils", "none", "The cn() helper source."],
          ["get_install_guide", "none", "A short markdown install guide."],
          ["list_categories", "none", "Categories with their component names."],
          ["refresh_registry", "none", "Regenerates the registry and returns the new count."],
        ]}
      />

      <H3>Resources and prompt</H3>
      <List>
        <li><Code>vibeui://registry</Code>: the full catalog JSON.</li>
        <li><Code>vibeui://llms.txt</Code>: the agent brief.</li>
        <li>Prompt <Code>integrate_vibeui</Code> (argument <Code>component</Code>): a guided plan for adding one component to the current project.</li>
      </List>

      <H2 id="loop">The recommended loop</H2>
      <OL>
        <li><Code>search_components</Code> for the need (&quot;date picker&quot;).</li>
        <li><Code>get_component</Code> and read the source and <Code>api</Code> before writing code. Do not guess props.</li>
        <li>Make sure peers, the tokens file and <Code>cn()</Code> exist (<Code>get_tokens</Code>, <Code>get_utils</Code>).</li>
        <li><Code>add_component</Code> into the project.</li>
        <li>Import it and match the project&apos;s conventions.</li>
      </OL>

      <H2 id="cli">Without MCP</H2>
      <CodeBlock
        language="bash"
        code={`${site.cli} search "date picker" --json
${site.cli} get calendar --json
${site.cli} add calendar --dir ./src/components/ui`}
      />

      <H2 id="rules">Rules worth giving an agent</H2>
      <List>
        <li>Components live in <Code>src/components/ui/&lt;kebab&gt;.tsx</Code> and import <Code>cn</Code> from <Code>@/lib/utils</Code>.</li>
        <li>Use token classes (<Code>bg-surface</Code>, <Code>text-muted</Code>, <Code>border-line</Code>), never raw hex.</li>
        <li>Icons come from <Code>@phosphor-icons/react</Code>; use <Code>/dist/ssr</Code> in files without <Code>&quot;use client&quot;</Code>.</li>
        <li>Do not wrap VibeUI in a package or replace its variants system. Edit the copied file instead.</li>
      </List>
      <P>
        These are also in <DocLink href={`${site.url}/blob/main/llms.txt`}>llms.txt</DocLink> and{" "}
        <DocLink href={`${site.url}/blob/main/docs/agents.md`}>docs/agents.md</DocLink>.
      </P>
    </>
  );
}
