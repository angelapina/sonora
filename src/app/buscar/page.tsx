import type { Metadata } from "next";
import { SlidersHorizontal, SearchX } from "lucide-react";
import { SearchFilters } from "@/components/search-filters";
import { SortSelect } from "@/components/sort-select";
import { MusicianCard } from "@/components/musician-card";
import { getArtistTypes, getGenres, getEventTypes } from "@/lib/data/taxonomy";
import { searchMusicians, type MusicianSearchFilters } from "@/lib/data/musicians";

export const metadata: Metadata = {
  title: "Buscar músicos y artistas | Sonora",
};

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}
function toStr(v: string | string[] | undefined): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

type SP = Record<string, string | string[] | undefined>;

function buildQuery(sp: SP, overrides: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (key === "page") continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else if (value) params.set(key, value);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === "") params.delete(key);
    else params.set(key, String(value));
  }
  return `/buscar?${params.toString()}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const filters: MusicianSearchFilters = {
    q: toStr(sp.q),
    city: toStr(sp.city),
    eventType: toStr(sp.eventType),
    artistTypes: toArray(sp.artistType),
    genres: toArray(sp.genre),
    priceMin: toStr(sp.priceMin) ? Number(toStr(sp.priceMin)) : undefined,
    priceMax: toStr(sp.priceMax) ? Number(toStr(sp.priceMax)) : undefined,
    sort: (toStr(sp.sort) as MusicianSearchFilters["sort"]) ?? "relevance",
    page: toStr(sp.page) ? Number(toStr(sp.page)) : 1,
  };

  const [artistTypes, genres, eventTypes, results] = await Promise.all([
    getArtistTypes(),
    getGenres(),
    getEventTypes(),
    searchMusicians(filters),
  ]);

  const activeEventTypeLabel = eventTypes.find((e) => e.slug === filters.eventType)?.label;

  const activeFilterCount =
    (filters.city ? 1 : 0) +
    (filters.eventType ? 1 : 0) +
    (filters.priceMin !== undefined ? 1 : 0) +
    (filters.priceMax !== undefined ? 1 : 0) +
    (filters.artistTypes?.length ?? 0) +
    (filters.genres?.length ?? 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
          {results.total} {results.total === 1 ? "músico encontrado" : "músicos encontrados"}
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          {filters.city
            ? `Músicos en ${filters.city}`
            : activeEventTypeLabel
              ? `Músicos para ${activeEventTypeLabel.toLowerCase()}`
              : "Todos los músicos y artistas"}
        </h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          {/* Móvil/tablet: acordeón cerrado por defecto para llegar antes a los resultados */}
          <details className="group rounded-2xl border border-line bg-paper p-5 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink">
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filtros
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[11px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <span className="text-ink-muted transition-transform duration-300 group-open:rotate-180">⌄</span>
            </summary>
            <div className="mt-6">
              <SearchFilters
                artistTypes={artistTypes}
                genres={genres}
                eventTypes={eventTypes}
                current={{
                  q: filters.q,
                  city: filters.city,
                  eventType: filters.eventType,
                  artistType: filters.artistTypes ?? [],
                  genre: filters.genres ?? [],
                  priceMin: toStr(sp.priceMin),
                  priceMax: toStr(sp.priceMax),
                }}
              />
            </div>
          </details>

          {/* Escritorio: filtros siempre visibles en la barra lateral */}
          <div className="hidden lg:block">
            <SearchFilters
              artistTypes={artistTypes}
              genres={genres}
              eventTypes={eventTypes}
              current={{
                q: filters.q,
                city: filters.city,
                eventType: filters.eventType,
                artistType: filters.artistTypes ?? [],
                genre: filters.genres ?? [],
                priceMin: toStr(sp.priceMin),
                priceMax: toStr(sp.priceMax),
              }}
            />
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-end">
            <SortSelect current={filters.sort ?? "relevance"} />
          </div>

          {results.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line py-24 text-center">
              <SearchX size={32} className="text-ink-muted" />
              <p className="mt-4 font-display text-xl text-ink">
                No hemos encontrado músicos con esos filtros
              </p>
              <p className="mt-2 max-w-sm text-sm text-ink-muted">
                Prueba a ampliar la búsqueda: elimina algún filtro o cambia la ciudad y el
                tipo de evento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.items.map((m) => (
                <MusicianCard key={m.id} musician={m} />
              ))}
            </div>
          )}

          {results.pageCount > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: results.pageCount }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={buildQuery(sp, { page: p })}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    p === filters.page
                      ? "bg-ink text-cream"
                      : "border border-line text-ink-soft hover:border-ink/30"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
