import { Info, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  calculateBreakdown,
  CANCELLATION_POLICIES,
  PAYOUT_HOLD_HOURS,
  type CancellationPolicy,
} from "@/lib/pricing";

/**
 * Desglose de precio para el CLIENTE.
 *
 * Airbnb enseña el desglose completo antes de pagar y ese es medio truco de su
 * confianza: nadie descubre un cargo nuevo en el último paso. Aquí igual —
 * precio del artista, gastos de gestión y total, sin letra pequeña.
 */
export function ClientPriceBreakdown({
  basePrice,
  policy = "moderada",
}: {
  basePrice: number;
  policy?: CancellationPolicy;
}) {
  const b = calculateBreakdown(basePrice);

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <dl className="space-y-2.5 text-[14px]">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-soft">Precio del artista</dt>
          <dd className="font-medium text-ink">{formatPrice(b.basePrice)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="flex items-center gap-1.5 text-ink-soft">
            Gastos de gestión
            <span
              title="Cubre el pago seguro, la mediación si hay incidencias y el soporte de Sonora."
              className="text-ink-muted"
            >
              <Info size={13} />
            </span>
          </dt>
          <dd className="font-medium text-ink">{formatPrice(b.clientFee)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
          <dt className="font-semibold text-ink">Total</dt>
          <dd className="font-display text-[19px] font-semibold text-ink">
            {formatPrice(b.clientTotal)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 space-y-2 border-t border-line pt-4 text-[13px] text-ink-muted">
        <p>
          <span className="font-medium text-ink">{formatPrice(b.deposit)}</span> ahora
          para bloquear la fecha ·{" "}
          <span className="font-medium text-ink">{formatPrice(b.remainder)}</span> antes
          del evento.
        </p>
        <p className="flex items-start gap-1.5">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-coral" />
          Sonora retiene el pago y no lo libera al artista hasta {PAYOUT_HOLD_HOURS} h
          después del evento.
        </p>
        <p>
          <span className="font-medium text-ink">
            Cancelación {CANCELLATION_POLICIES[policy].label.toLowerCase()}:
          </span>{" "}
          {CANCELLATION_POLICIES[policy].summary}
        </p>
      </div>
    </div>
  );
}

/**
 * Desglose para el ARTISTA. Lo que le importa no es el total que paga el
 * cliente, sino cuánto le llega a él y cuándo.
 */
export function ArtistPayoutBreakdown({ basePrice }: { basePrice: number }) {
  const b = calculateBreakdown(basePrice);

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <dl className="space-y-2.5 text-[14px]">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-soft">Tu caché</dt>
          <dd className="font-medium text-ink">{formatPrice(b.basePrice)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-soft">Comisión Sonora (4 %)</dt>
          <dd className="font-medium text-ink-muted">−{formatPrice(b.artistCommission)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
          <dt className="font-semibold text-ink">Recibes</dt>
          <dd className="font-display text-[19px] font-semibold text-ink">
            {formatPrice(b.artistPayout)}
          </dd>
        </div>
      </dl>
      <p className="mt-4 border-t border-line pt-4 text-[13px] text-ink-muted">
        El cliente paga {formatPrice(b.clientTotal)} (gestión incluida). Tu liquidación
        se libera {PAYOUT_HOLD_HOURS} h después del evento.
      </p>
    </div>
  );
}
