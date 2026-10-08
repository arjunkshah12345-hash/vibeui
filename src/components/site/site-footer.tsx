import { SocialLinks } from "@/components/ui/social-links";
import { FooterMega } from "@/components/ui/footer-mega";
import { site } from "@/lib/site";
import { BrandMark } from "./brand-mark";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** FooterMega renders plain anchors, so internal links need the base path by hand. */
function prefix<T extends { href: string }>(link: T): T {
  return link.href.startsWith("/") ? { ...link, href: `${base}${link.href}` } : link;
}

/** The site footer is the library's own FooterMega. */
export function SiteFooter() {
  return (
    <FooterMega
      className="mt-auto"
      brand={
        <span className="flex items-center gap-2.5">
          <BrandMark size={24} />
          <span className="font-display text-2xl leading-none tracking-[-0.01em]">VibeUI</span>
        </span>
      }
      blurb="Components with taste, that you own. Copy the source, retint the tokens, keep every line."
      columns={[
        {
          title: "Library",
          links: [
            { label: "All components", href: "/components" },
            { label: "Signature pieces", href: "/components#craft" },
            { label: "Text effects", href: "/components#text" },
            { label: "Footers", href: "/components#footers" },
          ].map(prefix),
        },
        {
          title: "Docs",
          links: [
            { label: "Introduction", href: "/docs" },
            { label: "Installation", href: "/docs/installation" },
            { label: "Theming", href: "/docs/theming" },
            { label: "CLI", href: "/docs/cli" },
          ].map(prefix),
        },
        {
          title: "Project",
          links: [
            { label: "GitHub", href: site.url },
            { label: "Agents and MCP", href: "/docs/agents" },
            { label: "Issues", href: `${site.url}/issues` },
            { label: "MIT license", href: `${site.url}/blob/main/LICENSE` },
          ].map(prefix),
        },
      ]}
      bottom={
        <>
          <span>© 2026 VibeUI · MIT licensed</span>
          <SocialLinks items={[{ id: "github", href: site.url, label: "GitHub" }]} />
        </>
      }
    />
  );
}
