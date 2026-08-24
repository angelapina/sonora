import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils";
import type { MusicianCardData } from "@/lib/data/musicians";

export function MusicianCard({ musician }: { musician: MusicianCardData }) {
  const video = musician.media[0];
  const primaryType = musician.artistTypes[0];

  return (
    <Link href={`/musico/${musician.slug}`} className="group flex flex-col gap-3.5">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-soft">
        {musician.coverUrl && (
          <Image
            src={musician.coverUrl}
            alt={musician.stageName}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
          />
        )}

        {(musician.featured || musician.plan === "premium") && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {musician.featured && <Badge tone="coral">Recomendado</Badge>}
            {musician.plan === "premium" && <Badge tone="gold">Premium</Badge>}
          </div>
        )}

        {video && (
          <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-1.5 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.18)] backdrop-blur transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <Play size={13} className="ml-0.5 fill-ink" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-[15px] font-semibold leading-tight text-ink">
            {musician.stageName}
          </p>
          {musician.ratingCount > 0 && (
            <Rating value={musician.ratingAvg} size={11} className="shrink-0 pt-0.5" />
          )}
        </div>
        <p className="text-[13px] text-ink-muted">
          {musician.city}
          {primaryType ? ` · ${primaryType.label}` : ""}
        </p>
        {musician.priceFrom ? (
          <p className="text-[13px] font-medium text-ink">
            Desde {formatPrice(musician.priceFrom)}
          </p>
        ) : (
          <p className="text-[13px] text-ink-muted">Consultar precio</p>
        )}
      </div>
    </Link>
  );
}
