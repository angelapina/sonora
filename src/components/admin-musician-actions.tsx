"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminToggleFeatured, adminToggleStatus } from "@/lib/actions/admin";

export function AdminMusicianActions({
  musicianId,
  featured,
  status,
}: {
  musicianId: string;
  featured: boolean;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function run(action: () => Promise<unknown>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={pending}
        onClick={() => run(() => adminToggleStatus(musicianId))}
        className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink/30 disabled:opacity-60"
      >
        {status === "published" ? "Pasar a borrador" : "Publicar"}
      </button>
      <button
        disabled={pending}
        onClick={() => run(() => adminToggleFeatured(musicianId))}
        className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink/30 disabled:opacity-60"
      >
        {featured ? "Quitar destacado" : "Destacar"}
      </button>
    </div>
  );
}
