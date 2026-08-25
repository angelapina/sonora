import Image from "next/image";
import Link from "next/link";

/**
 * "¿Qué estás organizando?" — punto de entrada por ocasión, no por instrumento.
 * Mucha gente no sabe si quiere un dúo o un cuarteto, pero sabe perfectamente
 * que está montando una boda.
 */
const OCCASIONS = [
  { slug: "boda", label: "Una boda", copy: "Del «sí quiero» al último baile", seed: "sonora-oc-boda" },
  { slug: "corporativo", label: "Un evento de empresa", copy: "Cena, gala o after-work", seed: "sonora-oc-corp" },
  { slug: "fiesta-privada", label: "Una fiesta privada", copy: "Que nadie mire el reloj", seed: "sonora-oc-fiesta" },
  { slug: "restaurante", label: "Algo en un restaurante", copy: "La sobremesa que no acaba", seed: "sonora-oc-resto" },
  { slug: "hotel", label: "Algo en un hotel", copy: "Lounge, terraza y eventos", seed: "sonora-oc-hotel" },
  { slug: "festival", label: "Un festival", copy: "Escenario, luces y gente", seed: "sonora-oc-festival" },
];

export function OccasionGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {OCCASIONS.map((o) => (
        <Link
          key={o.slug}
          href={`/buscar?eventType=${o.slug}`}
          className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-ink-soft sm:aspect-[3/2]"
        >
          <Image
            src={`https://picsum.photos/seed/${o.seed}/900/600`}
            alt={o.label}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-[var(--ease-premium)] group-hover:scale-[1.06]"
          />

          {/* Velo neutro: solo el necesario para que el texto sea legible. El
              color de la tarjeta lo pone la fotografía, no un filtro encima. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-500 group-hover:opacity-85" />

          <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
            <p className="t-h3 text-white">
              {o.label}
            </p>
            <p className="t-small mt-1 text-white/80">
              {o.copy}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
