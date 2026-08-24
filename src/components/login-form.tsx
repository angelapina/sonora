"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions/auth";

const initialState: ActionState = { ok: false };

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />

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
      </div>
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
      </div>

      {state.message && <p className="text-sm text-coral-dark">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
