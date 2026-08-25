/**
 * Sistema de copy de Sonora.
 *
 * Eje de marca: LA MÚSICA HACE EL MOMENTO.
 * Sonora no vende músicos: vende la sensación de que el evento salió bien.
 * Por eso el copy habla de momentos, no de "proveedores"; de lo que pasa en la
 * sala, no de features de la plataforma.
 *
 * Reglas de tono:
 * - Directo y humano, tuteando. Nada de "marketplace líder" ni corporativismo.
 * - Frases cortas. Verbos concretos (escucha, compara, reserva).
 * - Al cliente se le habla de su evento; al músico, de sus bolos.
 * - Cero jerga técnica de producto en la parte pública.
 *
 * Centralizar aquí los textos mantiene la voz coherente y deja el terreno listo
 * para i18n (mismo objeto, otro idioma) sin tocar componentes.
 */

export const brand = {
  name: "Sonora",
  promise: "La música hace el momento.",
};

export const home = {
  hero: {
    /**
     * El titular es la acción («contrata») y lleva dentro la ocasión, que rota.
     * Eso mete en el H1 todas las intenciones de búsqueda reales —contratar un
     * artista para una boda, para una fiesta, para un evento de empresa— porque
     * las cinco variantes viven en el DOM aunque solo se vea una.
     */
    eyebrow: "Sonora",
    titleStart: "Contrata un artista para tu",
    titleWords: ["boda.", "fiesta.", "empresa.", "cena.", "celebración."],
    subtitle: "Escucha, compara y descubre miles de artistas.",
    ctaPrimary: "Buscar artistas",
    ctaSecondary: "Cómo funciona",
  },
  categories: {
    eyebrow: "Explora",
    // "Qué música" dejaba fuera a los artistas escénicos: quien busca un mago
    // o un espectáculo de fuego no está imaginando música.
    title: "¿Qué estás imaginándote?",
    subtitle: "Música en directo, espectáculo, o las dos cosas en la misma noche.",
  },
  occasions: {
    eyebrow: "Por ocasión",
    title: "¿Qué estás organizando?",
    subtitle: "Cada momento pide su música. Empieza por el tuyo.",
  },
  artistKinds: {
    eyebrow: "Explora",
    title: "¿Qué buscas exactamente?",
    subtitle: "Música en directo, espectáculo, o las dos cosas.",
  },
  featured: {
    eyebrow: "Seleccionados por Sonora",
    title: "Artistas destacados",
    href: "/buscar",
  },
  nearby: {
    eyebrow: "Cerca de ti",
    title: "Suenan en tu ciudad",
    href: "/buscar",
  },
  fresh: {
    eyebrow: "Recién llegados",
    title: "Nuevos en Sonora",
    href: "/buscar",
  },
  match: {
    eyebrow: "Encuentra tu match",
    title: "Cuéntanos tu evento y te decimos quién encaja",
    subtitle:
      "Cinco preguntas rápidas. Te proponemos los artistas que mejor van con lo que estás montando.",
    cta: "Encontrar mi músico ideal",
  },
  reviews: {
    eyebrow: "Lo que cuentan",
    title: "Eventos que salieron bien",
    subtitle: "Reseñas de clientes que contrataron a través de Sonora.",
  },
  /**
   * Cierre de la home: solo captación de artistas.
   *
   * El CTA de cliente sobraba: toda la página por encima ya es un embudo hacia
   * la búsqueda (hero, categorías, ocasiones, filas de artistas), así que
   * repetir "busca artistas" al final no añadía nada y competía con el único
   * mensaje que sí necesita su propio espacio aquí — el del otro lado del
   * marketplace, que no tiene ninguna otra entrada en la home.
   */
  /**
   * Beneficios: responde a la objeción implícita de "¿por qué a través de
   * vosotros y no llamando al artista directamente?". Es la sección que faltaba
   * entre "me gusta este artista" y "me atrevo a contratarlo aquí".
   */
  benefits: {
    eyebrow: "Por qué Sonora",
    title: "Contratar música no debería dar vértigo.",
    items: [
      {
        title: "Escúchalos antes de decidir",
        text: "Audio y vídeo reales en cada perfil. Sabes cómo suenan antes de escribir.",
      },
      {
        title: "Elige el que se adapte a tu presupuesto",
        text: "No más presupuestos a ciegas: cada artista publica su precio desde y sus paquetes.",
      },
      {
        title: "Artistas verificados",
        text: "Revisamos identidad y perfil. Las reseñas son de contrataciones reales.",
      },
      {
        title: "Tu pago, protegido",
        text: "Retenemos el importe y no se libera al artista hasta 24 h después del evento.",
      },
      {
        title: "Habla y reserva",
        text: "Consulta tu fecha, pide presupuesto y cierra los detalles desde la plataforma.",
      },
    ],
  },
  closing: {
    emoji: "🎤",
    eyebrow: "Para artistas",
    title: "Tu música merece más escenarios.",
    subtitle:
      "Crea tu perfil, marca tus fechas disponibles y recibe solicitudes de gente que ya está organizando su evento.",
    cta: "Crear mi perfil gratis",
    href: "/registro/musico",
    secondary: "Cómo funciona para artistas",
    secondaryHref: "/para-musicos",
  },
};

