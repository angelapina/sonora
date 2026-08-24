"use client";

import { useState, useTransition } from "react";
import { toggleAvailability } from "@/lib/actions/musician";
import { cn } from "@/lib/utils";

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function AvailabilityCalendar({ blockedDates }: { blockedDates: string[] }) {
  const [blocked, setBlocked] = useState(new Set(blockedDates));
  const [pending, startTransition] = useTransition();

  const days = Array.from({ length: 56 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });

  function handleToggle(iso: string) {
    startTransition(async () => {
      await toggleAvailability(iso);
      setBlocked((prev) => {
        const next = new Set(prev);
        if (next.has(iso)) next.delete(iso);
        else next.add(iso);
        return next;
      });
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-paper border border-line" /> Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-ink" /> Bloqueado
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const iso = toISODate(d);
          const isBlocked = blocked.has(iso);
          return (
            <button
              key={iso}
              disabled={pending}
              onClick={() => handleToggle(iso)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-xl border text-xs font-medium transition-colors",
                isBlocked
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-paper text-ink hover:border-coral/50"
              )}
            >
              <span className="text-[10px] uppercase text-current/70">
                {d.toLocaleDateString("es-ES", { month: "short" })}
              </span>
              <span className="text-sm">{d.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
