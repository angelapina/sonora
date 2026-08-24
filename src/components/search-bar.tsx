"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, LocateFixed, Search } from "lucide-react";
import { nearestCity } from "@/lib/taxonomy-data";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    startTransition(() => {
      router.push(`/buscar?${params.toString()}`);
    });
  }

  function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const closest = nearestCity(pos.coords.latitude, pos.coords.longitude);
        setCity(closest);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center gap-1 rounded-full bg-white p-1.5 pl-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.04] transition-shadow duration-300 focus-within:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_48px_-16px_rgba(0,0,0,0.24)]",
        className
      )}
    >
      <Search size={17} className="shrink-0 text-ink-muted" strokeWidth={2} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={city ? `Busca en ${city}…` : "Cantante, banda, DJ, tu ciudad…"}
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[15px] text-ink outline-none placeholder:text-ink-muted/80"
      />
      <button
        type="button"
        onClick={detectLocation}
        title="Usar mi ubicación"
        className={cn(
          "hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/[0.04] hover:text-ink sm:flex",
          city && "text-coral"
        )}
      >
        <LocateFixed size={16} className={locating ? "animate-pulse" : ""} />
      </button>
      <button
        type="submit"
        aria-label="Buscar"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink-soft active:scale-95"
      >
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
