import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const musicianCardSelect = {
  id: true,
  slug: true,
  stageName: true,
  tagline: true,
  city: true,
  avatarUrl: true,
  coverUrl: true,
  priceFrom: true,
  ratingAvg: true,
  ratingCount: true,
  featured: true,
  plan: true,
  artistTypes: { select: { slug: true, label: true, icon: true } },
  genres: { select: { slug: true, label: true } },
  media: {
    where: { type: "video" },
    take: 1,
    select: { url: true, provider: true },
  },
} satisfies Prisma.MusicianProfileSelect;

export type MusicianCardData = Prisma.MusicianProfileGetPayload<{
  select: typeof musicianCardSelect;
}>;

export async function getFeaturedMusicians(limit = 6) {
  return prisma.musicianProfile.findMany({
    where: { status: "published", featured: true },
    orderBy: { ratingAvg: "desc" },
    take: limit,
    select: musicianCardSelect,
  });
}

export async function getMostBookedMusicians(limit = 8) {
  return prisma.musicianProfile.findMany({
    where: { status: "published" },
    orderBy: [{ ratingCount: "desc" }, { ratingAvg: "desc" }],
    take: limit,
    select: musicianCardSelect,
  });
}

export async function getNewMusicians(limit = 8) {
  return prisma.musicianProfile.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: musicianCardSelect,
  });
}

export async function getMusiciansByEventType(slug: string, limit = 8) {
  return prisma.musicianProfile.findMany({
    where: { status: "published", eventTypes: { some: { slug } } },
    orderBy: [{ featured: "desc" }, { ratingAvg: "desc" }],
    take: limit,
    select: musicianCardSelect,
  });
}

export async function getNearbyMusicians(city: string | undefined, limit = 8) {
  return prisma.musicianProfile.findMany({
    where: {
      status: "published",
      ...(city ? { city: { equals: city} } : {}),
    },
    orderBy: [{ featured: "desc" }, { ratingAvg: "desc" }],
    take: limit,
    select: musicianCardSelect,
  });
}

export type MusicianSearchFilters = {
  q?: string;
  city?: string;
  eventType?: string;
  artistTypes?: string[];
  genres?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: "relevance" | "price_asc" | "price_desc" | "rating";
  page?: number;
  perPage?: number;
};

export async function searchMusicians(filters: MusicianSearchFilters) {
  const {
    q,
    city,
    eventType,
    artistTypes,
    genres,
    priceMin,
    priceMax,
    sort = "relevance",
    page = 1,
    perPage = 12,
  } = filters;

  const where: Prisma.MusicianProfileWhereInput = {
    status: "published",
    ...(city ? { city: { equals: city} } : {}),
    ...(eventType ? { eventTypes: { some: { slug: eventType } } } : {}),
    ...(artistTypes && artistTypes.length
      ? { artistTypes: { some: { slug: { in: artistTypes } } } }
      : {}),
    ...(genres && genres.length ? { genres: { some: { slug: { in: genres } } } } : {}),
    ...(priceMin !== undefined ? { priceFrom: { gte: priceMin } } : {}),
    ...(priceMax !== undefined ? { priceFrom: { lte: priceMax } } : {}),
    ...(q
      ? {
          OR: [
            { stageName: { contains: q} },
            { tagline: { contains: q} },
            { bio: { contains: q} },
            { genres: { some: { label: { contains: q} } } },
            { artistTypes: { some: { label: { contains: q} } } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.MusicianProfileOrderByWithRelationInput[] =
    sort === "price_asc"
      ? [{ priceFrom: "asc" }]
      : sort === "price_desc"
        ? [{ priceFrom: "desc" }]
        : sort === "rating"
          ? [{ ratingAvg: "desc" }]
          : [{ featured: "desc" }, { ratingAvg: "desc" }];

  const [items, total] = await Promise.all([
    prisma.musicianProfile.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      select: musicianCardSelect,
    }),
    prisma.musicianProfile.count({ where }),
  ]);

  return { items, total, page, perPage, pageCount: Math.max(1, Math.ceil(total / perPage)) };
}

export async function getMusicianBySlug(slug: string) {
  return prisma.musicianProfile.findUnique({
    where: { slug },
    include: {
      artistTypes: true,
      genres: true,
      eventTypes: true,
      instruments: true,
      media: { orderBy: { order: "asc" } },
      availability: {
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
      },
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getMusicianByUserId(userId: string) {
  return prisma.musicianProfile.findUnique({ where: { userId } });
}
