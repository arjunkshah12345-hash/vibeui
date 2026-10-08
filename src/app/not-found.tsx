import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-32 text-center">
      <p className="font-mono text-[13px] text-accent">404</p>
      <h1 className="mt-4 font-display text-[clamp(3rem,8vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-ink">
        Nothing here.
      </h1>
      <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
        That page does not exist, or the component was renamed. Try the gallery.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/components" className={buttonVariants()}>
          Browse components
        </Link>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          Home
        </Link>
      </div>
    </main>
  );
}
