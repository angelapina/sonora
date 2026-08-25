import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import {
  CITY_LANDINGS,
  CATEGORY_LANDINGS,
  EVENT_LANDINGS,
  COMBO_LANDINGS,
} from "@/lib/seo-landings";

/**
 * Sitemap dinámico. Además de las páginas fijas incluye:
 *  - un perfil por artista publicado (con su fecha real de actualización, que
 *    es lo que le dice a Google qué merece recrawl)
 *  - las landings de ciudad, categoría, ocasión y las combinaciones
 *    ciudad × categoría, que son las que capturan la long tail
 *
 * Las prioridades no son mágicas, pero sí comunican jerarquía interna: la home
 * y las ocasiones por encima de un perfil individual.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const musicians = await prisma.musicianProfile.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
  });

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/buscar`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/match`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/como-funciona`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/para-musicos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/precios`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const eventPages: MetadataRoute.Sitemap = EVENT_LANDINGS.map((l) => ({
    url: `${SITE_URL}/musica-para/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const landingPages: MetadataRoute.Sitemap = [
    ...CITY_LANDINGS,
    ...CATEGORY_LANDINGS,
  ].map((l) => ({
    url: `${SITE_URL}/musicos/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const comboPages: MetadataRoute.Sitemap = COMBO_LANDINGS.map((c) => ({
    url: `${SITE_URL}/musicos/${c.citySlug}/${c.categorySlug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const musicianPages: MetadataRoute.Sitemap = musicians.map((m) => ({
    url: `${SITE_URL}/musico/${m.slug}`,
    lastModified: m.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...eventPages,
    ...landingPages,
    ...comboPages,
    ...musicianPages,
  ];
}
