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
  verified: true,
  respondsFast: true,
  gigsCount: true,
  membersCount: true,
  artistTypes: { select: { slug: true, label: true, icon: true } },
  genres: { select: { slug: true, label: true } },
  media: {
    where: { OR: [{ type: "video" }, { type: "audio" }] },
    orderBy: { order: "asc" },
    select: { type: true, url: true, provider: true, title: true },
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
  /** ISO yyyy-mm-dd. Excluye artistas con la fecha bloqueada. */
  date?: string;
  /** Valoración mínima (p.ej. 4.5). */
  minRating?: number;
  /** Solo artistas verificados por Sonora. */
  verifiedOnly?: boolean;
  /** Solo artistas que traen su propio equipo de sonido. */
  equipmentOnly?: boolean;
  sort?: "relevance" | "price_asc" | "price_desc" | "rating" | "experience";
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
    date,
    minRating,
    verifiedOnly,
    equipmentOnly,
    sort = "relevance",
    page = 1,
    perPage = 12,
  } = filters;

  // Fecha: descartamos a quien la tenga marcada como no disponible.
  const dateFilter = (() => {
    if (!date) return {};
    const day = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(day.getTime())) return {};
    return {
      availability: { none: { date: day, available: false } },
    } satisfies Prisma.MusicianProfileWhereInput;
  })();

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
    ...(minRating !== undefined ? { ratingAvg: { gte: minRating } } : {}),
    ...(verifiedOnly ? { verified: true } : {}),
    ...(equipmentOnly ? { equipmentIncluded: true } : {}),
    ...dateFilter,
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
          : sort === "experience"
            ? [{ gigsCount: "desc" }]
            : // Relevancia: destacados primero, luego verificados y mejor valorados.
              [{ featured: "desc" }, { verified: "desc" }, { ratingAvg: "desc" }];

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
        orderBy: [{ verifiedBooking: "desc" }, { createdAt: "desc" }],
      },
      packages: { orderBy: { order: "asc" } },
    },
  });
}

export async function getMusicianByUserId(userId: string) {
  return prisma.musicianProfile.findUnique({ where: { userId } });
}

/**
 * Reseñas destacadas para la home: solo aprobadas, con comentario y de
 * contrataciones verificadas a través de Sonora (prueba social real, no relleno).
 */
export async function getShowcaseReviews(limit = 3) {
  return prisma.review.findMany({
    where: {
      approved: true,
      verifiedBooking: true,
      comment: { not: null },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: {
      id: true,
      authorName: true,
      comment: true,
      rating: true,
      eventType: true,
      musician: { select: { stageName: true, slug: true, city: true, avatarUrl: true } },
    },
  });
}
