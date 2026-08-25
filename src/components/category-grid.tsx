import Link from "next/link";

/**
 * Descubrir artistas por categoría.
 *
 * Sustituye a las columnas de enlaces de texto: eran correctas pero mudas, y
 * esta es una sección de descubrimiento — el usuario que llega aquí todavía no
 * sabe lo que quiere, así que necesita estímulo visual, no una lista.
 *
 * Mezcla deliberadamente dos ejes que la gente usa indistintamente al buscar
 * música para un evento: la disciplina ("un DJ") y la ocasión ("algo para mi
 * boda"). Separarlos en dos secciones obligaba a entender una taxonomía que al
 * cliente no le interesa; juntarlos refleja cómo piensa de verdad.
 *
 * Cada destino es una URL real —filtro de búsqueda o landing SEO— así que la
 * sección también reparte autoridad hacia las páginas que queremos posicionar.
 */
type Category = {
  label: string;
  icon: string;
  href: string;
  /** Las de ocasión llevan un tono distinto para que se lean como otro eje. */
  kind: "artista" | "ocasion";
};

const CATEGORIES: Category[] = [
  { label: "Cantantes", icon: "🎤", href: "/musicos/cantantes", kind: "artista" },
  { label: "Bandas", icon: "🎸", href: "/musicos/bandas", kind: "artista" },
  { label: "DJs", icon: "🎧", href: "/musicos/djs", kind: "artista" },
  { label: "Jazz", icon: "🎺", href: "/buscar?genre=jazz", kind: "artista" },
  { label: "Música clásica", icon: "🎻", href: "/buscar?genre=clasica", kind: "artista" },
  { label: "Flamenco", icon: "🪕", href: "/buscar?genre=flamenco", kind: "artista" },
  { label: "Piano", icon: "🎹", href: "/musicos/pianistas", kind: "artista" },
  { label: "Percusión", icon: "🥁", href: "/musicos/percusion", kind: "artista" },
  { label: "Charangas", icon: "🎉", href: "/musicos/charangas", kind: "artista" },
  { label: "Música para bodas", icon: "💍", href: "/musica-para/bodas", kind: "ocasion" },
  { label: "Música para fiestas", icon: "🎊", href: "/musica-para/fiestas", kind: "ocasion" },
  { label: "Eventos corporativos", icon: "🏢", href: "/musica-para/eventos-corporativos", kind: "ocasion" },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {CATEGORIES.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className={[
            "group flex min-h-[76px] items-center gap-3 rounded-[var(--radius-card)] border px-4 py-4",
            "transition-all duration-300 ease-[var(--ease-premium)]",
            "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
            c.kind === "ocasion"
              ? "border-transparent bg-indigo-soft hover:bg-indigo-soft"
              : "border-line bg-paper hover:border-ink/15",
          ].join(" ")}
        >
          <span
            aria-hidden
            className="text-[22px] leading-none transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-110"
          >
            {c.icon}
          </span>
          <span className="text-[14px] font-medium leading-snug text-ink">{c.label}</span>
        </Link>
      ))}
    </div>
  );
}
