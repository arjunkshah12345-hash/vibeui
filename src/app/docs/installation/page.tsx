import type { Metadata } from "next";
import { Code, DocHeader, DocLink, DocTable, H2, H3, Note, OL, P, Step } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Installation",
  description: "Install VibeUI in Next.js or Vite: peers, tokens, fonts, dark mode and your first component.",
};

export default function Installation() {
  return (
    <>
      <DocHeader eyebrow="Getting started" title="Installation">
        From an empty React app to a working component in about two minutes. Pick your framework for
        the one step that differs.
      </DocHeader>

      <H2 id="prerequisites">Prerequisites</H2>
      <P>
        You need a React 18+ project with <strong className="font-medium text-ink">Tailwind CSS v4</strong>{" "}
        and a <Code>@/*</Code> path alias pointing at <Code>src/*</Code>. A fresh{" "}
        <Code>create-next-app</Code> or Vite React-TS template satisfies the alias already; if you
        are adding VibeUI to an existing project, check <DocLink href="#alias">the alias section</DocLink>{" "}
        below.
      </P>

      <H2 id="steps">Setup</H2>
      <div className="mt-6">
        <Step n={1} title="Install the peer dependencies">
          <CodeBlock
            language="bash"
            code="npm i clsx tailwind-merge class-variance-authority @phosphor-icons/react"
          />
          <P>
            These are the only runtime dependencies. <Code>@phosphor-icons/react</Code> supplies the
            icons; files without <Code>&quot;use client&quot;</Code> import from{" "}
            <Code>@phosphor-icons/react/dist/ssr</Code> so they stay server-safe.
          </P>
        </Step>

        <Step n={2} title="Add the tokens and the cn() helper">
          <CodeBlock language="bash" code={`${site.cli} init --dir .`} />
          <P>
            This writes <Code>vibeui.tokens.css</Code> (all design tokens, keyframes and the dark
            variant) and <Code>src/lib/utils.ts</Code> (the <Code>cn()</Code> helper). It will not
            overwrite files that already exist. You can also copy{" "}
            <DocLink href={`${site.url}/blob/main/templates/vibeui.css`}>templates/vibeui.css</DocLink> by
            hand.
          </P>
          <P>
            Then import the tokens <em>after</em> Tailwind. Order matters: the token file declares
            theme values and a custom variant that Tailwind has to see.
          </P>
          <Tabs defaultValue="next" className="mt-4">
            <TabsList>
              <TabsTrigger value="next">Next.js</TabsTrigger>
              <TabsTrigger value="vite">Vite</TabsTrigger>
            </TabsList>
            <TabsContent value="next">
              <CodeBlock
                language="css"
                filename="src/app/globals.css"
                code={`@import "tailwindcss";
@import "../../vibeui.tokens.css";`}
              />
              <P>
                Next.js already includes the Tailwind PostCSS plugin when you pick Tailwind in{" "}
                <Code>create-next-app</Code>. If you added Tailwind manually, install{" "}
                <Code>tailwindcss</Code> and <Code>@tailwindcss/postcss</Code> and register the
                plugin in <Code>postcss.config.mjs</Code>.
              </P>
            </TabsContent>
            <TabsContent value="vite">
              <CodeBlock language="bash" code="npm i tailwindcss @tailwindcss/vite" />
              <CodeBlock
                className="mt-3"
                language="ts"
                filename="vite.config.ts"
                code={`import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})`}
              />
              <CodeBlock
                className="mt-3"
                language="css"
                filename="src/index.css"
                code={`@import "tailwindcss";
@import "../vibeui.tokens.css";`}
              />
            </TabsContent>
          </Tabs>
        </Step>

        <Step n={3} title="Add fonts (optional)">
          <P>
            The tokens reference three optional font variables. If you do nothing, the system font
            stack is used. The VibeUI look uses Geist for UI, Geist Mono for code and Instrument
            Serif for display type (all open source under the SIL Open Font License).
          </P>
          <CodeBlock
            language="tsx"
            filename="app/layout.tsx"
            code={`import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const display = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${sans.variable} \${mono.variable} \${display.variable}\`}>
      <body className="bg-canvas font-sans text-ink">{children}</body>
    </html>
  )
}`}
          />
        </Step>

        <Step n={4} title="Add a component and use it">
          <CodeBlock
            language="bash"
            code={`${site.cli} add button dialog --dir ./src/components/ui`}
          />
          <P>
            Components that import siblings bring them along. Adding <Code>footer-cta</Code> also
            copies <Code>button</Code>, so you never end up with a broken import. The CLI prints the
            list of peers it expects.
          </P>
          <CodeBlock
            language="tsx"
            filename="app/page.tsx"
            code={`import { Button } from "@/components/ui/button"

export default function Page() {
  return <Button variant="accent">Get started</Button>
}`}
          />
        </Step>
      </div>

      <H2 id="alias">Path alias</H2>
      <P>
        Every component imports <Code>cn</Code> from <Code>@/lib/utils</Code>. If your project uses a
        different alias, either add the one below or find-and-replace the import after copying.
      </P>
      <CodeBlock
        language="json"
        filename="tsconfig.json"
        code={`{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}`}
      />

      <H2 id="providers">Providers</H2>
      <P>
        Almost everything is self-contained. The one exception is toasts: wrap your app once in{" "}
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
      <P>
        For dark mode you will also want the inline theme script and, if you want a toggle, a tiny
        provider. Both are covered in <DocLink href="/docs/dark-mode">Dark mode</DocLink>.
      </P>

      <H2 id="manual">Installing by hand</H2>
      <P>You do not need the CLI. Every component page in the <DocLink href="/components">gallery</DocLink> shows
        the full source with a copy button and lists its peers and any sibling components it imports.</P>
      <OL>
        <li>Copy the file into <Code>src/components/ui/</Code>.</li>
        <li>Copy any sibling it lists (for example <Code>button.tsx</Code>).</li>
        <li>Install any extra peers shown on the page.</li>
      </OL>

      <H2 id="troubleshooting">Troubleshooting</H2>
      <DocTable
        head={["Symptom", "Likely cause and fix"]}
        mono={[]}
        rows={[
          [
            "Components render unstyled or with default Tailwind radii",
            <>The tokens are not imported, or are imported <em>before</em> <Code>@import &quot;tailwindcss&quot;</Code>. Import them after.</>,
          ],
          [
            "Animations do nothing in my app",
            <>Keyframes and <Code>animate-*</Code> utilities live in the token file. Make sure the whole file was imported, not just the color variables.</>,
          ],
          [
            "dark: utilities follow the OS, not my toggle",
            <>The <Code>@custom-variant dark</Code> line is missing. It ships at the top of the token file.</>,
          ],
          [
            "Cannot find module '@/lib/utils'",
            <>Add the path alias above, or run <Code>init</Code> so <Code>utils.ts</Code> exists.</>,
          ],
          [
            "Error: You're importing a component that needs useState",
            <>The file needs <Code>&quot;use client&quot;</Code>. Components that use state already have it; if you wrap one in a Server Component that passes functions as props, move that wrapper to a client file.</>,
          ],
          [
            "Icons break in a Server Component",
            <>Import from <Code>@phosphor-icons/react/dist/ssr</Code> in files without <Code>&quot;use client&quot;</Code>.</>,
          ],
        ]}
      />
      <Note title="Still stuck?">
        Open an issue at <DocLink href={`${site.url}/issues`}>GitHub</DocLink> with your Tailwind
        version, framework and the component you were adding.
      </Note>

      <H3>Verify it works</H3>
      <P>
        Render a <Code>Switch</Code> and a <Code>Slider</Code>. If the switch track is the accent
        color when on, and the slider has a filled track, the tokens are wired correctly.
      </P>
    </>
  );
}
