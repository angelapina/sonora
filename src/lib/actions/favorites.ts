"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(musicianId: string, slug: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") {
    return { ok: false, message: "Inicia sesión como cliente para guardar favoritos." };
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_musicianId: { userId: session.user.id, musicianId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: session.user.id, musicianId } });
  }

  revalidatePath(`/musico/${slug}`);
  revalidatePath("/cuenta/favoritos");
  return { ok: true, favorited: !existing };
}
