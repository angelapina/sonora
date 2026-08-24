"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminApproveReview, adminRejectReview } from "@/lib/actions/admin";

export function AdminReviewActions({ reviewId }: { reviewId: string }) {
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
        onClick={() => run(() => adminApproveReview(reviewId))}
        className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream hover:bg-ink-soft disabled:opacity-60"
      >
        Aprobar
      </button>
      <button
        disabled={pending}
        onClick={() => run(() => adminRejectReview(reviewId))}
        className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink-soft hover:border-coral hover:text-coral disabled:opacity-60"
      >
        Rechazar
      </button>
    </div>
  );
}
