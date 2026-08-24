import { CITIES } from "@/lib/taxonomy-data";

type Taxonomy = { slug: string; label: string; icon?: string | null }[];

export function SearchFilters({
  artistTypes,
  genres,
  eventTypes,
  current,
}: {
  artistTypes: Taxonomy;
  genres: Taxonomy;
  eventTypes: Taxonomy;
  current: {
    q?: string;
    city?: string;
    eventType?: string;
    artistType: string[];
    genre: string[];
    priceMin?: string;
    priceMax?: string;
  };
}) {
  return (
    <form method="GET" action="/buscar" className="space-y-7">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Buscar
        </label>
        <input
          type="text"
          name="q"
          defaultValue={current.q}
          placeholder="Nombre, estilo…"
          className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Ciudad
        </label>
        <select
          name="city"
          defaultValue={current.city ?? ""}
          className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-coral"
        >
          <option value="">Cualquier ciudad</option>
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Tipo de evento
        </label>
        <select
          name="eventType"
          defaultValue={current.eventType ?? ""}
          className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-coral"
        >
          <option value="">Cualquier evento</option>
          {eventTypes.map((e) => (
            <option key={e.slug} value={e.slug}>
              {e.icon} {e.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Presupuesto (€)
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            name="priceMin"
            defaultValue={current.priceMin}
            placeholder="Desde"
            min={0}
            className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-coral"
          />
          <span className="text-ink-muted">—</span>
          <input
            type="number"
            name="priceMax"
            defaultValue={current.priceMax}
            placeholder="Hasta"
            min={0}
            className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Tipo de artista
        </legend>
        <div className="flex flex-wrap gap-2">
          {artistTypes.map((t) => (
            <label
              key={t.slug}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium has-[:checked]:border-coral has-[:checked]:bg-coral/10 has-[:checked]:text-coral-dark"
            >
              <input
                type="checkbox"
                name="artistType"
                value={t.slug}
                defaultChecked={current.artistType.includes(t.slug)}
                className="sr-only"
              />
              {t.icon} {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Género musical
        </legend>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <label
              key={g.slug}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium has-[:checked]:border-coral has-[:checked]:bg-coral/10 has-[:checked]:text-coral-dark"
            >
              <input
                type="checkbox"
                name="genre"
                value={g.slug}
                defaultChecked={current.genre.includes(g.slug)}
                className="sr-only"
              />
              {g.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
        >
          Aplicar filtros
        </button>
        <a
          href="/buscar"
          className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/30"
        >
          Limpiar
        </a>
      </div>
    </form>
  );
}
