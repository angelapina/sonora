import { prisma } from "@/lib/prisma";
import { CITIES } from "@/lib/taxonomy-data";

export async function getArtistTypes() {
  return prisma.artistType.findMany({ orderBy: { order: "asc" } });
}

/** Tipos de una sola disciplina: "musico" o "escenico". */
export async function getArtistTypesByKind(kind: "musico" | "escenico") {
  return prisma.artistType.findMany({ where: { kind }, orderBy: { order: "asc" } });
}

export async function getGenres() {
  return prisma.genre.findMany({ orderBy: { order: "asc" } });
}

export async function getEventTypes() {
  return prisma.eventType.findMany({ orderBy: { order: "asc" } });
}

export async function getInstruments() {
  return prisma.instrument.findMany({ orderBy: { label: "asc" } });
}

export function getCities() {
  return CITIES;
}
