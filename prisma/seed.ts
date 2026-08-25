import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  ARTIST_TYPES,
  GENRES,
  EVENT_TYPES,
  INSTRUMENTS,
} from "../src/lib/taxonomy-data";

const prisma = new PrismaClient();

// Vídeos de YouTube estables y de temática musical, usados como placeholder de demo.
const DEMO_VIDEOS = [
  "dQw4w9WgXcQ",
  "09R8_2nJtjg",
  "kJQP7kiw5Fk",
  "JGwWNGJdvx8",
  "fJ9rUzIMcZQ",
  "L_jWHffIx5E",
];

// Audios de demostración de SoundHelix (dominio público para pruebas/streaming).
const DEMO_AUDIO = Array.from(
  { length: 10 },
  (_, i) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i + 1}.mp3`
);

function photo(seed: string, w = 1200, h = 900) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type MusicianSeed = {
  stageName: string;
  city: string;
  zone?: string;
  tagline: string;
  bio: string;
  artistTypes: string[];
  genres: string[];
  eventTypes: string[];
  instruments: string[];
  priceFrom: number;
  priceNote?: string;
  yearsExperience: number;
  featured?: boolean;
  plan?: "free" | "premium";
  // --- campos de marketplace ---
  verified?: boolean;
  membersCount?: number;
  minDurationMin?: number;
  travelRadiusKm?: number;
  equipmentIncluded?: boolean;
  languages?: string;
  formats?: string;
  venueTypes?: string;
  repertoire?: string;
  influences?: string;
  packages?: { name: string; description?: string; price: number; durationMin?: number; includes?: string }[];
};

const MUSICIANS: MusicianSeed[] = [
  {
    stageName: "Marta Vidal",
    city: "Madrid",
    zone: "Comunidad de Madrid",
    tagline: "Voz pop con alma para bodas y eventos únicos",
    bio: "Cantante solista con más de 10 años de experiencia amenizando bodas y eventos privados por toda España. Repertorio versátil que va del pop actual a los grandes clásicos, adaptado a cada momento de la celebración.",
    artistTypes: ["cantante", "solista"],
    genres: ["pop", "versiones"],
    eventTypes: ["boda", "corporativo", "restaurante"],
    instruments: ["voz"],
    priceFrom: 450,
    priceNote: "Según duración, formato (acústico/banda) y desplazamiento",
    yearsExperience: 10,
    featured: true,
    plan: "premium",
  },
  {
    stageName: "Trío Azul",
    city: "Barcelona",
    tagline: "Jazz y soul en formato íntimo",
    bio: "Trío de voz, piano y contrabajo especializado en jazz vocal y soul. Perfectos para cócteles, cenas de gala y ceremonias que buscan una atmósfera elegante y sofisticada.",
    artistTypes: ["banda"],
    genres: ["jazz", "soul-funk"],
    eventTypes: ["boda", "restaurante", "hotel"],
    instruments: ["voz", "piano", "contrabajo"],
    priceFrom: 900,
    yearsExperience: 8,
  },
  {
    stageName: "DJ Numa",
    city: "Valencia",
    tagline: "Sesiones que llenan la pista toda la noche",
    bio: "DJ profesional con residencias en clubs de la Comunidad Valenciana y experiencia en bodas, fiestas privadas y eventos de empresa. Sonido propio, iluminación y lectura perfecta de cada pista.",
    artistTypes: ["dj"],
    genres: ["electronica", "urbano"],
    eventTypes: ["fiesta-privada", "corporativo", "festival"],
    instruments: ["dj-set"],
    priceFrom: 350,
    yearsExperience: 6,
    featured: true,
  },
  {
    stageName: "Elena Roig",
    city: "Barcelona",
    tagline: "Violín para ceremonias inolvidables",
    bio: "Violinista formada en el Conservatorio Superior de Música de Barcelona. Especializada en ceremonias de boda y actos institucionales, con repertorio clásico y versiones actuales para violín.",
    artistTypes: ["violinista", "solista"],
    genres: ["clasica", "pop"],
    eventTypes: ["boda", "corporativo"],
    instruments: ["violin"],
    priceFrom: 300,
    yearsExperience: 12,
  },
  {
    stageName: "Los Hermanos Ruiz",
    city: "Sevilla",
    tagline: "Flamenco de raíz para celebraciones con duende",
    bio: "Grupo flamenco familiar con generaciones de tradición andaluza. Cantes, guitarra y percusión en directo para bodas, eventos privados y celebraciones que quieren sentir el flamenco de verdad.",
    artistTypes: ["banda"],
    genres: ["flamenco", "copla"],
    eventTypes: ["boda", "restaurante", "otro"],
    instruments: ["voz", "guitarra", "percusion-instr"],
    priceFrom: 700,
    yearsExperience: 15,
    featured: true,
  },
  {
    stageName: "Marco Salinas",
    city: "Madrid",
    tagline: "Saxo en directo para cócteles y cenas",
    bio: "Saxofonista con formación de jazz y amplia experiencia en hoteles y restaurantes de Madrid. Sesiones en directo o con base musical, adaptadas al ambiente que necesite tu evento.",
    artistTypes: ["saxofonista", "solista"],
    genres: ["jazz", "soul-funk"],
    eventTypes: ["restaurante", "hotel", "corporativo"],
    instruments: ["saxofon"],
    priceFrom: 280,
    yearsExperience: 9,
  },
  {
    stageName: "Duo Habana",
    city: "Málaga",
    tagline: "Boleros y ritmos latinos en directo",
    bio: "Dúo de voz y guitarra especializado en boleros, salsa y ritmos latinos. Ideal para animar bodas, aperitivos y fiestas privadas con un ambiente cálido y cercano.",
    artistTypes: ["duo"],
    genres: ["latino", "boleros"],
    eventTypes: ["boda", "fiesta-privada"],
    instruments: ["voz", "guitarra"],
    priceFrom: 500,
    yearsExperience: 7,
  },
  {
    stageName: "Iker Etxeberria",
    city: "Bilbao",
    tagline: "Piano en directo, la banda sonora de tu evento",
    bio: "Pianista profesional con repertorio de jazz, clásica y versiones actuales. Habitual en hoteles y restaurantes del País Vasco, también disponible para ceremonias y cócteles.",
    artistTypes: ["pianista", "solista"],
    genres: ["clasica", "jazz"],
    eventTypes: ["hotel", "restaurante", "boda"],
    instruments: ["piano"],
    priceFrom: 320,
    yearsExperience: 11,
  },
  {
    stageName: "Banda Vintage Club",
    city: "Madrid",
    tagline: "Swing y vintage con toda la banda en directo",
    bio: "Orquesta de seis músicos especializada en swing, vintage y grandes éxitos versionados con arreglos propios. Espectáculo en directo con vestuario de época para bodas y eventos de empresa que buscan algo diferente.",
    artistTypes: ["banda"],
    genres: ["swing"],
    eventTypes: ["boda", "corporativo"],
    instruments: ["voz", "piano", "bateria", "contrabajo"],
    priceFrom: 1200,
    yearsExperience: 13,
    featured: true,
    plan: "premium",
  },
  {
    stageName: "Nora Campos",
    city: "Valencia",
    tagline: "Pop y soul con carácter propio",
    bio: "Cantante versátil con formación en soul y pop actual. Formatos flexibles desde acústico a banda completa, adaptándose a cualquier tipo de celebración.",
    artistTypes: ["cantante", "solista"],
    genres: ["pop", "soul-funk"],
    eventTypes: ["boda", "corporativo", "restaurante"],
    instruments: ["voz"],
    priceFrom: 400,
    yearsExperience: 6,
  },
  {
    stageName: "Ensemble Cuerda Viva",
    city: "Madrid",
    tagline: "Cuarteto de cuerda para ceremonias con clase",
    bio: "Cuarteto formado por violín, viola, violonchelo y piano. Repertorio clásico y versiones instrumentales de música actual, ideal para ceremonias de boda y eventos institucionales.",
    artistTypes: ["banda", "otros"],
    genres: ["clasica"],
    eventTypes: ["boda", "corporativo"],
    instruments: ["violin", "cello", "piano"],
    priceFrom: 650,
    yearsExperience: 14,
  },
  {
    stageName: "DJ Selene",
    city: "Barcelona",
    tagline: "Electrónica de autor para eventos con personalidad",
    bio: "DJ residente en salas de Barcelona con sets de house y electrónica melódica. Especializada en festivales, fiestas privadas y after-works de empresa.",
    artistTypes: ["dj"],
    genres: ["electronica"],
    eventTypes: ["festival", "fiesta-privada", "corporativo"],
    instruments: ["dj-set"],
    priceFrom: 380,
    yearsExperience: 5,
  },
  {
    stageName: "Alba & Rai",
    city: "Alicante",
    tagline: "Acústico íntimo para momentos especiales",
    bio: "Dúo acústico de voz y guitarra con versiones cuidadas de pop y clásicos atemporales. Perfectos para ceremonias, aperitivos y cenas de boda.",
    artistTypes: ["duo"],
    genres: ["acustico", "pop"],
    eventTypes: ["boda", "restaurante"],
    instruments: ["voz", "guitarra"],
    priceFrom: 380,
    yearsExperience: 4,
  },
  {
    stageName: "Fanfarria Brass Five",
    city: "Zaragoza",
    tagline: "Sección de viento que sorprende en cada pasacalles",
    bio: "Formación de metales especializada en pasacalles sorpresa, recepciones y after-parties con energía de funk y soul. Un directo potente para dar la bienvenida a los invitados.",
    artistTypes: ["banda", "otros"],
    genres: ["urbano", "soul-funk"],
    eventTypes: ["festival", "corporativo", "otro"],
    instruments: ["trompeta", "percusion-instr"],
    priceFrom: 900,
    yearsExperience: 9,
  },
  {
    stageName: "Clara Montes",
    city: "Granada",
    tagline: "Voz flamenca para bodas con raíces",
    bio: "Cantaora granadina formada en peñas flamencas de la ciudad. Aporta emoción y autenticidad a ceremonias y celebraciones que buscan un toque andaluz genuino.",
    artistTypes: ["cantante", "solista"],
    genres: ["flamenco", "copla"],
    eventTypes: ["boda", "restaurante"],
    instruments: ["voz"],
    priceFrom: 420,
    yearsExperience: 8,
  },
  {
    stageName: "Percusión Ritmo Sur",
    city: "Sevilla",
    tagline: "Percusión en directo para no parar de bailar",
    bio: "Grupo de percusionistas especializado en ritmos latinos y urbanos en directo, pensado para animar la pista junto al DJ o como espectáculo independiente.",
    artistTypes: ["percusion", "banda"],
    genres: ["latino", "urbano"],
    eventTypes: ["festival", "fiesta-privada"],
    instruments: ["percusion-instr"],
    priceFrom: 550,
    yearsExperience: 7,
  },
  {
    stageName: "Diego Lara",
    city: "San Sebastián",
    tagline: "Guitarra flamenca y acústica en directo",
    bio: "Guitarrista solista con repertorio flamenco y acústico. Habitual en restaurantes y hoteles de la costa vasca, también disponible para ceremonias íntimas.",
    artistTypes: ["guitarrista", "solista"],
    genres: ["flamenco", "acustico"],
    eventTypes: ["restaurante", "hotel", "boda"],
    instruments: ["guitarra"],
    priceFrom: 250,
    yearsExperience: 10,
  },
  {
    stageName: "Big Band Costa del Sol",
    city: "Marbella",
    tagline: "La gran orquesta para grandes celebraciones",
    bio: "Big band de doce músicos con sección de viento completa, especializada en eventos de alto nivel: hoteles de lujo, bodas y galas de empresa en toda la Costa del Sol.",
    artistTypes: ["banda"],
    genres: ["swing", "jazz"],
    eventTypes: ["corporativo", "hotel", "boda"],
    instruments: ["voz", "saxofon", "trompeta", "bateria"],
    priceFrom: 1500,
    yearsExperience: 16,
    featured: true,
    plan: "premium",
  },
  {
    stageName: "Mar Iglesias",
    city: "Palma de Mallorca",
    tagline: "Pop mediterráneo para bodas junto al mar",
    bio: "Cantante afincada en Mallorca, especializada en bodas en fincas y hoteles de la isla. Repertorio en español, inglés e italiano.",
    artistTypes: ["cantante", "solista"],
    genres: ["pop", "versiones"],
    eventTypes: ["boda", "hotel"],
    instruments: ["voz"],
    priceFrom: 390,
    yearsExperience: 5,
  },
  {
    stageName: "Compañía Aire",
    city: "Sevilla",
    tagline: "Baile flamenco que corta la respiración",
    bio: "Compañía de baile flamenco con bailaora, guitarra y cante. Espectáculos de 30 a 60 minutos pensados para bodas, eventos de empresa y cenas de gala, con tarima propia y vestuario para cada pase.",
    artistTypes: ["baile-flamenco", "baile"],
    genres: ["flamenco", "copla"],
    eventTypes: ["boda", "corporativo", "hotel"],
    instruments: ["voz", "guitarra"],
    priceFrom: 800,
    priceNote: "Según número de artistas y duración del espectáculo",
    yearsExperience: 12,
    featured: true,
  },
  {
    stageName: "Nacho Prisma",
    city: "Madrid",
    tagline: "Magia de cerca que deja a la gente sin palabras",
    bio: "Mago especializado en magia de cerca y mentalismo. Recorre las mesas durante el cóctel o el banquete haciendo magia a un palmo de los invitados, y cierra con un pase de escenario de 20 minutos si el evento lo pide.",
    artistTypes: ["magia"],
    genres: [],
    eventTypes: ["boda", "corporativo", "fiesta-privada"],
    instruments: [],
    priceFrom: 550,
    yearsExperience: 9,
  },
  {
    stageName: "Fuego Nómada",
    city: "Valencia",
    tagline: "Espectáculo de fuego para cerrar la noche",
    bio: "Compañía de artes escénicas especializada en espectáculo de fuego y luz LED. Pases de 15 a 25 minutos con coreografía, pensados para el momento del corte de tarta o la entrada a la fiesta. Seguro de responsabilidad civil incluido.",
    artistTypes: ["fuego", "circo"],
    genres: ["electronica"],
    eventTypes: ["boda", "fiesta-privada", "festival"],
    instruments: [],
    priceFrom: 700,
    yearsExperience: 7,
  },
  {
    stageName: "Quartet Mediterrani",
    city: "Valencia",
    tagline: "Cuerda y piano con aire mediterráneo",
    bio: "Cuarteto formado en el Conservatorio de Valencia, combina repertorio clásico con versiones de pop y bandas sonoras para ceremonias y cócteles.",
    artistTypes: ["banda", "otros"],
    genres: ["clasica", "pop"],
    eventTypes: ["boda", "corporativo"],
    instruments: ["violin", "cello", "piano"],
    priceFrom: 700,
    yearsExperience: 10,
  },
];

/**
 * Detalles de marketplace por músico, en el mismo orden que MUSICIANS.
 * CONTENIDO DEMO: perfiles ficticios para poblar el MVP; ningún artista, cifra
 * ni reseña corresponde a personas reales.
 */
const MUSICIAN_DETAILS: Partial<MusicianSeed>[] = [
  { // Marta Vidal
    verified: true, membersCount: 1, minDurationMin: 60, travelRadiusKm: 200,
    equipmentIncluded: true, languages: "es,en", formats: "acustico,electrico",
    venueTypes: "interior,exterior",
    repertoire: "Del pop actual a los clásicos que todo el mundo se sabe: Adele, Amaral, Norah Jones, Rosalía en versión acústica, y los imprescindibles de los 80 para el final de fiesta.",
    influences: "Adele, Amy Winehouse, Vanesa Martín",
    packages: [
      { name: "Ceremonia", description: "Entrada, firma y salida con acompañamiento acústico.", price: 450, durationMin: 60, includes: "Voz y guitarra\nEquipo de sonido\nReunión previa para elegir temas" },
      { name: "Ceremonia + cóctel", description: "El momento clave y el ambiente del aperitivo.", price: 700, durationMin: 150, includes: "Voz y guitarra\nEquipo de sonido\n2 pases en directo\nMúsica ambiental entre pases" },
      { name: "Evento completo", description: "Desde la ceremonia hasta que se llena la pista.", price: 1100, durationMin: 300, includes: "Formato ampliado con cajón y bajo\nEquipo e iluminación\n3 pases en directo\nDJ set posterior" },
    ],
  },
  { // Trío Azul
    verified: true, membersCount: 3, minDurationMin: 90, travelRadiusKm: 150,
    equipmentIncluded: true, languages: "es,en,fr", formats: "acustico",
    venueTypes: "interior",
    repertoire: "Standards de jazz vocal, bossa nova y soul clásico: Ella Fitzgerald, Chet Baker, Stevie Wonder, Jobim.",
    influences: "Diana Krall, Norah Jones, Bill Evans Trio",
    packages: [
      { name: "Cóctel", description: "Jazz de fondo mientras llegan los invitados.", price: 900, durationMin: 90, includes: "Voz, piano y contrabajo\nEquipo de sonido\n2 pases de 45 min" },
      { name: "Cena de gala", description: "Ambiente elegante durante toda la cena.", price: 1300, durationMin: 180, includes: "Trío completo\nEquipo de sonido\n3 pases\nRepertorio personalizado" },
    ],
  },
  { // DJ Numa
    verified: true, membersCount: 1, minDurationMin: 180, travelRadiusKm: 300,
    equipmentIncluded: true, languages: "es,en", formats: "electrico",
    venueTypes: "interior,exterior",
    repertoire: "House, tech house y los himnos que no fallan. Lectura de pista en tiempo real: si el ambiente pide reggaetón, suena reggaetón.",
    influences: "Solomun, Black Coffee, Dennis Cruz",
    packages: [
      { name: "Sesión básica", description: "Tres horas de pista sin bajones.", price: 350, durationMin: 180, includes: "Sesión DJ\nEquipo de sonido para 100 personas\nIluminación básica" },
      { name: "Fiesta completa", description: "Toda la noche, con equipo grande.", price: 650, durationMin: 300, includes: "Sesión DJ\nSonido para 250 personas\nIluminación y humo\nMicrófono para discursos" },
    ],
  },
  { // Elena Roig
    verified: true, membersCount: 1, minDurationMin: 45, travelRadiusKm: 150,
    equipmentIncluded: false, languages: "es,en,ca", formats: "acustico",
    venueTypes: "interior,exterior",
    repertoire: "Repertorio clásico para ceremonia (Pachelbel, Bach, Vivaldi) y versiones actuales para violín: Coldplay, Ed Sheeran, bandas sonoras de cine.",
    influences: "Lindsey Stirling, Itzhak Perlman",
    packages: [
      { name: "Ceremonia", description: "Entrada, momentos clave y salida.", price: 300, durationMin: 45, includes: "Violín solo\nAmplificación si es necesaria\nElección de temas contigo" },
      { name: "Ceremonia + cóctel", description: "Continúa el ambiente en el aperitivo.", price: 550, durationMin: 120, includes: "Violín solo\nAmplificación\nRepertorio ampliado" },
    ],
  },
  { // Los Hermanos Ruiz
    verified: true, membersCount: 4, minDurationMin: 60, travelRadiusKm: 250,
    equipmentIncluded: true, languages: "es", formats: "acustico",
    venueTypes: "interior,exterior",
    repertoire: "Cante jondo, bulerías, sevillanas y rumbas. También el repertorio festero que levanta a la gente después del banquete.",
    influences: "Camarón, Paco de Lucía, Los Chunguitos",
    packages: [
      { name: "Cuadro flamenco", description: "Cante, guitarra y palmas.", price: 700, durationMin: 60, includes: "3 artistas\nEquipo de sonido\n2 pases" },
      { name: "Fiesta flamenca", description: "Con baile y pase festero final.", price: 1200, durationMin: 150, includes: "5 artistas incl. bailaora\nEquipo completo\n3 pases\nTarima de baile" },
    ],
  },
  { // Marco Salinas
    verified: true, membersCount: 1, minDurationMin: 60, travelRadiusKm: 120,
    equipmentIncluded: true, languages: "es,en", formats: "acustico,electrico",
    venueTypes: "interior,exterior",
    repertoire: "Saxo sobre bases house para cócteles, y standards de jazz para cenas. Puede tocar en formato lounge o subir la energía en la pista.",
    influences: "Candy Dulfer, Dave Koz, Masego",
    packages: [
      { name: "Aperitivo", description: "Saxo en directo durante el cóctel.", price: 280, durationMin: 60, includes: "Saxo + bases\nEquipo propio\n2 pases de 30 min" },
      { name: "Saxo + DJ", description: "Saxo en directo sobre la sesión del DJ.", price: 500, durationMin: 120, includes: "Saxo en directo\nCoordinación con tu DJ\n3 pases" },
    ],
  },
  { // Duo Habana
    membersCount: 2, minDurationMin: 90, travelRadiusKm: 180,
    equipmentIncluded: true, languages: "es,en", formats: "acustico",
    venueTypes: "interior,exterior",
    repertoire: "Boleros de toda la vida, son cubano, bachata y salsa suave. Perfectos para que la gente mayor también disfrute.",
    influences: "Buena Vista Social Club, Compay Segundo",
    packages: [
      { name: "Aperitivo latino", description: "Boleros y son durante el cóctel.", price: 500, durationMin: 90, includes: "Voz y guitarra\nEquipo de sonido\n2 pases" },
    ],
  },
  { // Iker Etxeberria
    verified: true, membersCount: 1, minDurationMin: 90, travelRadiusKm: 120,
    equipmentIncluded: false, languages: "es,en,eu", formats: "acustico",
    venueTypes: "interior",
    repertoire: "Jazz de piano solo, standards americanos, y versiones instrumentales de pop actual. Nada invasivo: música que acompaña la conversación.",
    influences: "Bill Evans, Ludovico Einaudi, Michel Camilo",
    packages: [
      { name: "Piano bar", description: "Ambiente durante cena o cóctel.", price: 320, durationMin: 90, includes: "Piano solo (requiere piano en sala)\n2 pases" },
      { name: "Velada completa", description: "Toda la noche al piano.", price: 550, durationMin: 180, includes: "Piano solo\n3 pases\nRepertorio a medida" },
    ],
  },
  { // Banda Vintage Club
    verified: true, membersCount: 6, minDurationMin: 90, travelRadiusKm: 350,
    equipmentIncluded: true, languages: "es,en", formats: "electrico",
    venueTypes: "interior,exterior",
    repertoire: "Swing de los años 40, rock and roll, Motown y grandes éxitos versionados con sección de viento. Vestuario de época incluido.",
    influences: "The Puppini Sisters, Postmodern Jukebox, Michael Bublé",
    packages: [
      { name: "Show swing", description: "Espectáculo de 90 minutos con vestuario.", price: 1200, durationMin: 90, includes: "6 músicos\nVestuario de época\nEquipo e iluminación\n2 pases" },
      { name: "Gran gala", description: "La banda completa toda la noche.", price: 1900, durationMin: 240, includes: "6 músicos + presentador\nVestuario\nEquipo completo\n3 pases\nDJ entre pases" },
    ],
  },
  { // Nora Campos
    membersCount: 1, minDurationMin: 60, travelRadiusKm: 150,
    equipmentIncluded: true, languages: "es,en", formats: "acustico,electrico",
    venueTypes: "interior,exterior",
    repertoire: "Soul y pop actual con arreglos propios: Alicia Keys, Aretha, Dua Lipa, Rosalía. Formato acústico o con banda.",
    influences: "Alicia Keys, Aretha Franklin, India Martínez",
    packages: [
      { name: "Acústico", description: "Voz y guitarra para momentos íntimos.", price: 400, durationMin: 60, includes: "Voz y guitarra\nEquipo de sonido\n2 pases" },
      { name: "Con banda", description: "Formato completo para llenar la pista.", price: 900, durationMin: 120, includes: "4 músicos\nEquipo e iluminación\n3 pases" },
    ],
  },
];

const REVIEW_AUTHORS = [
  "Laura G.",
  "Javier M.",
  "Sara P.",
  "Carlos R.",
  "Andrea F.",
  "Pablo S.",
  "Lucía T.",
  "Diego N.",
  "Marina V.",
  "Rubén C.",
];

const REVIEW_COMMENTS = [
  "Superaron nuestras expectativas, todos los invitados preguntaron quiénes eran.",
  "Puntuales, profesionales y con un repertorio perfecto para el momento.",
  "La comunicación antes del evento fue excelente, todo salió como hablamos.",
  "Ambiente increíble, la pista no paró de bailar en toda la noche.",
  "Muy recomendables, cuidan hasta el último detalle.",
  "El nivel musical es altísimo, se nota la experiencia.",
  "Se adaptaron perfectamente al espacio y al tipo de evento.",
  "Repetiríamos sin dudarlo para cualquier celebración.",
];

async function main() {
  console.log("Limpiando datos transaccionales previos (reseñas, solicitudes, mensajes, favoritos)...");
  await prisma.message.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.bookingRequest.deleteMany({});
  await prisma.favorite.deleteMany({});

  console.log("Sembrando taxonomías...");

  for (const [i, t] of ARTIST_TYPES.entries()) {
    await prisma.artistType.upsert({
      where: { slug: t.slug },
      update: { label: t.label, icon: t.icon, order: i, kind: t.kind },
      create: { slug: t.slug, label: t.label, icon: t.icon, order: i, kind: t.kind },
    });
  }
  for (const [i, g] of GENRES.entries()) {
    await prisma.genre.upsert({
      where: { slug: g.slug },
      update: { label: g.label, order: i },
      create: { slug: g.slug, label: g.label, order: i },
    });
  }
  for (const [i, e] of EVENT_TYPES.entries()) {
    await prisma.eventType.upsert({
      where: { slug: e.slug },
      update: { label: e.label, icon: e.icon, order: i },
      create: { slug: e.slug, label: e.label, icon: e.icon, order: i },
    });
  }
  for (const ins of INSTRUMENTS) {
    await prisma.instrument.upsert({
      where: { slug: ins.slug },
      update: { label: ins.label },
      create: { slug: ins.slug, label: ins.label },
    });
  }

  console.log("Creando usuarios de sistema (admin y cliente demo)...");

  const adminPass = await bcrypt.hash("Admin1234!", 10);
  await prisma.user.upsert({
    where: { email: "admin@sonora.app" },
    update: {},
    create: {
      email: "admin@sonora.app",
      name: "Administración Sonora",
      passwordHash: adminPass,
      role: "ADMIN",
    },
  });

  const clientPass = await bcrypt.hash("Cliente1234!", 10);
  const demoClient = await prisma.user.upsert({
    where: { email: "cliente@ejemplo.com" },
    update: {},
    create: {
      email: "cliente@ejemplo.com",
      name: "Ana Cliente",
      passwordHash: clientPass,
      role: "CLIENT",
    },
  });

  console.log(`Creando ${MUSICIANS.length} perfiles de músico...`);

  const musicianPass = await bcrypt.hash("Musico1234!", 10);
  const createdProfiles: { id: string; slug: string }[] = [];

  for (const [idx, m] of MUSICIANS.entries()) {
    const slug = slugify(m.stageName);
    const email = `${slug}@sonora.app`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: m.stageName,
        passwordHash: musicianPass,
        role: "MUSICIAN",
      },
    });

    const ratingCount = 2 + (idx % 4);
    const ratingAvg = 4.4 + ((idx * 7) % 6) / 10; // entre 4.4 y 4.9
    const detail: Partial<MusicianSeed> = MUSICIAN_DETAILS[idx] ?? {};

    // Los campos de marketplace se re-aplican también en `update` para que
    // re-ejecutar el seed sobre una BD ya poblada refresque los perfiles
    // existentes en vez de dejarlos con los valores por defecto.
    const marketplaceFields = {
      verified: detail.verified ?? false,
      respondsFast: idx % 3 !== 2,
      gigsCount: 20 + m.yearsExperience * 9 + (idx % 7) * 4,
      membersCount: detail.membersCount,
      minDurationMin: detail.minDurationMin,
      travelRadiusKm: detail.travelRadiusKm,
      equipmentIncluded: detail.equipmentIncluded ?? false,
      languages: detail.languages,
      formats: detail.formats,
      venueTypes: detail.venueTypes,
      repertoire: detail.repertoire,
      influences: detail.influences,
    };

    const profile = await prisma.musicianProfile.upsert({
      where: { slug },
      update: marketplaceFields,
      create: {
        userId: user.id,
        slug,
        stageName: m.stageName,
        tagline: m.tagline,
        bio: m.bio,
        city: m.city,
        zone: m.zone,
        avatarUrl: photo(`${slug}-avatar`, 400, 400),
        coverUrl: photo(`${slug}-cover`, 1600, 900),
        priceFrom: m.priceFrom,
        priceNote: m.priceNote,
        yearsExperience: m.yearsExperience,
        status: "published",
        featured: !!m.featured,
        plan: m.plan ?? "free",
        website: `https://${slug}.example.com`,
        instagram: `https://instagram.com/${slug}`,
        contactEmail: email,
        ratingAvg: Math.round(ratingAvg * 10) / 10,
        ratingCount,
        ...marketplaceFields,
        artistTypes: { connect: m.artistTypes.map((s) => ({ slug: s })) },
        genres: { connect: m.genres.map((s) => ({ slug: s })) },
        eventTypes: { connect: m.eventTypes.map((s) => ({ slug: s })) },
        instruments: { connect: m.instruments.map((s) => ({ slug: s })) },
      },
    });

    // Paquetes de precio configurables (se regeneran en cada seed)
    await prisma.pricingPackage.deleteMany({ where: { musicianId: profile.id } });
    if (detail.packages?.length) {
      await prisma.pricingPackage.createMany({
        data: detail.packages.map((p, order) => ({
          musicianId: profile.id,
          name: p.name,
          description: p.description,
          price: p.price,
          durationMin: p.durationMin,
          includes: p.includes,
          order,
        })),
      });
    }

    createdProfiles.push({ id: profile.id, slug });

    // Media: 4 fotos, 1 vídeo, 1-2 audios
    const mediaData = [
      ...Array.from({ length: 4 }, (_, i) => ({
        musicianId: profile.id,
        type: "photo",
        url: photo(`${slug}-gallery-${i}`, 1200, 900),
        provider: "picsum",
        order: i,
      })),
      {
        musicianId: profile.id,
        type: "video",
        url: DEMO_VIDEOS[idx % DEMO_VIDEOS.length],
        provider: "youtube",
        title: `${m.stageName} — actuación en directo`,
        order: 0,
      },
      {
        musicianId: profile.id,
        type: "audio",
        url: DEMO_AUDIO[idx % DEMO_AUDIO.length],
        provider: "upload",
        title: "Muestra en directo 1",
        order: 0,
      },
      {
        musicianId: profile.id,
        type: "audio",
        url: DEMO_AUDIO[(idx + 3) % DEMO_AUDIO.length],
        provider: "upload",
        title: "Muestra en directo 2",
        order: 1,
      },
    ];
    await prisma.media.createMany({ data: mediaData });

    // Disponibilidad: bloquea un par de fechas próximas
    const blockedDates = [10 + idx, 25 + idx].map((offset) => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      d.setHours(0, 0, 0, 0);
      return d;
    });
    for (const date of blockedDates) {
      await prisma.availabilityBlock.upsert({
        where: { musicianId_date: { musicianId: profile.id, date } },
        update: {},
        create: { musicianId: profile.id, date, available: false },
      });
    }

    // Reseñas aprobadas + 1 pendiente de moderación en el primer músico.
    // Las primeras se marcan como "contratación verificada" (vía Sonora).
    for (let r = 0; r < ratingCount; r++) {
      const base = 4 + ((idx + r) % 2);
      const jitter = (n: number) => Math.min(5, Math.max(3, base + ((idx + r + n) % 3) - 1));
      await prisma.review.create({
        data: {
          musicianId: profile.id,
          authorName: REVIEW_AUTHORS[(idx + r) % REVIEW_AUTHORS.length],
          eventType: m.eventTypes[r % m.eventTypes.length],
          rating: base,
          comment: REVIEW_COMMENTS[(idx + r) % REVIEW_COMMENTS.length],
          approved: true,
          verifiedBooking: r < 2,
          ratingMusic: jitter(0),
          ratingProfessionalism: jitter(1),
          ratingPunctuality: jitter(2),
          ratingCommunication: jitter(3),
          ratingValue: jitter(4),
        },
      });
    }
    if (idx === 0) {
      await prisma.review.create({
        data: {
          musicianId: profile.id,
          authorName: "Nuevo cliente",
          eventType: "boda",
          rating: 5,
          comment: "Reseña recién enviada, pendiente de aprobar por el equipo de Sonora.",
          approved: false,
        },
      });
    }
  }

  console.log("Creando solicitudes de presupuesto y mensajes de ejemplo...");

  const targets = createdProfiles.slice(0, 5);
  const eventTypesForRequests = ["boda", "corporativo", "fiesta-privada", "restaurante", "hotel"];

  for (const [i, target] of targets.entries()) {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 30 + i * 5);

    const booking = await prisma.bookingRequest.create({
      data: {
        musicianId: target.id,
        clientUserId: i % 2 === 0 ? demoClient.id : null,
        guestName: i % 2 === 0 ? demoClient.name : "Invitado sin cuenta",
        guestEmail: i % 2 === 0 ? demoClient.email : "invitado@example.com",
        guestPhone: "600123456",
        eventType: eventTypesForRequests[i % eventTypesForRequests.length],
        eventDate,
        city: "Madrid",
        budgetMin: 400,
        budgetMax: 1200,
        message: "Hola, nos gustaría contar con vosotros para nuestro evento. ¿Podríais enviarnos disponibilidad y presupuesto?",
        status: i === 0 ? "accepted" : "pending",
      },
    });

    if (i === 0) {
      await prisma.message.createMany({
        data: [
          {
            bookingRequestId: booking.id,
            senderId: demoClient.id,
            senderRole: "client",
            body: "Hola, nos gustaría contar con vosotros para nuestro evento. ¿Podríais enviarnos disponibilidad y presupuesto?",
          },
          {
            bookingRequestId: booking.id,
            senderRole: "musician",
            body: "¡Hola! Gracias por escribirnos, esa fecha la tenemos disponible. Os paso presupuesto detallado por email.",
          },
        ],
      });
    }
  }

  console.log("Creando favoritos de ejemplo...");
  for (const target of createdProfiles.slice(0, 3)) {
    await prisma.favorite.upsert({
      where: { userId_musicianId: { userId: demoClient.id, musicianId: target.id } },
      update: {},
      create: { userId: demoClient.id, musicianId: target.id },
    });
  }

  console.log("Seed completado ✔");
  console.log(`Admin: admin@sonora.app / Admin1234!`);
  console.log(`Cliente demo: cliente@ejemplo.com / Cliente1234!`);
  console.log(`Cualquier músico: <slug>@sonora.app / Musico1234!  (ej. marta-vidal@sonora.app)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
