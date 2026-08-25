/**
 * Modelo de facturación de Sonora (comisión partida, estilo Airbnb).
 *
 * ── Cómo cobra Airbnb y por qué lo copiamos ──
 * Airbnb no cobra una comisión única al anfitrión: la parte en dos.
 *   · Al huésped le suma un "service fee" visible sobre el precio (~14%).
 *   · Al anfitrión le descuenta un porcentaje pequeño del cobro (~3%).
 * El resultado es que la plataforma se lleva ~15-17% del total, pero al
 * anfitrión le "duele" solo un 3%, que es lo que ve en su liquidación. Eso
 * mantiene contentos a los dos lados del marketplace: el artista percibe una
 * comisión baja, y el margen real de la plataforma sigue siendo sano.
 *
 * ── Cómo lo aplicamos aquí ──
 *   Precio del artista            600,00 €   ← lo que el artista pone
 *   + Gastos de gestión (12%)      72,00 €   ← lo paga el cliente, visible
 *   ─────────────────────────────────────
 *   Total que paga el cliente     672,00 €
 *
 *   Precio del artista            600,00 €
 *   − Comisión Sonora (4%)        −24,00 €   ← se descuenta al artista
 *   ─────────────────────────────────────
 *   El artista recibe             576,00 €
 *
 *   Ingreso de Sonora              96,00 €   (16% del precio del artista)
 *
 * ── Custodia del dinero ──
 * Igual que Airbnb retiene el pago hasta 24h después del check-in, aquí el
 * cobro se retiene hasta 24h después del evento. Es lo que hace que el cliente
 * se atreva a pagar por adelantado a alguien que no conoce, y lo que da a
 * Sonora capacidad de mediar si algo sale mal. Sin esa retención, el
 * marketplace no aporta nada frente a pagar al artista por Bizum.
 *
 * IMPORTANTE: aquí solo vive el CÁLCULO y los estados. El cobro real (Stripe
 * Connect o similar) todavía no está conectado; ver `PAYMENT_STATUSES`.
 */

/** Gastos de gestión que se suman al precio y paga el cliente. */
export const CLIENT_FEE_RATE = 0.12;

/** Comisión que se descuenta de la liquidación del artista. */
export const ARTIST_COMMISSION_RATE = 0.04;

/** Horas tras el evento antes de liberar el pago al artista. */
export const PAYOUT_HOLD_HOURS = 24;

/** Porcentaje del total que se cobra como señal para bloquear la fecha. */
export const DEPOSIT_RATE = 0.3;

export type PriceBreakdown = {
  /** Lo que el artista cobra por la actuación, sin comisiones. */
  basePrice: number;
  /** Gastos de gestión que paga el cliente. */
  clientFee: number;
  /** Total que abona el cliente. */
  clientTotal: number;
  /** Señal para bloquear la fecha. */
  deposit: number;
  /** Resto a pagar antes del evento. */
  remainder: number;
  /** Comisión descontada al artista. */
  artistCommission: number;
  /** Liquidación neta del artista. */
  artistPayout: number;
  /** Margen bruto de Sonora. */
  platformRevenue: number;
};

/** Redondeo a céntimos, evitando los clásicos 0.1 + 0.2 = 0.30000000000000004. */
function money(n: number) {
  return Math.round(n * 100) / 100;
}

export function calculateBreakdown(basePrice: number): PriceBreakdown {
  const clientFee = money(basePrice * CLIENT_FEE_RATE);
  const clientTotal = money(basePrice + clientFee);
  const artistCommission = money(basePrice * ARTIST_COMMISSION_RATE);
  const artistPayout = money(basePrice - artistCommission);
  const deposit = money(clientTotal * DEPOSIT_RATE);

  return {
    basePrice: money(basePrice),
    clientFee,
    clientTotal,
    deposit,
    remainder: money(clientTotal - deposit),
    artistCommission,
    artistPayout,
    platformRevenue: money(clientFee + artistCommission),
  };
}

/**
 * Estados del pago de una reserva. El flujo replica el de Airbnb:
 * el dinero entra pronto (para comprometer al cliente) pero solo sale hacia el
 * artista cuando el servicio ya se ha prestado.
 */
export const PAYMENT_STATUSES = {
  none: "Sin pago iniciado",
  deposit_pending: "Señal pendiente de pago",
  deposit_paid: "Señal pagada · fecha bloqueada",
  paid_in_full: "Pagado íntegro · en custodia",
  released: "Liquidado al artista",
  refunded: "Reembolsado",
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUSES;

/**
 * Políticas de cancelación. Como en Airbnb, el artista elige una y el cliente
 * la ve antes de pagar: es parte de la decisión de compra, no letra pequeña.
 * Los porcentajes son sobre el total pagado por el cliente.
 */
export const CANCELLATION_POLICIES = {
  flexible: {
    label: "Flexible",
    summary: "Reembolso del 100 % si cancelas con más de 30 días.",
    tiers: [
      { daysBefore: 30, refundRate: 1 },
      { daysBefore: 7, refundRate: 0.5 },
      { daysBefore: 0, refundRate: 0 },
    ],
  },
  moderada: {
    label: "Moderada",
    summary: "Reembolso del 100 % con más de 60 días; 50 % hasta 30 días antes.",
    tiers: [
      { daysBefore: 60, refundRate: 1 },
      { daysBefore: 30, refundRate: 0.5 },
      { daysBefore: 0, refundRate: 0 },
    ],
  },
  estricta: {
    label: "Estricta",
    summary: "La señal no se reembolsa. Recomendada en fechas de temporada alta.",
    tiers: [
      { daysBefore: 90, refundRate: 0.7 },
      { daysBefore: 30, refundRate: 0.3 },
      { daysBefore: 0, refundRate: 0 },
    ],
  },
} as const;

export type CancellationPolicy = keyof typeof CANCELLATION_POLICIES;

/** Cuánto se devolvería si se cancelase hoy. */
export function refundFor(
  policy: CancellationPolicy,
  clientTotal: number,
  daysUntilEvent: number
) {
  const tiers = CANCELLATION_POLICIES[policy].tiers;
  const tier = tiers.find((t) => daysUntilEvent >= t.daysBefore) ?? tiers[tiers.length - 1];
  return money(clientTotal * tier.refundRate);
}
