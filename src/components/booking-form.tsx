"use client";

import { useActionState } from "react";
import { createBookingRequest, type ActionState } from "@/lib/actions/booking";
import { CheckCircle2 } from "lucide-react";

const initialState: ActionState = { ok: false };

type EventTypeOption = { slug: string; label: string; icon?: string | null };

export function BookingForm({
  musicianId,
  eventTypes,
  defaultUser,
}: {
  musicianId: string;
  eventTypes: EventTypeOption[];
  defaultUser?: { name?: string | null; email?: string | null };
}) {
  const [state, formAction, pending] = useActionState(createBookingRequest, initialState);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper p-10 text-center">
        <CheckCircle2 size={36} className="text-coral" />
        <p className="font-display text-xl text-ink">¡Solicitud enviada!</p>
        <p className="max-w-sm text-sm text-ink-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <input type="hidden" name="musicianId" value={musicianId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Tu nombre
          </label>
          <input
            name="guestName"
            defaultValue={defaultUser?.name ?? ""}
            required
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
          {state.fieldErrors?.guestName && (
            <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.guestName[0]}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Email
          </label>
          <input
            type="email"
            name="guestEmail"
            defaultValue={defaultUser?.email ?? ""}
            required
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
          {state.fieldErrors?.guestEmail && (
            <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.guestEmail[0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Teléfono (opcional)
          </label>
          <input
            name="guestPhone"
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Fecha del evento
          </label>
          <input
            type="date"
            name="eventDate"
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Tipo de evento
          </label>
          <select
            name="eventType"
            required
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          >
            <option value="">Selecciona…</option>
            {eventTypes.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.icon} {e.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.eventType && (
            <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.eventType[0]}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Ciudad del evento
          </label>
          <input
            name="city"
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Presupuesto desde (€)
          </label>
          <input
            type="number"
            name="budgetMin"
            min={0}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Presupuesto hasta (€)
          </label>
          <input
            type="number"
            name="budgetMax"
            min={0}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Cuéntanos sobre tu evento
        </label>
        <textarea
          name="message"
          rows={4}
          required
          placeholder="Horario, número de invitados, estilo musical que buscas…"
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      {state.message && !state.ok && (
        <p className="text-sm text-coral-dark">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar solicitud de presupuesto"}
      </button>
    </form>
  );
}
