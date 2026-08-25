import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MusicianCard } from "@/components/musician-card";
import { ButtonLink } from "@/components/ui/button";
import { FaqList } from "@/components/faq-list";
import { searchMusicians } from "@/lib/data/musicians";
import { EVENT_LANDINGS, findEventLanding, CITY_LANDINGS } from "@/lib/seo-landings";

export function generateStaticParams() {
  return EVENT_LANDINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const l = findEventLanding(slug);
  if (!l) return {};

  const title = `${l.h1}: precios y artistas`;
  return {
    title,
    description: l.lead,
    alternates: { canonical: `/musica-para/${l.slug}` },
    openGraph: { title, description: l.lead },
  };
}

export default async function EventLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = findEventLanding(slug);
  if (!landing) notFound();

  const results = await searchMusicians({
    eventType: landing.eventType,
    perPage: 8,
  });

  // JSON-LD para rich snippet de FAQ en Google
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <nav aria-label="Migas de pan" className="text-[13px] text-ink-muted">
          <Link href="/" className="transition-colors hover:text-ink">
            Sonora
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink capitalize">{landing.label}</span>
        </nav>

        <header className="mt-6 max-w-2xl">
          <h1 className="font-display text-[34px] font-semibold leading-tight tracking-tight text-ink sm:text-[48px]">
            {landing.h1}
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-muted">{landing.lead}</p>
          <ButtonLink
            href={`/buscar?eventType=${landing.eventType}`}
            size="lg"
            className="mt-7"
          >
            Ver artistas para {landing.label} <ArrowRight size={16} />
          </ButtonLink>
        </header>

        {/* Momentos / subcategorías */}
        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[30px]">
            {landing.slug === "bodas"
              ? "Cada momento pide algo distinto"
              : "Qué formato encaja mejor"}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {landing.sections.map((s) => (
              <Link
                key={s.title}
                href={`/buscar?eventType=${landing.eventType}&artistType=${s.artistType}`}
                className="group rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/25"
              >
                <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{s.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-coral">
                  Ver artistas
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Artistas */}
        {results.items.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[30px]">
              Artistas para {landing.label}
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-6 lg:grid-cols-4">
              {results.items.map((m) => (
                <MusicianCard key={m.id} musician={m} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <ButtonLink href={`/buscar?eventType=${landing.eventType}`} variant="secondary">
                Ver los {results.total} artistas
              </ButtonLink>
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="mt-20 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[30px]">
            Preguntas frecuentes
          </h2>
          <div className="mt-8">
            <FaqList faqs={landing.faqs} />
          </div>
        </section>

        {/* Internal linking por ciudad */}
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-[15px] font-semibold text-ink">
            Música para {landing.label} por ciudad
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {CITY_LANDINGS.map((c) => (
              <Link
                key={c.slug}
                href={`/buscar?eventType=${landing.eventType}&city=${encodeURIComponent(c.value)}`}
                className="rounded-full border border-line px-4 py-2 text-[13px] text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
