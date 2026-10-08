import {
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const icons = {
  github: GithubLogo,
  x: XLogo,
  linkedin: LinkedinLogo,
  youtube: YoutubeLogo,
  instagram: InstagramLogo,
} as const;

/** Row of social icon links. */
export function SocialLinks({
  items,
  className,
}: {
  items: { id: keyof typeof icons; href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {items.map((item) => {
        const Icon = icons[item.id];
        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            title={item.label}
            className="flex size-9 items-center justify-center rounded-sm text-muted transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-surface-muted hover:text-ink"
          >
            <Icon size={18} weight="bold" />
          </a>
        );
      })}
    </div>
  );
}
