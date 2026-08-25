import { Star, BadgeCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { badges } from "@/lib/copy";

type ReviewItem = {
  id: string;
  authorName: string;
  eventType: string | null;
  rating: number;
  comment: string | null;
  createdAt: Date;
  verifiedBooking?: boolean;
  ratingMusic?: number | null;
  ratingProfessionalism?: number | null;
  ratingPunctuality?: number | null;
  ratingCommunication?: number | null;
  ratingValue?: number | null;
};

const CRITERIA = [
  { key: "ratingMusic", label: "Calidad musical" },
  { key: "ratingProfessionalism", label: "Profesionalidad" },
  { key: "ratingPunctuality", label: "Puntualidad" },
  { key: "ratingCommunication", label: "Comunicación" },
  { key: "ratingValue", label: "Calidad/precio" },
] as const;

function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          className={i < value ? "fill-gold text-gold" : "fill-line text-line"}
        />
      ))}
    </span>
  );
}

/** Desglose por criterio: convierte "4,8 estrellas" en información accionable. */
export function ReviewsSummary({ reviews }: { reviews: ReviewItem[] }) {
  const withDetail = reviews.filter((r) => r.ratingMusic != null);
  if (withDetail.length === 0) return null;

  const averages = CRITERIA.map((c) => {
    const values = withDetail
      .map((r) => r[c.key])
      .filter((v): v is number => typeof v === "number");
    const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
    return { label: c.label, value: avg };
  });

  return (
    <div className="grid gap-x-8 gap-y-3 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2">
      {averages.map((a) => (
        <div key={a.label} className="flex items-center gap-3">
          <span className="w-32 shrink-0 text-[13px] text-ink-soft">{a.label}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span
              className="block h-full rounded-full bg-ink"
              style={{ width: `${(a.value / 5) * 100}%` }}
            />
          </span>
          <span className="w-7 shrink-0 text-right text-[13px] font-medium text-ink">
            {a.value.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ReviewsList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line p-8 text-center text-[15px] text-ink-muted">
        Este artista todavía no tiene reseñas públicas. Si lo contratas a través de
        Sonora, tu opinión será la primera.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <Stars value={r.rating} />
            {r.verifiedBooking && (
              <span className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-coral">
                <BadgeCheck size={13} /> {badges.verifiedBooking}
              </span>
            )}
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">“{r.comment}”</p>
          <p className="mt-4 text-[13px] font-medium text-ink">
            {r.authorName}
            {r.eventType && <span className="font-normal text-ink-muted"> · {r.eventType}</span>}
          </p>
          <p className="text-[13px] text-ink-muted">{formatDate(r.createdAt)}</p>
        </div>
      ))}
    </div>
  );
}
