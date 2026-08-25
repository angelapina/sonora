"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FAQ acordeón. Además de la UI, la página que lo usa emite JSON-LD FAQPage
 * para poder aparecer como rich snippet en Google.
 */
export function FaqList({ faqs }: { faqs: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
          >
            <span className="text-[16px] font-medium text-ink">{f.q}</span>
            <Plus
              size={17}
              className={cn(
                "shrink-0 text-ink-muted transition-transform duration-300",
                open === i && "rotate-45"
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open === i ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <p className="overflow-hidden text-[15px] leading-relaxed text-ink-muted">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
