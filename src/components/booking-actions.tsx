"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBookingStatus } from "@/lib/actions/musician";

export function BookingActions({ bookingId, status }: { bookingId: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function act(next: "accepted" | "declined" | "completed") {
    startTransition(async () => {
      await updateBookingStatus(bookingId, next);
      router.refresh();
    });
  }

  if (status !== "pending" && status !== "accepted") return null;

  return (
    <div className="flex gap-2">
      {status === "pending" && (
        <>
          <button
            onClick={() => act("accepted")}
            disabled={pending}
            className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark disabled:opacity-60"
          >
            Aceptar
          </button>
          <button
            onClick={() => act("declined")}
            disabled={pending}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft hover:border-ink/30"
          >
            Rechazar
          </button>
        </>
      )}
      {status === "accepted" && (
        <button
          onClick={() => act("completed")}
          disabled={pending}
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft hover:border-ink/30"
        >
          Marcar como completada
        </button>
      )}
    </div>
  );
}
