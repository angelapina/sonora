import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { getArtistTypes, getGenres, getEventTypes, getInstruments } from "@/lib/data/taxonomy";

export default async function DashboardProfilePage() {
  const session = await auth();
  const [profile, artistTypes, genres, eventTypes, instruments] = await Promise.all([
    prisma.musicianProfile.findUnique({
      where: { userId: session!.user.id },
      include: { artistTypes: true, genres: true, eventTypes: true, instruments: true },
    }),
    getArtistTypes(),
    getGenres(),
    getEventTypes(),
    getInstruments(),
  ]);
  if (!profile) return null;

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Editar perfil</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Esta información aparece en tu perfil público.
      </p>
      <div className="mt-6 max-w-3xl">
        <ProfileEditForm
          profile={profile}
          artistTypes={artistTypes}
          genres={genres}
          eventTypes={eventTypes}
          instruments={instruments}
          selected={{
            artistTypes: profile.artistTypes.map((t) => t.slug),
            genres: profile.genres.map((g) => g.slug),
            eventTypes: profile.eventTypes.map((e) => e.slug),
            instruments: profile.instruments.map((i) => i.slug),
          }}
        />
      </div>
    </div>
  );
}
