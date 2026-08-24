"use client";

import { useActionState } from "react";
import { registerClient, type ActionState } from "@/lib/actions/auth";

const initialState: ActionState = { ok: false };

export function RegisterClientForm() {
  const [state, formAction, pending] = useActionState(registerClient, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Nombre
        </label>
        <input
          name="name"
          required
          className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-coral"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.name[0]}</p>
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
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
