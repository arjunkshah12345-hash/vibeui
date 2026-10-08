import type { Metadata } from "next";
import { Code, DocHeader, DocLink, DocTable, H2, Note, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { getComponent } from "@/lib/registry";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Registry",
  description: "The registry JSON: every field, how it is generated, and how tools and agents can use it.",
};

export default function Registry() {
  const sample = getComponent("slider");
  // A trimmed, real entry so the docs always show the true shape.
  const entry = sample
    ? JSON.stringify(
        {
          ...sample,
          api: sample.api.map((e) => ({ ...e, props: e.props.slice(0, 2) })),
        },
        null,
        2,
      )
    : "";

  return (
    <>
      <DocHeader eyebrow="Tooling" title="Registry">
        <Code>registry/components.json</Code> is the machine-readable catalog behind the CLI, the MCP
        server and this site. It is generated from the source files, never edited by hand.
      </DocHeader>

      <H2 id="generate">Generating it</H2>
      <CodeBlock language="bash" code="npm run registry" />
      <P>
        Two steps run in order. <Code>agent/lib.mjs</Code> scans <Code>src/components/ui/*.tsx</Code>{" "}
        for exports, <Code>&quot;use client&quot;</Code>, peers, sibling imports and the first
        doc comment. Then <Code>scripts/props.mjs</Code> asks the TypeScript checker for each
        component&apos;s props and writes them as <Code>api</Code>. <Code>npm run build</Code> runs
        both first, so the site never ships stale data.
      </P>
      <Note title="TypeScript is a dev dependency">
        Extracting <Code>api</Code> needs <Code>typescript</Code>. A plain refresh without it keeps
        the existing <Code>api</Code> data rather than dropping it.
      </Note>

      <H2 id="top-level">Top-level fields</H2>
      <DocTable
        head={["Field", "Meaning"]}
        rows={[
          ["name, version, license, repository", "Package identity. version tracks package.json."],
          ["count", "Number of components."],
          ["tokens, utils", "Paths of the token file and the cn() helper."],
          ["peerDependencies", "npm packages every component may need."],
          ["agent", "Pointers to the CLI, MCP entry and agent docs."],
          ["categories", "Map of category → component names."],
          ["components", "The array described below."],
        ]}
      />

      <H2 id="component">A component entry</H2>
      <DocTable
        head={["Field", "Type", "Meaning"]}
        mono={[0, 1]}
        rows={[
          ["name", "string", "Kebab-case slug and file name."],
          ["title", "string", "PascalCase name of the primary export."],
          ["category", "string", "One of actions, forms, feedback, data, overlays, navigation, craft, text, hover, footers."],
          ["description", "string", "The file's first /** … */ comment."],
          ["file", "string", "Repo-relative path."],
          ["exports", "string[]", "Exported component names, in file order."],
          ["client", "boolean", "True if the file starts with \"use client\"."],
          ["dependencies", "string[]", "npm peers this file imports beyond react."],
          ["registryDependencies", "string[]", "Sibling components it imports. add copies these too."],
          ["tags", "string[]", "Category and client/rsc-safe."],
          ["api", "ApiEntry[]", "Props per export, generated from types."],
        ]}
      />
      <H2 id="api">The api field</H2>
      <DocTable
        head={["Field", "Meaning"]}
        rows={[
          ["api[].name", "The exported component."],
          ["api[].extends", "Native attribute sets it forwards, such as ButtonHTMLAttributes<HTMLButtonElement>."],
          ["api[].props[].name / type", "Prop name and its TypeScript type (long unions are clipped)."],
          ["api[].props[].required", "True if the prop has no ? in its type."],
          ["api[].props[].default", "The default from the destructured parameter, or null."],
          ["api[].props[].description", "The prop's JSDoc, or a standard description for common names."],
        ]}
      />
      <P>Props inherited from React or the DOM are not listed; only props declared in this repo (including cva variants) are.</P>

      <H2 id="example">A real entry</H2>
      <P>
        This is <Code>slider</Code>, trimmed to its first two props. It is read from the registry when
        the page is built.
      </P>
      <CodeBlock language="json" filename="registry/components.json (excerpt)" code={entry} maxHeight={460} />

      <H2 id="using">Using it</H2>
      <CodeBlock
        language="bash"
        code={`# the raw file on GitHub
curl -s ${site.url.replace("github.com", "raw.githubusercontent.com")}/main/registry/components.json \\
  | jq -r '.components[] | select(.category=="forms") | .name'`}
      />
      <P>
        Agents rarely need the file directly: the MCP server exposes it as the{" "}
        <Code>vibeui://registry</Code> resource and through its tools. See{" "}
        <DocLink href="/docs/agents">Agents and MCP</DocLink>.
      </P>
    </>
  );
}
