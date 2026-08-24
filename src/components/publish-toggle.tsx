"use client";

import { useState, useTransition } from "react";
import { togglePublish } from "@/lib/actions/musician";

export function PublishToggle({ status }: { status: string }) {
  const [current, setCurrent] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const res = await togglePublish();
          if (res.ok) setCurrent(res.status);
        })
      }
      disabled={pending}
      className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft disabled:opacity-60"
    >
      {pending ? "Guardando…" : current === "published" ? "Pasar a borrador" : "Publicar perfil"}
    </button>
  );
}
