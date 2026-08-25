import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AudioPreviewButton } from "@/components/audio-preview";
import { formatPrice } from "@/lib/utils";
import { badges } from "@/lib/copy";
import type { MusicianCardData } from "@/lib/data/musicians";

export function MusicianCard({
  musician,
  availableForDate,
}: {
  musician: MusicianCardData;
  /** Cuando la búsqueda incluye una fecha, indica si el artista la tiene libre. */
  availableForDate?: boolean;
}) {
  const audio = musician.media.find((m) => m.type === "audio");
  const primaryType = musician.artistTypes[0];
  const genreLabels = musician.genres.slice(0, 3).map((g) => g.label).join(" · ");

  return (
    <Link href={`/musico/${musician.slug}`} className="group flex flex-col gap-3.5 rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-4 focus-visible:ring-offset-cream">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-ink-soft">
        {musician.coverUrl && (
          <Image
            src={musician.coverUrl}
            alt={musician.stageName}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-[900ms] ease-[var(--ease-premium)] group-hover:scale-[1.045]"
          />
        )}

        {/* Señales que el cliente mira antes de entrar al perfil */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {musician.featured && <Badge tone="coral">{badges.featured}</Badge>}
          {musician.plan === "premium" && <Badge tone="gold">{badges.premium}</Badge>}
          {availableForDate === true && (
            <Badge tone="dark">{badges.availableForDate}</Badge>
          )}
        </div>

        {audio && (
          <AudioPreviewButton
            src={audio.url}
            className="absolute bottom-3 left-3 translate-y-1.5 opacity-0 transition-all duration-300 ease-[var(--ease-premium)] group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:opacity-100"
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        {/* El nombre se trunca a una línea: en la rejilla de dos columnas del
            móvil, un nombre largo empujaba el precio y dejaba las tarjetas de
            la misma fila desalineadas entre sí. */}
        <div className="flex items-start justify-between gap-2">
          <p className="flex min-w-0 items-center gap-1 text-[15px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            <span className="truncate">{musician.stageName}</span>
            {musician.verified && (
              <BadgeCheck
                size={14}
                aria-label={badges.verified}
                className="shrink-0 fill-ink text-white"
              />
            )}
          </p>
          {musician.ratingCount > 0 && (
            <span className="t-small flex shrink-0 items-center gap-1 pt-0.5">
              <Star size={11} className="fill-gold text-gold" strokeWidth={0} />
              <span className="font-medium text-ink">{musician.ratingAvg.toFixed(1)}</span>
              <span className="text-ink-muted">({musician.ratingCount})</span>
            </span>
          )}
        </div>

        <p className="t-small text-ink-muted">
          {primaryType ? `${primaryType.label} · ` : ""}
          {musician.city}
        </p>

        {/* Nº de actuaciones: ya venía en los datos pero no se mostraba, y es
            de las señales que más pesan al comparar dos artistas parecidos —
            dice experiencia real, no autopercepción. */}
        {musician.gigsCount > 0 && (
          <p className="t-small text-ink-subtle">
            {musician.gigsCount} {musician.gigsCount === 1 ? "actuación" : "actuaciones"}
          </p>
        )}

        {genreLabels && (
          <p className="t-small truncate text-ink-subtle">{genreLabels}</p>
        )}

        <div className="mt-0.5 flex items-center gap-2">
          {musician.priceFrom ? (
            <p className="t-small font-medium text-ink">
              Desde {formatPrice(musician.priceFrom)}
            </p>
          ) : (
            <p className="t-small text-ink-muted">Consultar precio</p>
          )}
          {/* Oculto en móvil: junto al precio provocaba un salto de línea que
              descuadraba la altura de las tarjetas. */}
          {musician.respondsFast && (
            <span className="hidden items-center gap-0.5 text-[12px] text-ink-subtle sm:flex">
              <Zap size={10} className="fill-gold text-gold" strokeWidth={0} />
              {badges.respondsFast}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
