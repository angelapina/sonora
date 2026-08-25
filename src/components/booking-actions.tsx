"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBookingStatus } from "@/lib/actions/musician";
import { calculateBreakdown } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

export function BookingActions({
  bookingId,
  status,
  suggestedPrice,
}: {
  bookingId: string;
  status: string;
  /** Presupuesto que indicó el cliente, como punto de partida. */
  suggestedPrice?: number | null;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [price, setPrice] = useState(suggestedPrice ? String(suggestedPrice) : "");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const parsed = Number(price);
  const valid = Number.isFinite(parsed) && parsed > 0;
  const preview = valid ? calculateBreakdown(parsed) : null;

  function act(next: "accepted" | "declined" | "completed", agreedPrice?: number) {
    setError(null);
    startTransition(async () => {
      const res = await updateBookingStatus(bookingId, next, agreedPrice);
      if (!res.ok) {
        setError(res.message ?? "No se ha podido actualizar la solicitud.");
        return;
      }
      setConfirming(false);
      router.refresh();
    });
  }

  if (status !== "pending" && status !== "accepted") return null;

  // Aceptar exige fijar el caché: es el momento en que se congelan los
  // importes de la reserva, así que no puede quedar en blanco.
  if (status === "pending" && confirming) {
    return (
      <div className="rounded-2xl border border-line bg-white p-5">
        <p className="text-[15px] font-semibold text-ink">Confirma el caché acordado</p>
        <p className="mt-1 text-[13px] text-ink-muted">
          Es el precio de tu actuación. Sobre él se calculan la comisión y lo que paga
          el cliente.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="600"
            className="w-32 rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
          <span className="text-sm text-ink-muted">€</span>
        </div>

        {preview && (
          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Comisión Sonora (4 %)</dt>
              <dd className="text-ink-muted">−{formatPrice(preview.artistCommission)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-ink">Recibes</dt>
              <dd className="font-semibold text-ink">{formatPrice(preview.artistPayout)}</dd>
            </div>
            <div className="flex justify-between pt-1">
              <dt className="text-ink-muted">El cliente paga</dt>
              <dd className="text-ink-muted">{formatPrice(preview.clientTotal)}</dd>
            </div>
          </dl>
        )}

        {error && <p className="mt-3 text-[13px] text-coral-dark">{error}</p>}

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => act("accepted", parsed)}
            disabled={pending || !valid}
            className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-50"
          >
            {pending ? "Confirmando…" : "Confirmar y aceptar"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={pending}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/30"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {status === "pending" && (
          <>
            <button
              onClick={() => setConfirming(true)}
              disabled={pending}
              className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
            >
              Aceptar
            </button>
            <button
              onClick={() => act("declined")}
              disabled={pending}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/30"
            >
              Rechazar
            </button>
          </>
        )}
        {status === "accepted" && (
          <button
            onClick={() => act("completed")}
            disabled={pending}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/30"
          >
            Marcar como completada
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-[13px] text-coral-dark">{error}</p>}
    </div>
  );
}
