import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "coral" | "gold" | "dark";
}) {
  const tones = {
    default: "bg-black/[0.04] text-ink-muted backdrop-blur-sm",
    coral: "bg-coral text-white",
    gold: "bg-gold/10 text-gold border border-gold/25",
    dark: "bg-ink/85 text-white backdrop-blur-sm",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
