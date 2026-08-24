import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { BookingStatusBadge } from "@/components/booking-status-badge";

export default async function ClientBookingsPage() {
  const session = await auth();
  const bookings = await prisma.bookingRequest.findMany({
    where: { clientUserId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { musician: { select: { stageName: true, slug: true, avatarUrl: true } } },
  });

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Mis solicitudes</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Sigue el estado de tus solicitudes de presupuesto.
      </p>

      <div className="mt-6 space-y-3">
        {bookings.length === 0 && (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">
            Todavía no has enviado ninguna solicitud.{" "}
            <Link href="/buscar" className="font-semibold text-coral">
              Busca un músico
            </Link>
            .
          </p>
        )}
        {bookings.map((b) => (
          <Link
            key={b.id}
            href={`/cuenta/solicitudes/${b.id}`}
            className="flex items-center justify-between rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-coral/40"
          >
            <div>
              <p className="font-semibold text-ink">{b.musician.stageName}</p>
              <p className="text-sm text-ink-muted">
                {b.eventType} · {formatDate(b.createdAt)}
              </p>
            </div>
            <BookingStatusBadge status={b.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
