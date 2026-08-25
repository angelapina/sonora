/**
 * Datos estructurados (JSON-LD) y utilidades de SEO.
 *
 * Por qué esto importa más que las meta tags: los `AggregateRating` y `Offer`
 * de los perfiles son lo que hace que Google pinte las estrellas y el "desde
 * 450 €" directamente en los resultados. Ese rich snippet sube el CTR mucho
 * más que subir una posición, y es la palanca que sí controlamos desde el
 * código (la posición depende de autoridad, enlaces y tiempo).
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonora-theta-eight.vercel.app";

export const SITE_NAME = "Sonora";

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Identidad del sitio. Va una sola vez, en el layout raíz. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Marketplace para descubrir y contratar músicos y artistas en directo para bodas, fiestas y eventos de empresa en España.",
    areaServed: { "@type": "Country", name: "España" },
  };
}

/**
 * WebSite + SearchAction: permite que Google muestre una caja de búsqueda
 * propia de Sonora dentro del resultado de marca.
 */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "es-ES",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type MusicianForJsonLd = {
  slug: string;
  stageName: string;
  tagline: string | null;
  bio: string | null;
  city: string;
  coverUrl: string | null;
  avatarUrl: string | null;
  priceFrom: number | null;
  ratingAvg: number;
  ratingCount: number;
  genres: { label: string }[];
  artistTypes: { label: string }[];
};

/**
 * Perfil de artista. Usamos `MusicGroup` (vale igual para solistas a ojos de
 * Schema.org) y le colgamos:
 *  - aggregateRating → estrellas en el resultado de búsqueda
 *  - makesOffer/priceSpecification → el "desde X €"
 * Solo emitimos aggregateRating si hay reseñas reales: inventarlo es motivo de
 * penalización manual por parte de Google.
 */
export function musicianJsonLd(m: MusicianForJsonLd) {
  const url = absoluteUrl(`/musico/${m.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": `${url}#artist`,
    name: m.stageName,
    url,
    description: m.tagline ?? m.bio ?? undefined,
    image: m.coverUrl ?? m.avatarUrl ?? undefined,
    genre: m.genres.map((g) => g.label),
    location: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: m.city, addressCountry: "ES" },
    },
    ...(m.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: m.ratingAvg.toFixed(1),
            reviewCount: m.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(m.priceFrom
      ? {
          makesOffer: {
            "@type": "Offer",
            name: `${m.artistTypes[0]?.label ?? "Actuación"} en ${m.city}`,
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: m.priceFrom,
              priceCurrency: "EUR",
            },
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {}),
  };
}

/** Listado de artistas: ayuda a Google a entender que la página es un catálogo. */
export function itemListJsonLd(
  items: { slug: string; stageName: string }[],
  listName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/musico/${m.slug}`),
      name: m.stageName,
    })),
  };
}

export function faqJsonLd(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
