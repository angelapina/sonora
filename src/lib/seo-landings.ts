import { CITIES, ARTIST_TYPES } from "@/lib/taxonomy-data";

/**
 * Arquitectura de landings SEO.
 *
 * Tres ejes que se combinan para cubrir la long tail real de búsqueda
 * ("dj para bodas en alicante", "cantante en valencia", "música para bodas"):
 *   /musicos/[ciudad]        → ciudad
 *   /musicos/[categoria]     → tipo de artista
 *   /musica-para-[evento]    → ocasión
 *
 * Un único segmento dinámico sirve ciudades y categorías: al resolver el slug
 * decidimos qué tipo de landing es. Así añadir una ciudad o una categoría nueva
 * a la taxonomía crea su página automáticamente, sin tocar rutas.
 */

export type LandingKind = "city" | "category";

export type Landing = {
  kind: LandingKind;
  slug: string;
  /** Valor real para filtrar (nombre de ciudad o slug de ArtistType). */
  value: string;
  label: string;
};

export function citySlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const CITY_LANDINGS: Landing[] = CITIES.map((c) => ({
  kind: "city",
  slug: citySlug(c.name),
  value: c.name,
  label: c.name,
}));

/**
 * Slugs de URL en plural. Las reglas del castellano tienen suficientes
 * excepciones (siglas, palabras acabadas en consonante extranjera) como para
 * que compense una tabla explícita antes que reglas cada vez más retorcidas.
 */
const PLURAL_OVERRIDES: Record<string, string> = {
  dj: "djs",
  percusion: "percusion", // "percusiones" suena raro como categoría
  versiones: "grupos-de-versiones",
};

function pluralize(slug: string) {
  if (PLURAL_OVERRIDES[slug]) return PLURAL_OVERRIDES[slug];
  if (slug.endsWith("s")) return slug;
  if (slug.endsWith("z")) return `${slug.slice(0, -1)}ces`;
  if (/[aeiou]$/.test(slug)) return `${slug}s`;
  return `${slug}es`;
}

export const CATEGORY_LANDINGS: Landing[] = ARTIST_TYPES.filter(
  (t) => t.slug !== "otros"
).map((t) => ({
  kind: "category",
  // pluralizamos para que la URL lea natural: /musicos/cantantes
  slug: pluralize(t.slug),
  value: t.slug,
  label: t.label,
}));

export const ALL_LANDINGS = [...CITY_LANDINGS, ...CATEGORY_LANDINGS];

export function findLanding(slug: string): Landing | undefined {
  return ALL_LANDINGS.find((l) => l.slug === slug);
}

