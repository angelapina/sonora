"use client";

import { useActionState } from "react";
import { registerMusician, type ActionState } from "@/lib/actions/auth";
import { CITIES } from "@/lib/taxonomy-data";

const initialState: ActionState = { ok: false };

export function RegisterMusicianForm() {
  const [state, formAction, pending] = useActionState(registerMusician, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Nombre artístico
        </label>
        <input
          name="stageName"
          required
          placeholder="Ej. Marta Vidal, Trío Azul…"
          className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-coral"
        />
        {state.fieldErrors?.stageName && (
          <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.stageName[0]}</p>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Ciudad principal
        </label>
        <select
          name="city"
          required
          defaultValue=""
          className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-coral"
        >
          <option value="" disabled>
            Selecciona tu ciudad…
          </option>
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {state.fieldErrors?.city && (
          <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.city[0]}</p>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-coral"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.email[0]}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-coral"
          />
          {state.fieldErrors?.password && (
            <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.password[0]}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Repite la contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-coral"
          />
          {state.fieldErrors?.confirmPassword && (
            <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.confirmPassword[0]}</p>
          )}
        </div>
      </div>

      {state.message && <p className="text-sm text-coral-dark">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
      >
        {pending ? "Creando perfil…" : "Crear mi perfil de músico"}
      </button>
    </form>
  );
}
