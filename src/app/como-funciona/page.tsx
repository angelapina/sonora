import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Search, MessagesSquare, ShieldCheck, Music4 } from "lucide-react";

export const metadata: Metadata = { title: "Cómo funciona | Sonora" };

const STEPS = [
  {
    icon: Search,
    title: "Busca y compara",
    text: "Filtra por ciudad, tipo de artista, género musical, tipo de evento y presupuesto. Compara perfiles con fotos, vídeos y precios reales.",
  },
  {
    icon: MessagesSquare,
    title: "Escucha y contacta",
    text: "Mira actuaciones en vídeo, escucha muestras de audio y consulta disponibilidad antes de decidir. Contacta directamente desde el perfil.",
  },
  {
    icon: ShieldCheck,
    title: "Contrata con confianza",
    text: "Solicita presupuesto, habla con el artista por mensajería y reserva tu fecha. Después, deja tu reseña para ayudar a otros a decidir.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div>
      <section className="bg-ink py-20 text-cream">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
            Cómo funciona Sonora
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            Encontrar y contratar música nunca fue tan fácil
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-3xl border border-line bg-paper p-8">
              <span className="font-display text-4xl text-coral">0{i + 1}</span>
              <s.icon className="mt-4 text-ink-muted" size={22} />
              <h2 className="mt-4 font-display text-xl text-ink">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-10 rounded-3xl border border-line bg-cream-soft p-10 sm:grid-cols-2">
          <div>
            <Music4 className="text-coral" size={22} />
            <h2 className="mt-3 font-display text-2xl text-ink">¿Eres músico o artista?</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Crea tu perfil gratis, sube tu contenido y empieza a recibir solicitudes de
              presupuesto directamente de clientes que buscan justo lo que ofreces.
            </p>
            <ButtonLink href="/registro/musico" className="mt-5">
              Crear mi perfil gratis
            </ButtonLink>
          </div>
          <div>
            <Search className="text-coral" size={22} />
            <h2 className="mt-3 font-display text-2xl text-ink">¿Buscas música para tu evento?</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Explora cientos de perfiles verificados y encuentra al artista perfecto para tu
              boda, fiesta o evento de empresa.
            </p>
            <ButtonLink href="/buscar" variant="secondary" className="mt-5">
              Buscar músicos
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
