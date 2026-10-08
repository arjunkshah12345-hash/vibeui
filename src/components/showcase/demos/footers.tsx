"use client";

import { FooterCta } from "@/components/ui/footer-cta";
import { FooterLegal } from "@/components/ui/footer-legal";
import { FooterMega } from "@/components/ui/footer-mega";
import { FooterNewsletter } from "@/components/ui/footer-newsletter";
import { FooterSimple } from "@/components/ui/footer-simple";
import { SocialLinks } from "@/components/ui/social-links";
import type { Demo } from "../demo";

const brand = <span className="font-display text-2xl tracking-[-0.01em]">VibeUI</span>;

function SimpleDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-line bg-surface">
      <FooterSimple
        className="border-t-0"
        brand={brand}
        links={[
          { label: "Components", href: "#" },
          { label: "Docs", href: "#" },
          { label: "GitHub", href: "#" },
        ]}
        note="MIT · Open source"
      />
    </div>
  );
}

function MegaDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-line">
      <FooterMega
        className="border-t-0"
        brand={brand}
        blurb="Components with taste, that you own. Copy the source, retint the tokens."
        columns={[
          { title: "Product", links: [{ label: "Components", href: "#" }, { label: "Docs", href: "#" }, { label: "Changelog", href: "#" }] },
          { title: "Resources", links: [{ label: "Tokens", href: "#" }, { label: "Registry", href: "#" }, { label: "CLI", href: "#" }] },
          { title: "Community", links: [{ label: "GitHub", href: "#" }, { label: "Issues", href: "#" }] },
        ]}
        bottom={
          <>
            <span>© 2026 VibeUI · MIT</span>
            <SocialLinks
              items={[
                { id: "github", href: "#", label: "GitHub" },
                { id: "x", href: "#", label: "X" },
              ]}
            />
          </>
        }
      />
    </div>
  );
}

function CtaDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-line bg-surface">
      <FooterCta
        className="border-t-0"
        title="Ship quieter interfaces"
        description="Copy components into your app. Retint the tokens. Keep every line."
        primary={{ label: "Get started", href: "#" }}
        secondary={{ label: "Browse components", href: "#" }}
      />
    </div>
  );
}

function NewsletterDemo() {
  return <FooterNewsletter className="w-full" />;
}

function LegalDemo() {
  return (
    <div className="w-full">
      <FooterLegal
        className="border-t-0"
        copyright="© 2026 VibeUI · MIT License"
        links={[
          { label: "Privacy", href: "#" },
          { label: "Terms", href: "#" },
          { label: "License", href: "#" },
        ]}
      />
    </div>
  );
}

function SocialDemo() {
  return (
    <SocialLinks
      items={[
        { id: "github", href: "#", label: "GitHub" },
        { id: "x", href: "#", label: "X" },
        { id: "linkedin", href: "#", label: "LinkedIn" },
        { id: "youtube", href: "#", label: "YouTube" },
        { id: "instagram", href: "#", label: "Instagram" },
      ]}
    />
  );
}

export const footers: Record<string, Demo> = {
  "footer-simple": { Component: SimpleDemo, width: "full", tileScale: 0.7 },
  "footer-mega": { Component: MegaDemo, width: "full", tileScale: 0.6 },
  "footer-cta": { Component: CtaDemo, width: "full", tileScale: 0.6 },
  "footer-newsletter": { Component: NewsletterDemo, width: "sm" },
  "footer-legal": { Component: LegalDemo, width: "full", tileScale: 0.8 },
  "social-links": { Component: SocialDemo },
};
