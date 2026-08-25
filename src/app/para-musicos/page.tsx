import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { musicians as copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Consigue más bolos con tu perfil en Sonora | Para músicos",
  description:
    "Crea tu perfil gratis, sube tus vídeos y recibe solicitudes de clientes que buscan música en directo para bodas, fiestas y eventos de empresa.",
  alternates: { canonical: "/para-musicos" },
};

const PLANS = [
  {
    name: "Gratuito",
    price: "0 €",
    period: "para siempre",
    features: [
      "Perfil público completo",
      "Fotos, vídeos y audio",
      "Calendario de disponibilidad",
      "Paquetes de precio",
      "Solicitudes y mensajería ilimitadas",
    ],
    cta: "Crear mi perfil gratis",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "19 €",
    period: "al mes",
    features: [
      "Todo lo del plan gratuito",
      "Insignia Premium en tu perfil",
      "Prioridad en los resultados de búsqueda",
      "Estadísticas de visitas y conversión",
      "Soporte prioritario",
    ],
    cta: "Empezar con Premium",
    highlighted: true,
  },
];

export default function ForMusiciansPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink py-24 text-white sm:py-32">
        <Image
          src="https://picsum.photos/seed/sonora-musicians-hero/2000/1200"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-25"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink/75 via-ink/85 to-ink"
        />
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[13px] font-medium text-white/55">{copy.landing.hero.eyebrow}</p>
          <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-[64px]">
            {copy.landing.hero.title}
            <br />
            <span className="text-coral">{copy.landing.hero.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/70">
            {copy.landing.hero.subtitle}
          </p>
          <ButtonLink href="/registro/musico" size="lg" className="mt-9">
            {copy.landing.hero.cta}
          </ButtonLink>
          <p className="mt-4 text-[13px] text-white/45">
            Sin cuota de alta. Sin comisión por solicitud.
          </p>
        </div>
      </section>

      {/* Pasos */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="max-w-lg font-display text-[28px] font-semibold tracking-tight text-ink sm:text-[36px]">
              Del perfil al bolo, en seis pasos
            </h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {copy.landing.steps.map((s, i) => (
              <RevealItem key={s.title}>
                <span className="font-display text-[13px] font-semibold text-coral">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Por qué Sonora */}
      <section className="bg-cream-soft py-20 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="font-display text-[28px] font-semibold leading-tight tracking-tight text-ink sm:text-[36px]">
              Quien te escribe ya está buscando música.
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink-muted">
              <p>
                La diferencia entre Sonora y publicar en redes es la intención: aquí nadie
                llega por casualidad. Quien abre tu perfil está organizando un evento,
                tiene una fecha y maneja un presupuesto.
              </p>
              <p>
                Por eso las solicitudes llegan con la información que necesitas para
                responder en dos minutos: tipo de evento, fecha, lugar y cuánto quiere
                gastarse el cliente. Sin regateos a ciegas.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://picsum.photos/seed/sonora-musician-why/1200/900"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Planes */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal className="text-center">
            <h2 className="font-display text-[28px] font-semibold tracking-tight text-ink sm:text-[36px]">
              Empieza gratis. Sube cuando te compense.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-muted">
              El plan gratuito no tiene límite de tiempo ni de solicitudes.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={
                  p.highlighted
                    ? "rounded-3xl border border-coral/30 bg-ink p-8 text-white"
                    : "rounded-3xl border border-line bg-white p-8"
                }
              >
                <p className="font-display text-xl font-semibold">{p.name}</p>
                <p className="mt-4 font-display text-[36px] font-semibold tracking-tight">
                  {p.price}
                  <span
                    className={
                      p.highlighted
                        ? "ml-1 text-[14px] font-normal text-white/50"
                        : "ml-1 text-[14px] font-normal text-ink-muted"
                    }
                  >
                    {p.period}
                  </span>
                </p>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[14px]">
                      <Check size={15} className="mt-0.5 shrink-0 text-coral" />
                      <span className={p.highlighted ? "text-white/80" : "text-ink-soft"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href="/registro/musico"
                  variant={p.highlighted ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {p.cta}
                </ButtonLink>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-[13px] text-ink-muted">
            Los pagos de Premium todavía no están activos: durante el lanzamiento todas
            las cuentas tienen las funciones del plan gratuito.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line py-20 sm:py-28">
        <Reveal className="mx-auto max-w-xl px-6 text-center">
          <h2 className="font-display text-[30px] font-semibold leading-tight tracking-tight text-ink sm:text-[40px]">
            Tu próximo bolo puede estar aquí.
          </h2>
          <p className="mt-4 text-[16px] text-ink-muted">
            Crear el perfil lleva diez minutos y es gratis.
          </p>
          <ButtonLink href="/registro/musico" size="lg" className="mt-8">
            {copy.landing.hero.cta}
          </ButtonLink>
          <p className="mt-5 text-[13px] text-ink-muted">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-ink underline underline-offset-2">
              Entra en tu dashboard
            </Link>
          </p>
        </Reveal>
      </section>
    </div>
  );
}
