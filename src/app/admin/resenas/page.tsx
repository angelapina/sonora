import { prisma } from "@/lib/prisma";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AdminReviewActions } from "@/components/admin-review-actions";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { approved: false },
    orderBy: { createdAt: "desc" },
    include: { musician: { select: { stageName: true, slug: true } } },
  });

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Reseñas pendientes ({reviews.length})</h2>
      <div className="mt-6 space-y-4">
        {reviews.length === 0 && (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">
            No hay reseñas pendientes de moderación.
          </p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">{r.musician.stageName}</p>
                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < r.rating ? "fill-gold text-gold" : "text-line"}
                    />
                  ))}
                </div>
              </div>
              <AdminReviewActions reviewId={r.id} />
            </div>
            <p className="mt-3 text-sm text-ink-soft">“{r.comment}”</p>
            <p className="mt-2 text-xs text-ink-muted">
              {r.authorName} · {r.eventType} · {formatDate(r.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
