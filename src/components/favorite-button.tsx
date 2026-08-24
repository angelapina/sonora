"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  musicianId,
  slug,
  initialFavorited,
  isLoggedIn,
}: {
  musicianId: string;
  slug: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/musico/${slug}`);
      return;
    }
    startTransition(async () => {
      const res = await toggleFavorite(musicianId, slug);
      if (res.ok) setFavorited((f) => !f);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={favorited}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
        favorited
          ? "border-coral bg-coral text-white"
          : "border-line bg-paper text-ink-soft hover:border-coral hover:text-coral"
      )}
      title={favorited ? "Quitar de favoritos" : "Guardar en favoritos"}
    >
      <Heart size={18} className={favorited ? "fill-current" : ""} />
    </button>
  );
}
