import type { Metadata } from "next";
import { Code, DocHeader, DocLink, H2, List, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Agents and MCP",
  description: "Let Claude, Cursor or Codex search, read and install VibeUI components through MCP.",
};

export default function Agents() {
  return (
    <>
      <DocHeader eyebrow="Tooling" title="Agents and MCP">
        Coding agents are bad at guessing component APIs. VibeUI gives them tools instead: a registry,
        a CLI and a Model Context Protocol server.
      </DocHeader>

      <H2 id="mcp">MCP server</H2>
      <P>
        Clone the repo, then point your MCP host at <Code>mcp/server.mjs</Code>. It speaks stdio, so it
        works with Cursor, Claude Desktop, Claude Code and anything else that supports MCP.
      </P>
      <CodeBlock
        language="bash"
        code={`git clone ${site.url}.git
cd vibeui && npm install`}
      />
      <CodeBlock
        className="mt-4"
        language="json"
        filename=".cursor/mcp.json"
        code={`{
  "mcpServers": {
    "vibeui": {
      "command": "node",
      "args": ["/absolute/path/to/vibeui/mcp/server.mjs"]
    }
  }
}`}
      />

      <H2 id="tools">Tools</H2>
      <List>
        <li><Code>search_components</Code> and <Code>list_components</Code> for discovery</li>
        <li><Code>get_component</Code> for metadata and full source</li>
        <li><Code>add_component</Code> to write files into a project, siblings included</li>
        <li><Code>get_tokens</Code>, <Code>get_utils</Code> and <Code>get_install_guide</Code> to bootstrap a project</li>
        <li><Code>list_categories</Code>, <Code>library_info</Code> and <Code>refresh_registry</Code></li>
      </List>
      <P>
        There is also a <Code>vibeui://registry</Code> resource with the full catalog and an{" "}
        <Code>integrate_vibeui</Code> prompt that walks an agent through adding one component.
      </P>

      <H2 id="bootstrap">Zero-setup context</H2>
      <P>
        If an agent cannot run MCP, point it at <DocLink href={`${site.url}/blob/main/llms.txt`}>llms.txt</DocLink>{" "}
        and <DocLink href={`${site.url}/blob/main/docs/agents.md`}>docs/agents.md</DocLink>. They explain
        the conventions in a few hundred tokens: where files live, which peers to install and how
        variants are written.
      </P>
      <CodeBlock
        language="bash"
        code={`# what an agent usually needs
${site.cli} search "date picker" --json
${site.cli} get calendar --source
${site.cli} add calendar --dir ./src/components/ui`}
      />
    </>
  );
}
