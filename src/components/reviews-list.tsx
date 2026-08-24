import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

type ReviewItem = {
  id: string;
  authorName: string;
  eventType: string | null;
  rating: number;
  comment: string | null;
  createdAt: Date;
};

export function ReviewsList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">
        Este músico todavía no tiene reseñas públicas. ¡Sé el primero en contratarlo y
        contarlo!
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-line bg-paper p-5">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={14}
                className={i < r.rating ? "fill-gold text-gold" : "text-line"}
              />
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">“{r.comment}”</p>
          <p className="mt-3 text-xs font-semibold text-ink">
            {r.authorName}
            {r.eventType && <span className="font-normal text-ink-muted"> · {r.eventType}</span>}
          </p>
          <p className="text-xs text-ink-muted">{formatDate(r.createdAt)}</p>
        </div>
      ))}
    </div>
  );
}
