import { prisma } from "@/lib/prisma";
import { musicianCardSelect, type MusicianCardData } from "@/lib/data/musicians";

export type MatchAnswers = {
  eventType?: string; // slug de EventType
  mood?: string; // ambiente buscado
  guests?: string; // rango de invitados
  city?: string;
  budget?: string; // rango de presupuesto
};

export type MatchResult = {
  musician: MusicianCardData;
  score: number; // 0-100
  reasons: string[];
};

/** Ambientes → géneros que suelen encajar. */
const MOOD_GENRES: Record<string, string[]> = {
  elegante: ["jazz", "clasica", "swing", "boleros"],
  fiesta: ["electronica", "urbano", "latino", "versiones"],
  intimo: ["acustico", "boleros", "clasica", "pop"],
  tradicional: ["flamenco", "copla", "latino"],
  moderno: ["pop", "soul-funk", "versiones", "urbano"],
};

const MOOD_LABELS: Record<string, string> = {
  elegante: "elegante y sofisticado",
  fiesta: "de fiesta y baile",
  intimo: "íntimo y cercano",
  tradicional: "tradicional",
  moderno: "moderno y actual",
};

const BUDGET_RANGES: Record<string, { min?: number; max?: number }> = {
  "0-400": { max: 400 },
  "400-700": { min: 400, max: 700 },
  "700-1200": { min: 700, max: 1200 },
  "1200+": { min: 1200 },
};

/** Nº de invitados → nº de músicos que suele pedir el evento. */
const GUEST_MEMBERS: Record<string, { min: number; max: number }> = {
  "0-50": { min: 1, max: 3 },
  "50-120": { min: 1, max: 5 },
  "120-250": { min: 2, max: 8 },
  "250+": { min: 3, max: 20 },
};

/**
 * Scoring transparente y explicable: cada criterio suma puntos y genera una
 * razón legible. Preferimos esto a una "caja negra" porque el usuario necesita
 * entender POR QUÉ le recomendamos a alguien para fiarse de la recomendación.
 */
export async function findMatches(answers: MatchAnswers, limit = 5): Promise<MatchResult[]> {
  const budget = answers.budget ? BUDGET_RANGES[answers.budget] : undefined;
  const moodGenres = answers.mood ? (MOOD_GENRES[answers.mood] ?? []) : [];
  const guests = answers.guests ? GUEST_MEMBERS[answers.guests] : undefined;

  // Traemos un pool amplio (filtrando solo por lo innegociable) y puntuamos en
  // memoria: así nadie queda fuera por fallar un único criterio blando.
  const pool = await prisma.musicianProfile.findMany({
    where: {
      status: "published",
      ...(answers.city ? { city: answers.city } : {}),
    },
    take: 60,
    select: musicianCardSelect,
  });

  const scored = pool.map((musician): MatchResult => {
    let score = 40; // base: está publicado y disponible en la plataforma
    const reasons: string[] = [];

    // Tipo de evento (lo que más pesa: hace ese tipo de bolo o no)
    if (answers.eventType) {
      // eventTypes no está en el select de tarjeta; lo resolvemos abajo con un segundo paso
    }

    // Género acorde al ambiente buscado
    if (moodGenres.length) {
      const hits = musician.genres.filter((g) => moodGenres.includes(g.slug));
      if (hits.length) {
        score += Math.min(22, hits.length * 11);
        reasons.push(
          `Su estilo (${hits.map((h) => h.label).join(", ")}) encaja con un ambiente ${MOOD_LABELS[answers.mood!] ?? answers.mood}`
        );
      }
    }

    // Presupuesto
    if (budget && musician.priceFrom) {
      const okMin = budget.min === undefined || musician.priceFrom >= budget.min * 0.75;
      const okMax = budget.max === undefined || musician.priceFrom <= budget.max;
      if (okMin && okMax) {
        score += 16;
        reasons.push("Entra en tu presupuesto");
      } else if (budget.max && musician.priceFrom > budget.max) {
        score -= 18;
      }
    }

    // Tamaño de la formación acorde al aforo
    if (guests && musician.membersCount) {
      if (musician.membersCount >= guests.min && musician.membersCount <= guests.max) {
        score += 10;
        reasons.push(
          `Formación de ${musician.membersCount} ${musician.membersCount === 1 ? "músico" : "músicos"}, proporcionada a tu aforo`
        );
      }
    }

    // Ciudad
    if (answers.city && musician.city === answers.city) {
      score += 8;
      reasons.push(`Está en ${musician.city}, sin coste de desplazamiento largo`);
    }

    // Señales de confianza
    if (musician.verified) {
      score += 6;
      reasons.push("Artista verificado por Sonora");
    }
    if (musician.ratingCount > 0 && musician.ratingAvg >= 4.7) {
      score += 6;
      reasons.push(`${musician.ratingAvg.toFixed(1)} de valoración media`);
    }
    if (musician.gigsCount >= 100) {
      score += 4;
      reasons.push(`Más de ${Math.floor(musician.gigsCount / 50) * 50} actuaciones a sus espaldas`);
    }

    return {
      musician,
      score: Math.max(35, Math.min(99, Math.round(score))),
      reasons: reasons.slice(0, 3),
    };
  });

  // Filtro por tipo de evento en un segundo paso (necesita la relación)
  let finalScored = scored;
  if (answers.eventType) {
    const matchingIds = new Set(
      (
        await prisma.musicianProfile.findMany({
          where: {
            status: "published",
            eventTypes: { some: { slug: answers.eventType } },
          },
          select: { id: true },
        })
      ).map((m) => m.id)
    );

    finalScored = scored.map((s) =>
      matchingIds.has(s.musician.id)
        ? {
            ...s,
            score: Math.min(99, s.score + 20),
            reasons: ["Hace este tipo de evento habitualmente", ...s.reasons].slice(0, 3),
          }
        : { ...s, score: Math.max(30, s.score - 15) }
    );
  }

  return finalScored.sort((a, b) => b.score - a.score).slice(0, limit);
}
