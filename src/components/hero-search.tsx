"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { CITIES, nearestCity } from "@/lib/taxonomy-data";
import { cn } from "@/lib/utils";

/**
 * Buscador del hero.
 *
 * El hueco más grande que tenía la web: el hero solo ofrecía dos botones, así
 * que el usuario que llegaba con una intención concreta ("un DJ en Alicante")
 * tenía que navegar a /buscar y empezar de cero. Aquí puede expresar esa
 * intención en el primer pantallazo, que es donde se decide si se queda.
 *
 * Dos campos y nada más. Cada campo extra en un buscador de entrada cuesta
 * conversión, y el resto de filtros (fecha, presupuesto, género) ya están en la
 * página de resultados, que es donde el usuario sí tiene contexto para usarlos.
 *
 * Los chips usan slugs reales de la taxonomía, así que la búsqueda que lanzan
 * devuelve resultados de verdad; no son decorativos.
 */
const QUICK_TYPES = [
  { slug: "cantante", label: "Música en directo", icon: "🎤" },
  { slug: "dj", label: "DJ", icon: "🎧" },
  { slug: "banda", label: "Banda", icon: "🎸" },
  { slug: "solista", label: "Solista", icon: "🎷" },
  { slug: "baile", label: "Espectáculo", icon: "💃" },
];

export function HeroSearch() {
  const router = useRouter();
  const [artistType, setArtistType] = useState("");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (artistType) params.set("artistType", artistType);
    if (city) params.set("city", city);
    startTransition(() => router.push(`/buscar?${params.toString()}`));
  }

  function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCity(nearestCity(pos.coords.latitude, pos.coords.longitude));
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-3xl text-left">
      {/* min-w-0: los navegadores dan a <fieldset> un `min-width: min-content`
          que no se puede anular de otro modo. Sin esto, la fila de chips (que
          mide más que la pantalla porque hace scroll) estiraba el fieldset y
          provocaba scroll horizontal en TODA la página en móvil. */}
      <fieldset className="min-w-0">
        {/* float-none + block: por defecto el navegador trata <legend> como un
            elemento especial del borde del fieldset y no respeta text-center. */}
        <legend className="t-small float-none mb-3 block w-full text-center text-white/50">
          ¿Qué tipo de artista buscas?
        </legend>

        {/* Scroll horizontal en móvil para no apilar cinco chips en tres filas */}
        <div className="scroll-row -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {QUICK_TYPES.map((t) => {
            const active = artistType === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                aria-pressed={active}
                onClick={() => setArtistType(active ? "" : t.slug)}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition-all duration-300 ease-[var(--ease-premium)]",
                  active
                    ? "border-white bg-white text-ink"
                    : "border-white/20 bg-white/[0.06] text-white/85 hover:border-white/40 hover:bg-white/10"
                )}
              >
                <span aria-hidden className="text-[15px] leading-none">
                  {t.icon}
                </span>
                {t.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Ubicación + acción, en una sola pieza para que se lea como un buscador */}
      <div className="mt-3 flex flex-col gap-2.5 rounded-[var(--radius-panel)] bg-white p-2.5 shadow-[var(--shadow-lifted)] sm:flex-row sm:items-center sm:rounded-full sm:pl-5">
        <label className="flex flex-1 items-center gap-2.5 px-3 sm:px-0">
          <MapPin size={17} className="shrink-0 text-ink-muted" aria-hidden />
          <span className="sr-only">¿Dónde será tu evento?</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-11 w-full cursor-pointer appearance-none bg-transparent text-[15px] text-ink outline-none"
          >
            <option value="">¿Dónde será tu evento?</option>
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={detectLocation}
            title="Usar mi ubicación"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/[0.05] hover:text-ink"
          >
            <LocateFixed size={17} className={locating ? "animate-pulse" : ""} />
            <span className="sr-only">Usar mi ubicación</span>
          </button>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-full bg-coral px-7 text-[15px] font-medium text-white transition-all duration-300 ease-[var(--ease-premium)] hover:bg-coral-dark active:scale-[0.98] disabled:opacity-60"
        >
          <Search size={17} />
          {pending ? "Buscando…" : "Buscar artistas"}
        </button>
      </div>
    </form>
  );
}
