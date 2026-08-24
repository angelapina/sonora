import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { BookingStatusBadge } from "@/components/booking-status-badge";
import { MessageThread } from "@/components/message-thread";

export default async function ClientBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const booking = await prisma.bookingRequest.findFirst({
    where: { id, clientUserId: session!.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } }, musician: true },
  });
  if (!booking) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Conversación</h2>
          <BookingStatusBadge status={booking.status} />
        </div>
        <div className="mt-6">
          <MessageThread
            bookingId={booking.id}
            initialMessages={booking.messages}
            viewerRole="client"
          />
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Músico</p>
          <Link href={`/musico/${booking.musician.slug}`} className="font-semibold text-ink hover:text-coral">
            {booking.musician.stageName}
          </Link>
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
            <p className="text-ink-muted">Enviada el {formatDate(booking.createdAt)}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
