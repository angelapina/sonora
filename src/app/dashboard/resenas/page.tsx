import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Star, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardReviewsPage() {
  const session = await auth();
  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!profile) return null;

  const reviews = await prisma.review.findMany({
    where: { musicianId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Reseñas</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Valoración media:{" "}
        <span className="font-semibold text-ink">
          {profile.ratingAvg.toFixed(1)} ({profile.ratingCount})
        </span>
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {reviews.length === 0 && (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-muted sm:col-span-2">
            Todavía no tienes reseñas.
          </p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < r.rating ? "fill-gold text-gold" : "text-line"}
                  />
                ))}
              </div>
              {!r.approved && (
                <span className="flex items-center gap-1 text-xs font-medium text-ink-muted">
                  <Clock size={12} /> Pendiente de moderación
                </span>
              )}
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
    </div>
  );
}
