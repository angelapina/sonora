import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MusicianCard } from "@/components/musician-card";
import { ButtonLink } from "@/components/ui/button";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { searchMusicians } from "@/lib/data/musicians";
import { formatPrice } from "@/lib/utils";
import {
  COMBO_LANDINGS,
  findComboLanding,
  CITY_LANDINGS,
  EVENT_LANDINGS,
} from "@/lib/seo-landings";
import { breadcrumbJsonLd, itemListJsonLd, faqJsonLd, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return COMBO_LANDINGS.map((c) => ({
    slug: c.citySlug,
    categoria: c.categorySlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; categoria: string }>;
}): Promise<Metadata> {
  const { slug, categoria } = await params;
  const l = findComboLanding(slug, categoria);
  if (!l) return {};

  const title = `${l.categoryLabel} en ${l.cityName} para bodas y eventos`;
  const description = `Contrata ${l.categoryLabel.toLowerCase()} en ${l.cityName} para tu boda, fiesta o evento de empresa. Escucha audio real, mira vídeos, compara precios y consulta disponibilidad.`;

  return {
    title,
    description,
    alternates: { canonical: `/musicos/${l.citySlug}/${l.categorySlug}` },
    openGraph: { title, description, url: absoluteUrl(`/musicos/${l.citySlug}/${l.categorySlug}`) },
  };
}

export default async function ComboLandingPage({
  params,
}: {
  params: Promise<{ slug: string; categoria: string }>;
}) {
  const { slug, categoria } = await params;
  const landing = findComboLanding(slug, categoria);
  if (!landing) notFound();

  const results = await searchMusicians({
    city: landing.cityName,
    artistTypes: [landing.categoryValue],
    perPage: 12,
  });

  const cheapest = results.items
    .map((m) => m.priceFrom)
    .filter((p): p is number => typeof p === "number")
    .sort((a, b) => a - b)[0];

  const cat = landing.categoryLabel.toLowerCase();
  const city = landing.cityName;

  // FAQs con respuesta real basada en los datos de la propia página: Google
  // premia el contenido específico, y de paso resuelve la duda del usuario.
  const faqs = [
    {
      q: `¿Cuánto cuesta contratar ${cat} en ${city}?`,
      a: cheapest
        ? `En Sonora hay ${cat} en ${city} desde ${formatPrice(cheapest)}. El precio final depende de la duración de la actuación, el número de músicos, si hace falta equipo de sonido y el desplazamiento hasta el lugar del evento. Muchos artistas publican paquetes cerrados (ceremonia, cóctel, evento completo) en su perfil.`
        : `El precio depende de la duración, el formato y el desplazamiento. Cada perfil de Sonora muestra un precio orientativo "desde" y, cuando el artista los ha configurado, paquetes cerrados por tipo de momento.`,
    },
    {
      q: `¿Con cuánta antelación conviene reservar?`,
      a: `Para fechas en temporada alta (de mayo a octubre, y los fines de semana) lo habitual es reservar con seis meses o más de antelación. Fuera de temporada, con dos o tres meses suele bastar. En Sonora puedes filtrar por fecha para ver solo ${cat} que tienen tu día libre.`,
    },
    {
      q: `¿Los ${cat} de ${city} se desplazan a otras localidades?`,
      a: `La mayoría sí. En cada perfil se indica el radio de desplazamiento en kilómetros desde su ciudad base. Si tu evento es a las afueras de ${city} o en una finca cercana, lo normal es que esté cubierto, aunque puede aplicarse un coste de desplazamiento.`,
    },
    {
      q: `¿Puedo escuchar cómo suenan antes de contratar?`,
      a: `Sí, y es lo que recomendamos hacer siempre. Cada perfil incluye muestras de audio y vídeos de actuaciones reales. Dos artistas de la misma categoría pueden sonar completamente distintos, así que escuchar es la forma más rápida de descartar.`,
    },
  ];

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Sonora", path: "/" },
      { name: "Músicos", path: "/buscar" },
      { name: city, path: `/musicos/${landing.citySlug}` },
      { name: landing.categoryLabel, path: `/musicos/${landing.citySlug}/${landing.categorySlug}` },
    ]),
    faqJsonLd(faqs),
    ...(results.items.length
      ? [itemListJsonLd(results.items, `${landing.categoryLabel} en ${city}`)]
      : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-20">
      <JsonLd data={jsonLd} />

      <nav aria-label="Migas de pan" className="flex flex-wrap gap-1.5 text-[13px] text-ink-muted">
        <Link href="/" className="transition-colors hover:text-ink">Sonora</Link>
        <span>/</span>
        <Link href={`/musicos/${landing.citySlug}`} className="transition-colors hover:text-ink">
          {city}
        </Link>
        <span>/</span>
        <span className="text-ink">{landing.categoryLabel}</span>
      </nav>

      <header className="mt-6 max-w-2xl">
        <h1 className="font-display text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-[46px]">
          {landing.categoryLabel} en {city}
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-muted sm:text-[17px]">
          {results.total > 0 ? (
            <>
              <strong className="font-semibold text-ink">{results.total}</strong>{" "}
              {results.total === 1 ? "artista disponible" : "artistas disponibles"} para
              bodas, fiestas y eventos de empresa en {city}
              {cheapest ? (
                <>
                  , desde{" "}
                  <strong className="font-semibold text-ink">{formatPrice(cheapest)}</strong>
                </>
              ) : null}
              . Escúchalos antes de reservar.
            </>
          ) : (
            <>
              Todavía no hay {cat} publicados en {city}. Mira los artistas disponibles en
              otras categorías o ciudades cercanas.
            </>
          )}
        </p>
      </header>

      {results.items.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 lg:grid-cols-4">
          {results.items.map((m) => (
            <MusicianCard key={m.id} musician={m} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-8 text-center">
          <ButtonLink href={`/musicos/${landing.citySlug}`} variant="secondary">
            Ver todos los artistas de {city}
          </ButtonLink>
        </div>
      )}

      {results.total > results.items.length && (
        <div className="mt-10 text-center">
          <ButtonLink
            href={`/buscar?city=${encodeURIComponent(city)}&artistType=${landing.categoryValue}`}
            variant="secondary"
          >
            Ver los {results.total} artistas
          </ButtonLink>
        </div>
      )}

      <section className="mt-16 max-w-2xl sm:mt-20">
        <h2 className="font-display text-[22px] font-semibold tracking-tight text-ink sm:text-2xl">
          Contratar {cat} en {city}
        </h2>
        <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-ink-muted">
          <p>
            {city} tiene una escena de música en directo con formatos para cada tipo de
            evento. Si buscas {cat}, lo primero es tener claros tres datos: la fecha, el
            aforo aproximado y en qué momento de la celebración quieres música. Con eso,
            filtrar lleva menos de un minuto.
          </p>
          <p>
            Escucha siempre las muestras de audio antes de escribir. Es lo que separa una
            contratación tranquila de una sorpresa el día del evento.
          </p>
        </div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-[22px] font-semibold tracking-tight text-ink sm:text-2xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-6">
          <FaqList faqs={faqs} />
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-8">
        <h2 className="text-[15px] font-semibold text-ink">
          {landing.categoryLabel} en otras ciudades
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CITY_LANDINGS.filter((c) => c.slug !== landing.citySlug).map((c) => (
            <Link
              key={c.slug}
              href={`/musicos/${c.slug}/${landing.categorySlug}`}
              className="rounded-full border border-line px-4 py-2.5 text-[13px] text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
            >
              {c.label}
            </Link>
          ))}
        </div>

        <h2 className="mt-8 text-[15px] font-semibold text-ink">Por tipo de evento</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {EVENT_LANDINGS.map((e) => (
            <Link
              key={e.slug}
              href={`/musica-para/${e.slug}`}
              className="rounded-full border border-line px-4 py-2.5 text-[13px] text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
            >
              Música para {e.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
