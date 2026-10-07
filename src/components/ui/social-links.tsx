import { GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { HoverIcon } from "./hover-icon";

const icons = {
  github: GithubLogo,
  x: XLogo,
  linkedin: LinkedinLogo,
} as const;

export function SocialLinks({
  items,
  className,
}: {
  items: { id: keyof typeof icons; href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map((item) => {
        const Icon = icons[item.id];
        return (
          <a key={item.id} href={item.href} target="_blank" rel="noreferrer">
            <HoverIcon icon={<Icon size={16} weight="bold" />} label={item.label} />
          </a>
        );
      })}
    </div>
  );
}
