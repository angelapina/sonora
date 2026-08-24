import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MediaManager } from "@/components/media-manager";

export default async function DashboardMediaPage() {
  const session = await auth();
  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session!.user.id },
    include: { media: { orderBy: { order: "asc" } } },
  });
  if (!profile) return null;

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Multimedia</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Sube fotos y audio, y añade tus vídeos de YouTube favoritos.
      </p>
      <div className="mt-6">
        <MediaManager initialMedia={profile.media} />
      </div>
    </div>
  );
}
