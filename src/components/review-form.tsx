"use client";

import { useActionState, useState } from "react";
import { submitReview, type ActionState } from "@/lib/actions/reviews";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState: ActionState = { ok: false };

export function ReviewForm({
  musicianId,
  defaultName,
}: {
  musicianId: string;
  defaultName?: string | null;
}) {
  const [state, formAction, pending] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState(5);

  if (state.ok) {
    return (
      <p className="rounded-2xl border border-line bg-paper p-6 text-sm text-ink-soft">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 rounded-2xl border border-line bg-paper p-6">
      <input type="hidden" name="musicianId" value={musicianId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Tu valoración
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} estrellas`}
            >
              <Star
                size={22}
                className={cn(n <= rating ? "fill-gold text-gold" : "text-line")}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Tu nombre
          </label>
          <input
            name="authorName"
            defaultValue={defaultName ?? ""}
            required
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Tipo de evento
          </label>
          <input
            name="eventType"
            placeholder="Boda, cumpleaños…"
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Cuéntanos tu experiencia
        </label>
        <textarea
          name="comment"
          rows={3}
          required
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="justify-self-start rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Publicar reseña"}
      </button>
    </form>
  );
}
