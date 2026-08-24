// Taxonomías compartidas entre el seed (prisma/seed.ts) y la app (categorías rápidas
// de home, filtros, etc.). Viven también en BD (gestionables desde /admin); este
// archivo es la fuente inicial y no depende de Prisma, por lo que es seguro
// importarlo tanto en Server como en Client Components.

export const ARTIST_TYPES = [
  { slug: "cantante", label: "Cantante", icon: "🎤" },
  { slug: "banda", label: "Banda", icon: "🎸" },
  { slug: "dj", label: "DJ", icon: "🎧" },
  { slug: "saxofonista", label: "Saxofonista", icon: "🎷" },
  { slug: "violinista", label: "Violín", icon: "🎻" },
  { slug: "pianista", label: "Pianista", icon: "🎹" },
  { slug: "percusion", label: "Percusión", icon: "🥁" },
  { slug: "duo", label: "Dúo", icon: "🎶" },
  { slug: "solista", label: "Solista", icon: "🎵" },
  { slug: "guitarrista", label: "Guitarrista", icon: "🎸" },
  { slug: "otros", label: "Otros", icon: "🎺" },
] as const;

export const GENRES = [
  { slug: "pop", label: "Pop" },
  { slug: "rock", label: "Rock" },
  { slug: "jazz", label: "Jazz" },
  { slug: "flamenco", label: "Flamenco" },
  { slug: "latino", label: "Latino" },
  { slug: "electronica", label: "Electrónica / House" },
  { slug: "clasica", label: "Clásica" },
  { slug: "soul-funk", label: "Soul & Funk" },
  { slug: "versiones", label: "Versiones / Pop Rock comercial" },
  { slug: "boleros", label: "Boleros & Baladas" },
  { slug: "swing", label: "Swing / Vintage" },
  { slug: "urbano", label: "Urbano / Reggaetón" },
  { slug: "copla", label: "Copla & Español" },
  { slug: "acustico", label: "Acústico" },
] as const;

export const EVENT_TYPES = [
  { slug: "boda", label: "Boda", icon: "💍" },
  { slug: "cumpleanos", label: "Cumpleaños", icon: "🎂" },
  { slug: "fiesta-privada", label: "Fiesta privada", icon: "🎉" },
  { slug: "corporativo", label: "Evento corporativo", icon: "🏢" },
  { slug: "restaurante", label: "Restaurante", icon: "🍽️" },
  { slug: "hotel", label: "Hotel", icon: "🏨" },
  { slug: "festival", label: "Festival", icon: "🎪" },
  { slug: "otro", label: "Otro", icon: "✨" },
] as const;

export const INSTRUMENTS = [
  { slug: "voz", label: "Voz" },
  { slug: "guitarra", label: "Guitarra" },
  { slug: "piano", label: "Piano / Teclado" },
  { slug: "saxofon", label: "Saxofón" },
  { slug: "violin", label: "Violín" },
  { slug: "bateria", label: "Batería" },
  { slug: "percusion-instr", label: "Percusión" },
  { slug: "bajo", label: "Bajo" },
  { slug: "trompeta", label: "Trompeta" },
  { slug: "contrabajo", label: "Contrabajo" },
  { slug: "dj-set", label: "Mesa de DJ" },
  { slug: "acordeon", label: "Acordeón" },
  { slug: "cello", label: "Violonchelo" },
] as const;

// Coordenadas aproximadas (centro de ciudad) usadas para el detector de
// "ciudad más cercana" a partir de la geolocalización del navegador — 100% en
// cliente, sin llamar a ninguna API externa de geocodificación.
export const CITIES = [
  { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Barcelona", lat: 41.3851, lng: 2.1734 },
  { name: "Valencia", lat: 39.4699, lng: -0.3763 },
  { name: "Sevilla", lat: 37.3891, lng: -5.9845 },
  { name: "Bilbao", lat: 43.263, lng: -2.935 },
  { name: "Málaga", lat: 36.7213, lng: -4.4213 },
  { name: "Zaragoza", lat: 41.6488, lng: -0.8891 },
  { name: "Alicante", lat: 38.3452, lng: -0.481 },
  { name: "San Sebastián", lat: 43.3183, lng: -1.9812 },
  { name: "Palma de Mallorca", lat: 39.5696, lng: 2.6502 },
  { name: "Marbella", lat: 36.5099, lng: -4.8863 },
  { name: "Granada", lat: 37.1773, lng: -3.5986 },
] as const;

export function nearestCity(lat: number, lng: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  let best: (typeof CITIES)[number] = CITIES[0];
  let bestDist = Infinity;
  for (const city of CITIES) {
    const dLat = toRad(city.lat - lat);
    const dLng = toRad(city.lng - lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) * Math.cos(toRad(city.lat)) * Math.sin(dLng / 2) ** 2;
    const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (dist < bestDist) {
      bestDist = dist;
      best = city;
    }
  }
  return best.name;
}
