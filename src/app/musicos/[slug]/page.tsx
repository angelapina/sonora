import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MusicianCard } from "@/components/musician-card";
import { ButtonLink } from "@/components/ui/button";
import { searchMusicians } from "@/lib/data/musicians";
import {
  ALL_LANDINGS,
  CITY_LANDINGS,
  CATEGORY_LANDINGS,
  findLanding,
} from "@/lib/seo-landings";
import { EVENT_LANDINGS } from "@/lib/seo-landings";

export function generateStaticParams() {
  return ALL_LANDINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = findLanding(slug);
  if (!landing) return {};

  const title =
    landing.kind === "city"
      ? `Músicos y artistas en ${landing.label}`
      : `${landing.label} para eventos`;
  const description =
    landing.kind === "city"
      ? `Contrata músicos y artistas en ${landing.label} para bodas, fiestas y eventos de empresa. Escucha, compara precios y consulta disponibilidad en Sonora.`
      : `Contrata ${landing.label.toLowerCase()} para tu boda, fiesta o evento de empresa. Vídeos, audio, precios y disponibilidad real en Sonora.`;

  return {
    title,
    description,
    alternates: { canonical: `/musicos/${landing.slug}` },
    openGraph: { title, description },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = findLanding(slug);
  if (!landing) notFound();

  const results = await searchMusicians({
    ...(landing.kind === "city"
      ? { city: landing.value }
      : { artistTypes: [landing.value] }),
    perPage: 12,
  });

  const h1 =
    landing.kind === "city"
      ? `Músicos y artistas en ${landing.label}`
      : `${landing.label} para eventos`;

  const intro =
    landing.kind === "city"
      ? `Estos son los artistas que actúan en ${landing.label} y alrededores. Escucha cómo suenan, compara precios y comprueba si tienen libre tu fecha antes de escribirles.`
      : `Encuentra ${landing.label.toLowerCase()} para bodas, cócteles, fiestas privadas y eventos de empresa. En cada perfil puedes escuchar audio real, ver vídeos de actuaciones y consultar precios orientativos.`;

  const related =
    landing.kind === "city"
      ? CATEGORY_LANDINGS.slice(0, 8)
      : CITY_LANDINGS.slice(0, 8);
  const relatedTitle =
    landing.kind === "city" ? "Por tipo de artista" : "Por ciudad";

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
      <nav aria-label="Migas de pan" className="text-[13px] text-ink-muted">
        <Link href="/" className="transition-colors hover:text-ink">
          Sonora
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/buscar" className="transition-colors hover:text-ink">
          Músicos
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{landing.label}</span>
      </nav>

      <header className="mt-6 max-w-2xl">
        <h1 className="font-display text-[34px] font-semibold leading-tight tracking-tight text-ink sm:text-[46px]">
          {h1}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-muted">{intro}</p>
        <p className="mt-4 text-[15px] text-ink-muted">
          <strong className="font-semibold text-ink">{results.total}</strong>{" "}
          {results.total === 1 ? "artista disponible" : "artistas disponibles"}
        </p>
      </header>

      {results.items.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-6 lg:grid-cols-4">
          {results.items.map((m) => (
            <MusicianCard key={m.id} musician={m} />
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-2xl border border-dashed border-line p-10 text-center text-[15px] text-ink-muted">
          Todavía no hay artistas publicados aquí. Prueba a{" "}
          <Link href="/buscar" className="text-ink underline underline-offset-2">
            ver todos los artistas
          </Link>
          .
        </p>
      )}

      {results.total > results.items.length && (
        <div className="mt-12 text-center">
          <ButtonLink
            href={
              landing.kind === "city"
                ? `/buscar?city=${encodeURIComponent(landing.value)}`
                : `/buscar?artistType=${landing.value}`
            }
            variant="secondary"
          >
            Ver los {results.total} artistas
          </ButtonLink>
        </div>
      )}

      {/* Texto SEO con contexto real, no relleno */}
      <section className="mt-20 max-w-2xl">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          {landing.kind === "city"
            ? `Contratar música en directo en ${landing.label}`
            : `¿Cuándo encaja contratar ${landing.label.toLowerCase()}?`}
        </h2>
        <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-ink-muted">
          {landing.kind === "city" ? (
            <>
              <p>
                En {landing.label} encontrarás desde solistas para una ceremonia íntima
                hasta bandas completas para cerrar una fiesta. La mayoría de artistas se
                desplazan también a poblaciones cercanas, así que aunque tu evento sea a
                las afueras suele haber opciones.
              </p>
              <p>
                Nuestro consejo: filtra primero por fecha. En temporada alta los mejores
                artistas de {landing.label} se reservan con meses de antelación, y ver
                solo a quien tiene tu día libre te ahorra escribir a gente que ya no puede
                cogerlo.
              </p>
            </>
          ) : (
            <>
              <p>
                {landing.label} funciona especialmente bien cuando quieres un formato
                concreto y ya tienes claro el ambiente que buscas. En cada perfil verás el
                repertorio, el número de músicos, si traen equipo de sonido propio y hasta
                dónde se desplazan.
              </p>
              <p>
                Escucha siempre el audio antes de escribir: es la forma más rápida de
                descartar. Dos artistas de la misma categoría pueden sonar completamente
                distintos.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Internal linking */}
      <section className="mt-16 border-t border-line pt-10">
        <h2 className="text-[15px] font-semibold text-ink">{relatedTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/musicos/${r.slug}`}
              className="rounded-full border border-line px-4 py-2 text-[13px] text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
            >
              {r.label}
            </Link>
          ))}
        </div>

        <h2 className="mt-8 text-[15px] font-semibold text-ink">Por tipo de evento</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {EVENT_LANDINGS.map((e) => (
            <Link
              key={e.slug}
              href={`/musica-para/${e.slug}`}
              className="rounded-full border border-line px-4 py-2 text-[13px] text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
            >
              Música para {e.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
