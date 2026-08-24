import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { BookingStatusBadge } from "@/components/booking-status-badge";

export default async function DashboardBookingsPage() {
  const session = await auth();
  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!profile) return null;

  const bookings = await prisma.bookingRequest.findMany({
    where: { musicianId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Solicitudes de presupuesto</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Responde a tus clientes potenciales lo antes posible.
      </p>

      <div className="mt-6 space-y-3">
        {bookings.length === 0 && (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">
            Todavía no has recibido ninguna solicitud.
          </p>
        )}
        {bookings.map((b) => (
          <Link
            key={b.id}
            href={`/dashboard/solicitudes/${b.id}`}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-coral/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-ink">{b.guestName}</p>
              <p className="text-sm text-ink-muted">
                {b.eventType}
                {b.eventDate && ` · ${formatDate(b.eventDate)}`}
                {b.city && ` · ${b.city}`}
              </p>
              {(b.budgetMin || b.budgetMax) && (
                <p className="text-xs text-ink-muted">
                  Presupuesto: {b.budgetMin ? formatPrice(b.budgetMin) : "—"} –{" "}
                  {b.budgetMax ? formatPrice(b.budgetMax) : "—"}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-muted">{formatDate(b.createdAt)}</span>
              <BookingStatusBadge status={b.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
