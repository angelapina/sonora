import Link from "next/link";
import { HeroWords } from "@/components/hero-headline";
import { HeroSearch } from "@/components/hero-search";
import { RotatingWord } from "@/components/rotating-word";
import { OccasionGrid } from "@/components/occasion-grid";
import { MusicianCard } from "@/components/musician-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHead, ArrowLink } from "@/components/ui/layout";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { HorizontalRow, RowItem } from "@/components/horizontal-row";
import { home } from "@/lib/copy";
import { getFeaturedMusicians } from "@/lib/data/musicians";

export default async function HomePage() {
  const featured = await getFeaturedMusicians(12);

  /**
   * Las tres filas de artistas comparten estructura, así que se declaran como
   * datos. Además de quitar repetición, garantiza que tengan exactamente el
   * mismo ritmo — de lo que más depende que la página se lea ordenada.
   */
  /**
   * Solo una fila: los destacados. "Suenan en tu ciudad" se retiró porque
   * prometía proximidad sin usar la ubicación real del visitante —una promesa
   * que la web no podía cumplir— y "Nuevos en Sonora" repetía el mismo formato
   * sin aportar un criterio distinto de descubrimiento.
   */
  const rows = [{ copy: home.featured, items: featured }].filter(
    (row) => row.items.length > 0
  );

  return (
    <>
      {/* ---------- HERO ----------
          Fondo oscuro, tipografía enorme y nada más. La escala del titular es
          fluida (clamp), así que no hay saltos bruscos entre móvil y escritorio:
          crece de forma continua con el ancho de la pantalla. */}
      <section className="bg-ink pt-[clamp(2.5rem,1.5rem+3.5vw,5rem)] pb-[clamp(3rem,2rem+3.5vw,5.5rem)] text-white">
        <Container size="wide" className="max-w-[1500px] text-center">
          <p className="animate-fade-up t-eyebrow text-white/50">{home.hero.eyebrow}</p>

          <h1 className="t-display mt-3 text-balance">
            <HeroWords text={home.hero.titleStart} />{" "}
            <RotatingWord
              words={home.hero.titleWords}
              intervalMs={2600}
              className="text-coral"
            />
          </h1>

          <p className="animate-fade-up t-lead mx-auto mt-6 max-w-xl text-white/65 [animation-delay:520ms]">
            {home.hero.subtitle}
          </p>

          <div className="animate-fade-up mt-10 [animation-delay:620ms]">
            <HeroSearch />
          </div>

          <p className="animate-fade-up t-small mt-6 text-white/45 [animation-delay:720ms]">
            ¿Prefieres que te propongamos nosotros?{" "}
            <Link
              href="/match"
              className="font-medium text-white underline decoration-coral decoration-2 underline-offset-4 transition-colors hover:text-coral"
            >
              Responde 5 preguntas
            </Link>
          </p>
        </Container>
      </section>

      {/* ---------- OCASIONES ---------- */}
      <Section className="bg-cream-soft">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow={home.occasions.eyebrow}
              title={home.occasions.title}
              subtitle={home.occasions.subtitle}
              action={
                <ArrowLink href="/buscar" tone="muted">
                  Ver todo
                </ArrowLink>
              }
            />
            <div className="stack-head">
              <OccasionGrid />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------- FILAS DE ARTISTAS ---------- */}
      <Section>
        <Container>
          <div className="flex flex-col gap-[clamp(3rem,2rem+4vw,5rem)]">
            {rows.map((row) => (
              <Reveal key={row.copy.title}>
                <SectionHead
                  eyebrow={row.copy.eyebrow}
                  title={row.copy.title}
                  action={
                    <ArrowLink href={row.copy.href} tone="muted">
                      Ver todos
                    </ArrowLink>
                  }
                />
                <div className="stack-head">
                  <HorizontalRow>
                    {row.items.map((m) => (
                      <RowItem key={m.id}>
                        <MusicianCard musician={m} />
                      </RowItem>
                    ))}
                  </HorizontalRow>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- ENCUENTRA TU MATCH ----------
          Único bloque en índigo: aporta el contrapunto de color sin romper la
          contención, y marca el punto de la página donde se pide algo distinto
          (responder preguntas en vez de navegar). */}
      <Section flushTop>
        <Container>
          <Reveal>
            <div className="rounded-[var(--radius-panel)] bg-ink px-6 py-[clamp(3rem,2rem+4vw,5rem)] text-center text-white sm:px-14">
              <p className="t-eyebrow text-white/55">{home.match.eyebrow}</p>
              <h2 className="t-h2 mx-auto mt-3 max-w-xl">{home.match.title}</h2>
              <p className="t-lead mx-auto mt-4 max-w-md text-white/65">
                {home.match.subtitle}
              </p>
              <ButtonLink href="/match" size="lg" className="mt-9">
                {home.match.cta}
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------- BENEFICIOS ----------
          Va después de las reseñas y antes del cierre: el usuario ya ha visto
          artistas y pruebas sociales, y este es el punto donde se pregunta
          "¿y por qué contratar aquí y no llamarle yo?". */}
      <Section className="bg-cream-soft">
        <Container>
          <Reveal>
            <SectionHead
              align="center"
              eyebrow={home.benefits.eyebrow}
              title={home.benefits.title}
            />
          </Reveal>

          <RevealGroup className="stack-head grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {home.benefits.items.map((b, i) => (
              <RevealItem key={b.title}>
                <span className="t-small inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink font-medium text-white">
                  {i + 1}
                </span>
                <h3 className="t-h3 mt-4 text-ink">{b.title}</h3>
                <p className="t-body mt-2 text-ink-muted">{b.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---------- CIERRE: CAPTACIÓN DE ARTISTAS ---------- */}
      <Section flushTop className="bg-cream-soft">
        <Container size="narrow">
          <Reveal>
            <div className="flex flex-col items-center rounded-[var(--radius-panel)] bg-paper px-6 py-[clamp(3.5rem,2.5rem+4vw,5rem)] text-center shadow-[var(--shadow-card)] sm:px-14">
              <span aria-hidden className="text-[44px] leading-none">
                {home.closing.emoji}
              </span>
              <p className="t-eyebrow mt-6 text-ink-muted">{home.closing.eyebrow}</p>
              <h2 className="t-h1 mt-3 max-w-lg text-ink">{home.closing.title}</h2>
              <p className="t-lead mx-auto mt-5 max-w-md text-ink-muted">
                {home.closing.subtitle}
              </p>
              <div className="mt-9 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-8">
                <ButtonLink href={home.closing.href} size="lg" className="w-full sm:w-auto">
                  {home.closing.cta}
                </ButtonLink>
                <ArrowLink href={home.closing.secondaryHref}>
                  {home.closing.secondary}
                </ArrowLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
