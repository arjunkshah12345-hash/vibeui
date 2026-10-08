"use client";

import * as React from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";

/** Email signup card with an inline success state. */
export function FooterNewsletter({
  title = "Stay in the loop",
  description = "Release notes and new components. No spam.",
  className,
  onSubmit,
}: {
  title?: string;
  description?: string;
  className?: string;
  onSubmit?: (email: string) => void;
}) {
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-surface p-6 shadow-quiet",
        className,
      )}
    >
      <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
      {done ? (
        <p className="mt-4 flex animate-pop-in items-center gap-2 text-sm font-medium text-pastel-sage-ink">
          <CheckCircle size={18} weight="fill" /> You’re on the list.
        </p>
      ) : (
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(email);
            setDone(true);
          }}
        >
          <Input
            type="email"
            required
            aria-label="Email address"
            placeholder="you@studio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sm:flex-1"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      )}
    </div>
  );
}
