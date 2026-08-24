"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { bookingRequestSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createBookingRequest(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const parsed = bookingRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const session = await auth();

  const musician = await prisma.musicianProfile.findUnique({
    where: { id: data.musicianId },
    select: { id: true, slug: true },
  });
  if (!musician) {
    return { ok: false, message: "No hemos encontrado a este músico." };
  }

  const booking = await prisma.bookingRequest.create({
    data: {
      musicianId: musician.id,
      clientUserId: session?.user?.role === "CLIENT" ? session.user.id : null,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      eventType: data.eventType,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      city: data.city,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      message: data.message,
    },
  });

  await prisma.message.create({
    data: {
      bookingRequestId: booking.id,
      senderId: session?.user?.id,
      senderRole: "client",
      body: data.message,
    },
  });

  revalidatePath(`/musico/${musician.slug}`);
  return { ok: true, message: "¡Solicitud enviada! El artista te responderá pronto." };
}
