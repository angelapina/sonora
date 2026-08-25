import { CITIES, ARTIST_KINDS } from "@/lib/taxonomy-data";

type Taxonomy = { slug: string; label: string; icon?: string | null; kind?: string }[];

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
    date?: string;
    minRating?: string;
    verifiedOnly?: boolean;
    equipmentOnly?: boolean;
  };
}) {
  return (
    <form method="GET" action="/buscar" className="space-y-7">
      {/* Aplicar va arriba y pegado, no al final.
          El formulario es largo: con el botón abajo había que recorrer todos
          los filtros para confirmar, y en la hoja del móvil eso significaba
          perder de vista lo que acababas de marcar. Al ser `sticky` dentro del
          contenedor con scroll, la acción sigue a la vista mientras filtras.
          El fondo cambia de contexto: la hoja del móvil es blanca y el panel de
          escritorio va sobre el crema de la página. Los márgenes negativos
          compensan el `px-5` de la hoja para que la barra tape todo el ancho y
          no se vea el contenido colarse por los lados. */}
      <div className="sticky top-0 z-10 -mx-5 flex gap-3 border-b border-line bg-white px-5 pb-4 pt-1 lg:mx-0 lg:border-none lg:bg-cream lg:px-0 lg:pb-0 lg:pt-0">
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

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Fecha del evento
        </label>
        <input
          type="date"
          name="date"
          defaultValue={current.date}
          className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
        <p className="mt-1.5 text-[12px] text-ink-muted">
          Solo verás artistas con esa fecha libre.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Valoración mínima
        </label>
        <select
          name="minRating"
          defaultValue={current.minRating ?? ""}
          className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-coral"
        >
          <option value="">Cualquier valoración</option>
          <option value="4.8">4,8 o más</option>
          <option value="4.5">4,5 o más</option>
          <option value="4">4 o más</option>
        </select>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Confianza y servicios
        </legend>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              name="verifiedOnly"
              value="1"
              defaultChecked={current.verifiedOnly}
              className="h-4 w-4 rounded border-line accent-coral"
            />
            Solo artistas verificados
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              name="equipmentOnly"
              value="1"
              defaultChecked={current.equipmentOnly}
              className="h-4 w-4 rounded border-line accent-coral"
            />
            Trae su propio equipo de sonido
          </label>
        </div>
      </fieldset>

      {/* Los tipos van agrupados por disciplina: mezclar "Pianista" con
          "Espectáculo de fuego" en una sola lista obliga a leerla entera. */}
      {ARTIST_KINDS.map((kind) => {
        const types = artistTypes.filter((t) => (t.kind ?? "musico") === kind.kind);
        if (types.length === 0) return null;
        return (
          <fieldset key={kind.kind}>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {kind.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <label
                  key={t.slug}
                  className="flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium has-[:checked]:border-coral has-[:checked]:bg-coral/10 has-[:checked]:text-coral-dark"
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
        );
      })}

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

    </form>
  );
}
