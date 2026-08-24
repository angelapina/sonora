"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { profileUpdateSchema } from "@/lib/validations";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

async function requireMusician() {
  const session = await auth();
  if (!session?.user || session.user.role !== "MUSICIAN") {
    throw new Error("No autorizado");
  }
  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("Perfil no encontrado");
  return profile;
}

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await requireMusician();

  const raw = {
    stageName: formData.get("stageName"),
    tagline: formData.get("tagline"),
    bio: formData.get("bio"),
    city: formData.get("city"),
    zone: formData.get("zone"),
    priceFrom: formData.get("priceFrom") || undefined,
    priceNote: formData.get("priceNote"),
    yearsExperience: formData.get("yearsExperience") || undefined,
    website: formData.get("website"),
    instagram: formData.get("instagram"),
    youtube: formData.get("youtube"),
    tiktok: formData.get("tiktok"),
    spotify: formData.get("spotify"),
    phone: formData.get("phone"),
    contactEmail: formData.get("contactEmail"),
    artistTypes: formData.getAll("artistTypes"),
    genres: formData.getAll("genres"),
    eventTypes: formData.getAll("eventTypes"),
    instruments: formData.getAll("instruments"),
  };

  const parsed = profileUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  await prisma.musicianProfile.update({
    where: { id: profile.id },
    data: {
      stageName: data.stageName,
      tagline: data.tagline || null,
      bio: data.bio || null,
      city: data.city,
      zone: data.zone || null,
      priceFrom: data.priceFrom ?? null,
      priceNote: data.priceNote || null,
      yearsExperience: data.yearsExperience ?? null,
      website: data.website || null,
      instagram: data.instagram || null,
      youtube: data.youtube || null,
      tiktok: data.tiktok || null,
      spotify: data.spotify || null,
      phone: data.phone || null,
      contactEmail: data.contactEmail || null,
      artistTypes: { set: data.artistTypes.map((slug) => ({ slug })) },
      genres: { set: data.genres.map((slug) => ({ slug })) },
      eventTypes: { set: data.eventTypes.map((slug) => ({ slug })) },
      instruments: { set: (data.instruments ?? []).map((slug) => ({ slug })) },
    },
  });

  revalidatePath("/dashboard/perfil");
  revalidatePath(`/musico/${profile.slug}`);
  return { ok: true, message: "Perfil actualizado correctamente." };
}

export async function togglePublish() {
  const profile = await requireMusician();
  const nextStatus = profile.status === "published" ? "draft" : "published";
  await prisma.musicianProfile.update({
    where: { id: profile.id },
    data: { status: nextStatus },
  });
  revalidatePath("/dashboard");
  revalidatePath(`/musico/${profile.slug}`);
  return { ok: true, status: nextStatus };
}

export async function addMedia(input: {
  type: "photo" | "video" | "audio";
  url: string;
  provider?: string;
  title?: string;
}) {
  const profile = await requireMusician();
  const count = await prisma.media.count({ where: { musicianId: profile.id } });
  await prisma.media.create({
    data: {
      musicianId: profile.id,
      type: input.type,
      url: input.url,
      provider: input.provider,
      title: input.title,
      order: count,
    },
  });
  revalidatePath("/dashboard/media");
  revalidatePath(`/musico/${profile.slug}`);
  return { ok: true };
}

export async function deleteMedia(mediaId: string) {
  const profile = await requireMusician();
  await prisma.media.deleteMany({ where: { id: mediaId, musicianId: profile.id } });
  revalidatePath("/dashboard/media");
  revalidatePath(`/musico/${profile.slug}`);
  return { ok: true };
}

export async function toggleAvailability(dateISO: string) {
  const profile = await requireMusician();
  const date = new Date(dateISO);
  const existing = await prisma.availabilityBlock.findUnique({
    where: { musicianId_date: { musicianId: profile.id, date } },
  });
  if (existing) {
    await prisma.availabilityBlock.delete({ where: { id: existing.id } });
  } else {
    await prisma.availabilityBlock.create({
      data: { musicianId: profile.id, date, available: false },
    });
  }
  revalidatePath("/dashboard/disponibilidad");
  revalidatePath(`/musico/${profile.slug}`);
  return { ok: true, blocked: !existing };
}

export async function updateBookingStatus(bookingId: string, status: "accepted" | "declined" | "completed") {
  const profile = await requireMusician();
  await prisma.bookingRequest.updateMany({
    where: { id: bookingId, musicianId: profile.id },
    data: { status },
  });
  revalidatePath("/dashboard/solicitudes");
  revalidatePath(`/dashboard/solicitudes/${bookingId}`);
  return { ok: true };
}

export async function sendMessage(bookingId: string, body: string) {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");

  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    include: { musician: true },
  });
  if (!booking) throw new Error("Solicitud no encontrada");

  const isMusicianOwner = booking.musician.userId === session.user.id;
  const isClientOwner = booking.clientUserId === session.user.id;
  if (!isMusicianOwner && !isClientOwner) throw new Error("No autorizado");

  await prisma.message.create({
    data: {
      bookingRequestId: bookingId,
      senderId: session.user.id,
      senderRole: isMusicianOwner ? "musician" : "client",
      body,
    },
  });

  revalidatePath(`/dashboard/solicitudes/${bookingId}`);
  revalidatePath(`/cuenta/solicitudes/${bookingId}`);
  return { ok: true };
}
