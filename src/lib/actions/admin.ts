"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
}

export async function adminToggleFeatured(musicianId: string) {
  await requireAdmin();
  const profile = await prisma.musicianProfile.findUniqueOrThrow({ where: { id: musicianId } });
  await prisma.musicianProfile.update({
    where: { id: musicianId },
    data: { featured: !profile.featured },
  });
  revalidatePath("/admin/musicos");
  return { ok: true };
}

export async function adminToggleStatus(musicianId: string) {
  await requireAdmin();
  const profile = await prisma.musicianProfile.findUniqueOrThrow({ where: { id: musicianId } });
  await prisma.musicianProfile.update({
    where: { id: musicianId },
    data: { status: profile.status === "published" ? "draft" : "published" },
  });
  revalidatePath("/admin/musicos");
  return { ok: true };
}

export async function adminApproveReview(reviewId: string) {
  await requireAdmin();
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { approved: true },
    select: { musicianId: true },
  });
  const agg = await prisma.review.aggregate({
    where: { musicianId: review.musicianId, approved: true },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.musicianProfile.update({
    where: { id: review.musicianId },
    data: {
      ratingAvg: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      ratingCount: agg._count,
    },
  });
  revalidatePath("/admin/resenas");
  return { ok: true };
}

export async function adminRejectReview(reviewId: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id: reviewId } });
  revalidatePath("/admin/resenas");
  return { ok: true };
}
