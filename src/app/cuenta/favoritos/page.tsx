import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MusicianCard } from "@/components/musician-card";
import { musicianCardSelect } from "@/lib/data/musicians";

export default async function FavoritesPage() {
  const session = await auth();
  const favorites = await prisma.favorite.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { musician: { select: musicianCardSelect } },
  });

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Favoritos</h2>
      <p className="mt-1 text-sm text-ink-muted">Los músicos que has guardado.</p>

      {favorites.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line p-10 text-center text-sm text-ink-muted">
          Todavía no has guardado ningún músico. Pulsa el corazón en cualquier perfil para
          añadirlo aquí.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((f) => (
            <MusicianCard key={f.id} musician={f.musician} />
          ))}
        </div>
      )}
    </div>
  );
}
