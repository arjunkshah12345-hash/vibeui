import type { Metadata } from "next";
import { Code, DocHeader, DocLink, H2, P, Step } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Installation",
  description: "Install the peers, add the tokens, and copy your first VibeUI component.",
};

export default function Installation() {
  return (
    <>
      <DocHeader eyebrow="Getting started" title="Installation">
        Four steps from an empty React app to a working component. It takes about two minutes.
      </DocHeader>

      <Step n={1} title="Install the peer dependencies">
        <CodeBlock
          language="bash"
          code="npm i clsx tailwind-merge class-variance-authority @phosphor-icons/react"
        />
      </Step>

      <Step n={2} title="Add the tokens">
        <P className="mt-0">
          Get the token file with <Code>init</Code>, or copy{" "}
          <DocLink href={`${site.url}/blob/main/templates/vibeui.css`}>templates/vibeui.css</DocLink> by
          hand. It also creates <Code>src/lib/utils.ts</Code> for the <Code>cn()</Code> helper.
        </P>
        <CodeBlock language="bash" code={`${site.cli} init --dir .`} />
        <P>
          Then import it <em>after</em> Tailwind in your global stylesheet. The order matters: the file
          declares theme values and the <Code>dark</Code> variant that Tailwind needs to see.
        </P>
        <CodeBlock
          language="css"
          filename="src/app/globals.css"
          code={`@import "tailwindcss";
@import "../../vibeui.tokens.css";`}
        />
      </Step>

      <Step n={3} title="Add a component">
        <CodeBlock
          language="bash"
          code={`${site.cli} add button dialog --dir ./src/components/ui`}
        />
        <P>
          Components that import siblings bring them along. Adding <Code>footer-cta</Code> also copies{" "}
          <Code>button</Code>, so you never end up with a broken import.
        </P>
      </Step>

      <Step n={4} title="Use it">
        <CodeBlock
          language="tsx"
          filename="app/page.tsx"
          code={`import { Button } from "@/components/ui/button"

export default function Page() {
  return <Button variant="accent">Get started</Button>
}`}
        />
      </Step>

      <H2 id="alias">Path alias</H2>
      <P>
        Components import <Code>@/lib/utils</Code>. Make sure your <Code>tsconfig.json</Code> maps{" "}
        <Code>@/*</Code> to <Code>src/*</Code>:
      </P>
      <CodeBlock
        language="json"
        filename="tsconfig.json"
        code={`{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}`}
      />

      <H2 id="toasts">Toasts need a provider</H2>
      <P>
        Most components are self-contained. The exception is <Code>toast</Code>: wrap your app once in{" "}
        <Code>ToastProvider</Code>, then call <Code>useToast()</Code> anywhere beneath it.
      </P>
      <CodeBlock
        language="tsx"
        filename="app/layout.tsx"
        code={`import { ToastProvider } from "@/components/ui/toast"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}`}
      />

      <H2 id="manual">Prefer not to use the CLI?</H2>
      <P>
        Every component page on the <DocLink href="/components">gallery</DocLink> shows the full source
        with a copy button and lists its peers. Paste the file into{" "}
        <Code>src/components/ui</Code> and you are done.
      </P>
    </>
  );
}
