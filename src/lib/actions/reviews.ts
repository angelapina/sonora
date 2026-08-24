"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { reviewSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitReview(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const session = await auth();

  const musician = await prisma.musicianProfile.findUnique({
    where: { id: data.musicianId },
    select: { slug: true },
  });
  if (!musician) return { ok: false, message: "Músico no encontrado." };

  await prisma.review.create({
    data: {
      musicianId: data.musicianId,
      bookingRequestId: data.bookingRequestId || null,
      authorUserId: session?.user?.id,
      authorName: data.authorName,
      eventType: data.eventType,
      rating: data.rating,
      comment: data.comment,
      approved: false,
    },
  });

  revalidatePath(`/musico/${musician.slug}`);
  return {
    ok: true,
    message: "¡Gracias! Tu reseña se publicará en cuanto sea revisada por el equipo de Sonora.",
  };
}