export const search = {
  wizard: {
    steps: {
      what: { question: "¿Qué música necesitas?", hint: "Elige el tipo de artista" },
      where: { question: "¿Dónde es tu evento?", hint: "Ciudad o zona" },
      when: { question: "¿Qué día?", hint: "Puedes dejarlo en blanco si aún no lo sabes" },
      budget: { question: "¿Qué presupuesto manejas?", hint: "Orientativo, para afinar resultados" },
    },
    submit: "Encontrar músicos",
    skip: "Saltar",
    back: "Atrás",
    next: "Siguiente",
  },
  results: {
    emptyTitle: "No hay artistas con esos filtros",
    emptyText:
      "Prueba a ampliar la zona, quitar algún filtro o mover la fecha. También podemos recomendarte según tu evento.",
    filtersTitle: "Filtros",
    sortLabel: "Ordenar por",
  },
};

export const profile = {
  requestCta: "Solicitar presupuesto",
  availabilityCta: "Consultar disponibilidad",
  favoriteAdd: "Guardar",
  favoriteRemove: "Guardado",
  priceNoteDefault:
    "El precio final depende de la duración, el desplazamiento, el número de músicos y el tipo de evento.",
  sections: {
    about: "Sobre el artista",
    media: "Escucha y mira",
    perfectFor: "Perfecto para",
    packages: "Paquetes",
    availability: "Disponibilidad",
    reviews: "Reseñas",
    repertoire: "Repertorio",
  },
  bookingIntro: (name: string) =>
    `Cuéntale a ${name} cómo es tu evento. Te responde directamente con disponibilidad y presupuesto.`,
};

export const musicians = {
  landing: {
    hero: {
      eyebrow: "Para artistas",
      title: "Más bolos.",
      titleAccent: "Menos tiempo buscando.",
      subtitle:
        "Sonora te pone delante de quien ya está organizando una boda, una fiesta o un evento de empresa. Tú tocas: nosotros te traemos las solicitudes.",
      cta: "Crear mi perfil gratis",
    },
    steps: [
      { title: "Crea tu perfil", text: "Nombre, fotos, bio y lo que sabes hacer. Diez minutos." },
      { title: "Sube tus vídeos y audio", text: "Que te escuchen antes de escribirte. Es lo que más convierte." },
      { title: "Pon tus precios", text: "Paquetes claros para que nadie pregunte solo por preguntar." },
      { title: "Marca tu disponibilidad", text: "Bloquea las fechas que ya tienes cerradas." },
      { title: "Recibe solicitudes", text: "Con fecha, lugar, presupuesto y detalles del evento." },
      { title: "Cierra el bolo", text: "Habla con el cliente desde la plataforma y confirma." },
    ],
  },
};

/** Etiquetas de las señales de confianza del marketplace. */
export const badges = {
  verified: "Artista verificado",
  verifiedShort: "Verificado",
  verifiedBooking: "Contratación verificada",
  respondsFast: "Responde rápido",
  premium: "Premium",
  featured: "Destacado",
  availableForDate: "Disponible para tu fecha",
  unavailableForDate: "Ocupado esa fecha",
};
