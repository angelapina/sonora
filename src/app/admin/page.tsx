import { prisma } from "@/lib/prisma";
import { Music4, Users, Star, Inbox } from "lucide-react";

export default async function AdminOverviewPage() {
  const [totalUsers, totalMusicians, publishedMusicians, pendingReviews, pendingBookings] =
    await Promise.all([
      prisma.user.count(),
      prisma.musicianProfile.count(),
      prisma.musicianProfile.count({ where: { status: "published" } }),
      prisma.review.count({ where: { approved: false } }),
      prisma.bookingRequest.count({ where: { status: "pending" } }),
    ]);

  const cards = [
    { icon: Users, label: "Usuarios totales", value: totalUsers },
    { icon: Music4, label: "Músicos (publicados / total)", value: `${publishedMusicians} / ${totalMusicians}` },
    { icon: Star, label: "Reseñas pendientes", value: pendingReviews },
    { icon: Inbox, label: "Solicitudes pendientes", value: pendingBookings },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-line bg-paper p-6">
          <c.icon className="text-coral" size={20} />
          <p className="mt-3 font-display text-3xl text-ink">{c.value}</p>
          <p className="text-sm text-ink-muted">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
