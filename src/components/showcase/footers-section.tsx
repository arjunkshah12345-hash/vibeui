"use client";

import {
  FooterCta,
  FooterLegal,
  FooterMega,
  FooterNewsletter,
  FooterSimple,
  Pill,
  SocialLinks,
} from "@/components/ui";
import { DemoFrame, ShowcaseSection } from "@/components/showcase/section";

export function FootersSection() {
  return (
    <ShowcaseSection
      id="footers"
      eyebrow="13 — Footers"
      title="Footer elements"
      description="Simple bars, mega columns, CTA bands, newsletter, legal — compose what you need."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Pill tone="sage">Layout</Pill>
        <Pill tone="outline">Composable</Pill>
      </div>

      <div className="space-y-4">
        <DemoFrame label="FooterSimple">
          <FooterSimple
            brand={
              <span className="font-[family-name:var(--font-display)] text-xl text-ink">
                VibeUI
              </span>
            }
            links={[
              { label: "Gallery", href: "/gallery" },
              { label: "Docs", href: "/docs" },
              { label: "GitHub", href: "https://github.com/arjunkshah12345-hash/vibeui" },
            ]}
            note="MIT · Open source"
          />
        </DemoFrame>

        <DemoFrame label="FooterMega">
          <FooterMega
            brand={
              <span className="font-[family-name:var(--font-display)] text-xl text-ink">
                VibeUI
              </span>
            }
            blurb="Quiet components for calm interfaces. Copy the source. Own the tokens."
            columns={[
              {
                title: "Product",
                links: [
                  { label: "Gallery", href: "/gallery" },
                  { label: "Docs", href: "/docs" },
                  { label: "Craft", href: "#craft" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { label: "Tokens", href: "/docs" },
                  { label: "Registry", href: "https://github.com/arjunkshah12345-hash/vibeui/blob/main/registry/components.json" },
                  { label: "Contributing", href: "https://github.com/arjunkshah12345-hash/vibeui/blob/main/CONTRIBUTING.md" },
                ],
              },
              {
                title: "Social",
                links: [
                  { label: "GitHub", href: "https://github.com/arjunkshah12345-hash/vibeui" },
                ],
              },
            ]}
            bottom={
              <>
                <span>© 2026 VibeUI</span>
                <SocialLinks
                  items={[
                    {
                      id: "github",
                      href: "https://github.com/arjunkshah12345-hash/vibeui",
                      label: "GitHub",
                    },
                  ]}
                />
              </>
            }
          />
        </DemoFrame>

        <DemoFrame label="FooterCta">
          <FooterCta
            title="Ship quieter interfaces"
            description="Copy components into your app. Retint tokens. Keep every line."
            primary={{ label: "Get started", href: "/docs" }}
            secondary={{ label: "Browse gallery", href: "/gallery" }}
          />
        </DemoFrame>

        <div className="grid gap-4 md:grid-cols-2">
          <DemoFrame label="FooterNewsletter">
            <FooterNewsletter />
          </DemoFrame>
          <DemoFrame label="FooterLegal · SocialLinks">
            <SocialLinks
              className="mb-4"
              items={[
                {
                  id: "github",
                  href: "https://github.com/arjunkshah12345-hash/vibeui",
                  label: "GitHub",
                },
              ]}
            />
            <FooterLegal
              copyright="© VibeUI · MIT License"
              links={[
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
                { label: "License", href: "https://github.com/arjunkshah12345-hash/vibeui/blob/main/LICENSE" },
              ]}
            />
          </DemoFrame>
        </div>
      </div>
    </ShowcaseSection>
  );
}
