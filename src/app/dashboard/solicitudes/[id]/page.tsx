import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { BookingStatusBadge } from "@/components/booking-status-badge";
import { BookingActions } from "@/components/booking-actions";
import { MessageThread } from "@/components/message-thread";
import { ArtistPayoutBreakdown } from "@/components/price-breakdown";
import { PAYMENT_STATUSES, type PaymentStatus } from "@/lib/pricing";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!profile) return null;

  const booking = await prisma.bookingRequest.findFirst({
    where: { id, musicianId: profile.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!booking) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Conversación</h2>
          <BookingStatusBadge status={booking.status} />
        </div>
        <div className="mt-6">
          <MessageThread
            bookingId={booking.id}
            initialMessages={booking.messages}
            viewerRole="musician"
          />
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="font-semibold text-ink">{booking.guestName}</p>
          <p className="text-sm text-ink-muted">{booking.guestEmail}</p>
          {booking.guestPhone && <p className="text-sm text-ink-muted">{booking.guestPhone}</p>}

          <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <p>
              <span className="text-ink-muted">Evento: </span>
              {booking.eventType}
            </p>
            {booking.eventDate && (
              <p>
                <span className="text-ink-muted">Fecha: </span>
                {formatDate(booking.eventDate)}
              </p>
            )}
            {booking.city && (
              <p>
                <span className="text-ink-muted">Ciudad: </span>
                {booking.city}
              </p>
            )}
            {(booking.budgetMin || booking.budgetMax) && (
              <p>
                <span className="text-ink-muted">Presupuesto: </span>
                {booking.budgetMin ? formatPrice(booking.budgetMin) : "—"} –{" "}
                {booking.budgetMax ? formatPrice(booking.budgetMax) : "—"}
              </p>
            )}
            <p className="text-ink-muted">Recibida el {formatDate(booking.createdAt)}</p>
          </div>
        </div>

        {booking.agreedPrice ? (
          <div>
            <p className="mb-2 text-[13px] font-medium text-ink">Tu liquidación</p>
            <ArtistPayoutBreakdown basePrice={booking.agreedPrice} />
            <p className="mt-2 text-[12px] text-ink-muted">
              {PAYMENT_STATUSES[booking.paymentStatus as PaymentStatus] ??
                booking.paymentStatus}
            </p>
          </div>
        ) : null}

        <BookingActions
          bookingId={booking.id}
          status={booking.status}
          suggestedPrice={booking.agreedPrice ?? booking.budgetMax ?? booking.budgetMin}
        />
      </aside>
    </div>
  );
}
