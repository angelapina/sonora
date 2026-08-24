import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Planes y precios para músicos | Sonora" };

const PLANS = [
  {
    name: "Gratuito",
    price: "0€",
    period: "siempre",
    description: "Todo lo esencial para empezar a recibir solicitudes.",
    features: [
      "Perfil público completo",
      "Fotos, vídeos y audio ilimitados",
      "Calendario de disponibilidad",
      "Mensajería con clientes",
      "Aparece en el buscador de Sonora",
    ],
    cta: "Crear mi perfil gratis",
    href: "/registro/musico",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "19€",
    period: "/ mes",
    description: "Para músicos que quieren maximizar sus reservas.",
    features: [
      "Todo lo del plan Gratuito",
      "Insignia Premium en tu perfil",
      "Prioridad en resultados de búsqueda",
      "Estadísticas de visitas y solicitudes",
      "Soporte prioritario",
    ],
    cta: "Empezar prueba Premium",
    href: "/registro/musico",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
          Para músicos y artistas
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Un plan para cada momento de tu carrera
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-muted">
          Empieza gratis. Cuando quieras destacar sobre el resto, pásate a Premium o pide
          aparecer entre los músicos recomendados de tu ciudad.
        </p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-8 ${
              plan.highlighted
                ? "border-coral bg-ink text-cream shadow-[0_32px_64px_-32px_rgba(255,90,60,0.4)]"
                : "border-line bg-paper text-ink"
            }`}
          >
            <p className="font-display text-2xl">{plan.name}</p>
            <p className="mt-2 text-sm opacity-70">{plan.description}</p>
            <p className="mt-6 font-display text-4xl">
              {plan.price}
              <span className="text-base font-sans opacity-60"> {plan.period}</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check size={16} className={plan.highlighted ? "text-coral" : "text-coral"} />
                  {f}
                </li>
              ))}
            </ul>
            <ButtonLink
              href={plan.href}
              variant={plan.highlighted ? "primary" : "secondary"}
              className="mt-8 w-full"
            >
              {plan.cta}
            </ButtonLink>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-line bg-cream-soft p-8 text-center">
        <p className="font-display text-xl text-ink">
          ¿Quieres aparecer el primero en tu ciudad?
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Próximamente: posiciones destacadas por ciudad y tipo de evento, y comisión solo
          cuando consigas una contratación a través de Sonora.
        </p>
      </div>
    </div>
  );
}
