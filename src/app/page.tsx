import Link from "next/link";
import { Music3, MessagesSquare, ShieldCheck } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { CategoryGrid } from "@/components/category-grid";
import { SectionHeading } from "@/components/section-heading";
import { MusicianCard } from "@/components/musician-card";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { HorizontalRow, RowItem } from "@/components/horizontal-row";
import { ScrollStory, type StorySlide } from "@/components/scroll-story";
import {
  getFeaturedMusicians,
  getMostBookedMusicians,
  getNewMusicians,
} from "@/lib/data/musicians";

const STORY_SLIDES: StorySlide[] = [
  {
    image: "https://picsum.photos/seed/sonora-story-boda/1800/1200",
    eyebrow: "Para toda la vida",
    title: "La banda sonora de tu boda.",
    href: "/buscar?eventType=boda",
  },
  {
    image: "https://picsum.photos/seed/sonora-story-corporativo/1800/1200",
    eyebrow: "Eventos de empresa",
    title: "Impresiona sin esfuerzo.",
    href: "/buscar?eventType=corporativo",
  },
  {
    image: "https://picsum.photos/seed/sonora-story-fiesta/1800/1200",
    eyebrow: "Fiestas privadas",
    title: "Que nadie se quede sentado.",
    href: "/buscar?eventType=fiesta-privada",
  },
  {
    image: "https://picsum.photos/seed/sonora-story-hotel/1800/1200",
    eyebrow: "Restaurantes y hoteles",
    title: "El ambiente correcto, siempre.",
    href: "/buscar?eventType=hotel",
  },
];

export default async function HomePage() {
  const [featured, mostBooked, fresh] = await Promise.all([
    getFeaturedMusicians(10),
    getMostBookedMusicians(10),
    getNewMusicians(10),
  ]);

  return (
    <>
      {/* Hero — Apple-style: mucho aire, una sola idea, tipografía enorme */}
      <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-16 text-center sm:min-h-[92vh] sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-cream-soft to-transparent"
        />

        <p className="animate-fade-up text-[13px] font-medium text-ink-muted">
          Más de 500 músicos y artistas verificados
        </p>

        <h1 className="animate-fade-up mt-5 max-w-4xl font-display text-[42px] font-semibold leading-[1.06] tracking-tight text-ink [animation-delay:90ms] sm:text-[64px] md:text-[76px]">
          Encuentra la música
          <br />
          perfecta para tu momento.
        </h1>

        <p className="animate-fade-up mt-6 max-w-md text-balance text-lg text-ink-muted [animation-delay:160ms]">
          Descubre músicos y artistas cerca de ti.
        </p>

        <div className="animate-fade-up mt-10 w-full max-w-xl [animation-delay:230ms]">
          <SearchBar />
        </div>

        <div className="animate-fade-up mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-sm text-ink-muted [animation-delay:300ms]">
          <span><strong className="font-semibold text-ink">12</strong> ciudades</span>
          <span><strong className="font-semibold text-ink">4.8</strong> valoración media</span>
          <span><strong className="font-semibold text-ink">+1.000</strong> eventos amenizados</span>
        </div>
      </section>

      {/* Scrollytelling — la historia se cuenta mientras haces scroll */}
      <ScrollStory slides={STORY_SLIDES} />

      <div className="mx-auto max-w-7xl space-y-20 px-6 py-20 sm:space-y-28 sm:py-28 lg:space-y-32 lg:py-32">
        {/* Categorías */}
        <Reveal>
          <div className="text-center">
            <p className="text-[13px] font-medium text-coral">Explora</p>
            <h2 className="mx-auto mt-1.5 max-w-lg font-display text-[28px] font-semibold tracking-tight text-ink sm:text-[34px]">
              ¿Qué estás buscando?
            </h2>
          </div>
          <div className="mt-9">
            <CategoryGrid />
          </div>
        </Reveal>

        {/* Recomendados */}
        {featured.length > 0 && (
          <Reveal>
            <SectionHeading eyebrow="Seleccionados por Sonora" title="Recomendados" href="/buscar" />
            <div className="mt-9">
              <HorizontalRow>
                {featured.map((m) => (
                  <RowItem key={m.id}>
                    <MusicianCard musician={m} />
                  </RowItem>
                ))}
              </HorizontalRow>
            </div>
          </Reveal>
        )}

        {/* Más contratados */}
        <Reveal>
          <SectionHeading eyebrow="Con más reseñas" title="Los más contratados" href="/buscar" />
          <div className="mt-9">
            <HorizontalRow>
              {mostBooked.map((m) => (
                <RowItem key={m.id}>
                  <MusicianCard musician={m} />
                </RowItem>
              ))}
            </HorizontalRow>
          </div>
        </Reveal>

        {/* Nuevos artistas */}
        <Reveal>
          <SectionHeading eyebrow="Recién llegados" title="Descubre nuevos artistas" href="/buscar" />
          <div className="mt-9">
            <HorizontalRow>
              {fresh.map((m) => (
                <RowItem key={m.id}>
                  <MusicianCard musician={m} />
                </RowItem>
              ))}
            </HorizontalRow>
          </div>
        </Reveal>
      </div>

      {/* Cómo funciona */}
      <section className="bg-cream-soft py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <p className="text-[13px] font-medium text-coral">Simple y sin sorpresas</p>
            <h2 className="mx-auto mt-1.5 max-w-md font-display text-[28px] font-semibold tracking-tight text-ink sm:text-[34px]">
              Tu músico ideal en 3 pasos
            </h2>
          </Reveal>

          <RevealGroup className="mt-16 grid gap-14 sm:grid-cols-3 sm:gap-8">
            {[
              {
                icon: Music3,
                title: "Busca y compara",
                text: "Filtra por ciudad, estilo, evento y presupuesto entre cientos de perfiles.",
              },
              {
                icon: MessagesSquare,
                title: "Escucha y contacta",
                text: "Mira vídeos, escucha audio y consulta disponibilidad real.",
              },
              {
                icon: ShieldCheck,
                title: "Contrata con confianza",
                text: "Habla con el artista y reserva tu fecha con tranquilidad.",
              },
            ].map((step, i) => (
              <RevealItem key={step.title} className="text-center sm:text-left">
                <span className="font-display text-sm font-semibold text-coral">0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{step.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA músicos — el único momento dramático/oscuro, al estilo Apple */}
      <section className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-ink px-6 py-20 text-center text-white sm:min-h-[70vh] sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background:radial-gradient(60%_50%_at_50%_0%,rgba(255,90,60,0.25),transparent)]"
        />
        <Reveal className="flex flex-col items-center">
          <p className="text-[13px] font-medium text-white/50">Para músicos y artistas</p>
          <h2 className="mt-3 max-w-2xl font-display text-[32px] font-semibold leading-tight tracking-tight sm:text-[46px]">
            Consigue más bolos con un perfil profesional.
          </h2>
          <p className="mt-5 max-w-md text-white/60">
            Sube tus vídeos, fotos y audio, define tus precios y gestiona tus
            solicitudes. Crear tu perfil es gratis.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
            <ButtonLink href="/registro/musico" size="lg">
              Crear mi perfil gratis
            </ButtonLink>
            <Link
              href="/precios"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Ver planes premium →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
