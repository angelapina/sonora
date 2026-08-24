import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Inbox, Star, Images, TrendingUp } from "lucide-react";
import { PublishToggle } from "@/components/publish-toggle";
import { BookingStatusBadge } from "@/components/booking-status-badge";
import { formatDate } from "@/lib/utils";

export default async function DashboardOverviewPage() {
  const session = await auth();
  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      _count: { select: { media: true, bookingRequests: true, reviews: true } },
      bookingRequests: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
  if (!profile) return null;

  const pendingCount = await prisma.bookingRequest.count({
    where: { musicianId: profile.id, status: "pending" },
  });

  const checklist = [
    { done: !!profile.bio, label: "Añade una biografía", href: "/dashboard/perfil" },
    { done: !!profile.priceFrom, label: "Define tu precio orientativo", href: "/dashboard/perfil" },
    { done: profile._count.media > 0, label: "Sube fotos, vídeos o audio", href: "/dashboard/media" },
    { done: !!profile.phone || !!profile.contactEmail, label: "Añade datos de contacto", href: "/dashboard/perfil" },
  ];

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-line bg-paper p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-ink">
              {profile.status === "published"
                ? "Tu perfil es visible en el buscador de Sonora."
                : "Tu perfil está en borrador y no aparece en el buscador."}
            </p>
            <p className="text-sm text-ink-muted">
              Publícalo cuando lo tengas listo para empezar a recibir solicitudes.
            </p>
          </div>
          <PublishToggle status={profile.status} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper p-6">
          <Inbox className="text-coral" size={20} />
          <p className="mt-3 font-display text-3xl text-ink">{pendingCount}</p>
          <p className="text-sm text-ink-muted">Solicitudes pendientes</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-6">
          <Star className="text-coral" size={20} />
          <p className="mt-3 font-display text-3xl text-ink">
            {profile.ratingAvg.toFixed(1)}{" "}
            <span className="text-base text-ink-muted">({profile._count.reviews})</span>
          </p>
          <p className="text-sm text-ink-muted">Valoración media</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-6">
          <Images className="text-coral" size={20} />
          <p className="mt-3 font-display text-3xl text-ink">{profile._count.media}</p>
          <p className="text-sm text-ink-muted">Elementos multimedia</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-ink">Completa tu perfil</h2>
          <ul className="mt-4 space-y-2">
            {checklist.map((c) => (
              <li key={c.label}>
                <Link
                  href={c.href}
                  className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm hover:border-coral/40"
                >
                  <span className={c.done ? "text-ink-muted line-through" : "text-ink"}>
                    {c.label}
                  </span>
                  <TrendingUp size={14} className={c.done ? "text-coral" : "text-ink-muted"} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Últimas solicitudes</h2>
            <Link href="/dashboard/solicitudes" className="text-sm font-semibold text-coral">
              Ver todas →
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {profile.bookingRequests.length === 0 && (
              <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-muted">
                Todavía no has recibido solicitudes.
              </p>
            )}
            {profile.bookingRequests.map((b) => (
              <Link
                key={b.id}
                href={`/dashboard/solicitudes/${b.id}`}
                className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm hover:border-coral/40"
              >
                <div>
                  <p className="font-semibold text-ink">{b.guestName}</p>
                  <p className="text-xs text-ink-muted">
                    {b.eventType} · {formatDate(b.createdAt)}
                  </p>
                </div>
                <BookingStatusBadge status={b.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