/** Landings por tipo de evento, con su propia URL semántica. */
export const EVENT_LANDINGS = [
  {
    slug: "bodas",
    eventType: "boda",
    label: "bodas",
    h1: "Música para bodas",
    lead: "De la ceremonia al último baile: encuentra a los artistas que pondrán la banda sonora del día más largo del año.",
    sections: [
      { title: "Ceremonia", text: "Violín, cuarteto de cuerda, piano o voz y guitarra para la entrada, la firma y la salida.", artistType: "violinista" },
      { title: "Cóctel", text: "Jazz, bossa o saxo en directo mientras los invitados se saludan y brindan.", artistType: "saxofonista" },
      { title: "Banquete", text: "Música ambiental que acompaña sin tapar las conversaciones de mesa.", artistType: "pianista" },
      { title: "Fiesta", text: "Banda de versiones o DJ para que la pista no se vacíe hasta el final.", artistType: "dj" },
    ],
    faqs: [
      {
        q: "¿Cuánto cuesta la música para una boda?",
        a: "Depende del formato y de cuántos momentos quieras cubrir. Un solista para la ceremonia parte de unos 300 €, un dúo o trío para el cóctel ronda los 500–900 €, y una banda completa para toda la celebración suele moverse entre 1.000 y 2.000 €. En cada perfil de Sonora ves el precio desde y, cuando el artista los ha configurado, paquetes cerrados por momento.",
      },
      {
        q: "¿Con cuánta antelación hay que reservar?",
        a: "Para bodas en temporada alta (mayo a octubre) lo habitual es cerrar con seis meses a un año de antelación. Fuera de temporada, tres o cuatro meses suelen ser suficientes. En Sonora puedes filtrar por fecha para ver solo artistas que la tienen libre.",
      },
      {
        q: "¿Los artistas traen su propio equipo de sonido?",
        a: "Muchos sí, y puedes filtrarlos con la opción “Trae su propio equipo de sonido”. Los que tocan instrumentos acústicos (violín, piano de sala) a veces necesitan que la finca aporte amplificación. Lo indican en su perfil.",
      },
      {
        q: "¿Puedo contratar música solo para la ceremonia?",
        a: "Sí. Muchos artistas ofrecen un paquete específico de ceremonia, de unos 45–60 minutos, y ese suele ser el formato más económico.",
      },
    ],
  },
  {
    slug: "eventos-corporativos",
    eventType: "corporativo",
    label: "eventos corporativos",
    h1: "Música para eventos corporativos",
    lead: "Cenas de empresa, galas, inauguraciones y after-works. Música que encaja con la imagen de tu compañía.",
    sections: [
      { title: "Cenas y galas", text: "Jazz, piano o cuartetos de cuerda que crean ambiente sin interrumpir los discursos.", artistType: "pianista" },
      { title: "Cócteles y networking", text: "Saxo en directo o sesiones de DJ lounge para que la sala tenga energía.", artistType: "saxofonista" },
      { title: "Fiestas de empresa", text: "Bandas de versiones y DJs para el momento en que el equipo se suelta.", artistType: "dj" },
      { title: "Presentaciones", text: "Música de acompañamiento y entradas musicales para lanzamientos de producto.", artistType: "banda" },
    ],
    faqs: [
      {
        q: "¿Emitís factura para la empresa?",
        a: "Los artistas de Sonora son profesionales que facturan con IVA. Puedes indicárselo en la solicitud para que te confirmen los datos de facturación antes de cerrar.",
      },
      {
        q: "¿Qué formato funciona mejor en una cena de empresa?",
        a: "Formatos reducidos y acústicos —piano solo, dúo de jazz, cuarteto de cuerda— porque acompañan sin obligar a levantar la voz. Deja las bandas eléctricas y el DJ para después de los postres.",
      },
      {
        q: "¿Podéis adaptar el repertorio a nuestra marca?",
        a: "La mayoría de artistas personalizan el repertorio si se lo pides con antelación. Coméntalo en el mensaje de la solicitud.",
      },
    ],
  },
  {
    slug: "fiestas",
    eventType: "fiesta-privada",
    label: "fiestas privadas",
    h1: "Música para fiestas privadas",
    lead: "Cumpleaños, aniversarios y celebraciones en casa o en local. Que la gente se levante de la silla.",
    sections: [
      { title: "DJs", text: "Sesiones adaptadas al público que tengas, del reggaetón a los 80.", artistType: "dj" },
      { title: "Bandas de versiones", text: "Directo con los temas que todo el mundo se sabe.", artistType: "versiones" },
      { title: "Formatos acústicos", text: "Dúos y solistas para reuniones más tranquilas.", artistType: "duo" },
      { title: "Percusión y charangas", text: "Para pasacalles, sorpresas y momentos de subidón.", artistType: "percusion" },
    ],
    faqs: [
      {
        q: "¿Cuánto cuesta un DJ para una fiesta privada?",
        a: "Una sesión de tres horas con equipo de sonido básico parte de unos 350 €. Si necesitas sonido para más de 150 personas, iluminación o más horas, suele subir a 500–700 €.",
      },
      {
        q: "¿Se puede contratar música para una casa particular?",
        a: "Sí, es habitual. Ten en cuenta el espacio disponible y el horario permitido por ruido en tu municipio; los artistas suelen preguntarte por ambas cosas antes de confirmar.",
      },
    ],
  },
] as const;

export type EventLanding = (typeof EVENT_LANDINGS)[number];

export function findEventLanding(slug: string): EventLanding | undefined {
  return EVENT_LANDINGS.find((l) => l.slug === slug);
}

/**
 * Combinaciones ciudad × categoría: "/musicos/alicante/djs".
 *
 * Aquí está el grueso del tráfico cualificado de este sector. Nadie busca
 * "marketplace de músicos": buscan "dj para bodas en alicante". Son consultas
 * de baja competencia y altísima intención de compra, y una sola ruta dinámica
 * genera las 12 × 16 = 192 páginas a partir de la taxonomía.
 *
 * Limitamos a las categorías con demanda real de búsqueda local para no crear
 * cientos de páginas casi vacías, que Google interpreta como thin content.
 */
const COMBO_CATEGORY_SLUGS = [
  "cantantes",
  "bandas",
  "djs",
  "saxofonistas",
  "violinistas",
  "pianistas",
  "guitarristas",
  "duos",
  "orquestas",
  "grupos-de-versiones",
];

export type ComboLanding = {
  citySlug: string;
  cityName: string;
  categorySlug: string;
  categoryValue: string;
  categoryLabel: string;
};

export const COMBO_LANDINGS: ComboLanding[] = CITY_LANDINGS.flatMap((city) =>
  CATEGORY_LANDINGS.filter((cat) => COMBO_CATEGORY_SLUGS.includes(cat.slug)).map(
    (cat) => ({
      citySlug: city.slug,
      cityName: city.value,
      categorySlug: cat.slug,
      categoryValue: cat.value,
      categoryLabel: cat.label,
    })
  )
);

export function findComboLanding(
  citySlug: string,
  categorySlug: string
): ComboLanding | undefined {
  return COMBO_LANDINGS.find(
    (c) => c.citySlug === citySlug && c.categorySlug === categorySlug
  );
}
