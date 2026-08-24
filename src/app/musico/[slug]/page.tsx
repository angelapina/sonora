import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin,
  Star,
  Camera,
  Play,
  Globe,
  Phone,
  Mail,
  CalendarX2,
  Music2,
} from "lucide-react";
import { getMusicianBySlug } from "@/lib/data/musicians";
import { getEventTypes } from "@/lib/data/taxonomy";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { VideoEmbed } from "@/components/video-embed";
import { AudioPlayer } from "@/components/audio-player";
import { PhotoGallery } from "@/components/photo-gallery";
import { ReviewsList } from "@/components/reviews-list";
import { ReviewForm } from "@/components/review-form";
import { BookingForm } from "@/components/booking-form";
import { FavoriteButton } from "@/components/favorite-button";
import { MobileBookingBar } from "@/components/mobile-booking-bar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const musician = await getMusicianBySlug(slug);
  if (!musician) return {};
  return {
    title: `${musician.stageName} — ${musician.city} | Sonora`,
    description: musician.tagline ?? musician.bio ?? undefined,
  };
}

export default async function MusicianProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const musician = await getMusicianBySlug(slug);
  if (!musician || musician.status !== "published") notFound();

  const [session, eventTypes] = await Promise.all([auth(), getEventTypes()]);

  let isFavorited = false;
  if (session?.user?.role === "CLIENT") {
    const fav = await prisma.favorite.findUnique({
      where: { userId_musicianId: { userId: session.user.id, musicianId: musician.id } },
    });
    isFavorited = !!fav;
  }

  const videos = musician.media.filter((m) => m.type === "video");
  const photos = musician.media.filter((m) => m.type === "photo");
  const audios = musician.media.filter((m) => m.type === "audio");
  const upcomingBlocked = musician.availability.filter((a) => !a.available).slice(0, 6);

  return (
    <div className="pb-24 lg:pb-0">
      {/* Hero */}
      <section className="relative h-[46vh] min-h-[340px] w-full overflow-hidden bg-ink sm:h-[62vh] sm:min-h-[420px]">
        {musician.coverUrl && (
          <Image
            src={musician.coverUrl}
            alt={musician.stageName}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-6 text-cream sm:gap-5 sm:px-6 sm:pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-3 sm:gap-4">
              {musician.avatarUrl && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-cream/90 shadow-xl sm:h-28 sm:w-28 sm:rounded-2xl sm:border-4">
                  <Image
                    src={musician.avatarUrl}
                    alt={musician.stageName}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {musician.featured && <Badge tone="coral">Recomendado</Badge>}
                  {musician.plan === "premium" && <Badge tone="gold">Premium</Badge>}
                </div>
                <h1 className="mt-1.5 font-display text-2xl leading-tight sm:mt-2 sm:text-5xl">
                  {musician.stageName}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-cream/80 sm:mt-2 sm:gap-x-4 sm:text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {musician.city}
                  </span>
                  {musician.ratingCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Star size={13} className="fill-gold text-gold" />
                      {musician.ratingAvg.toFixed(1)} ({musician.ratingCount})
                    </span>
                  )}
                  <span className="hidden sm:inline">
                    {musician.artistTypes.map((t) => t.label).join(" · ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <FavoriteButton
                musicianId={musician.id}
                slug={musician.slug}
                initialFavorited={isFavorited}
                isLoggedIn={!!session?.user}
              />
              <ButtonLink href="#solicitar" size="lg">
                Solicitar presupuesto
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-4 sm:hidden">
          <FavoriteButton
            musicianId={musician.id}
            slug={musician.slug}
            initialFavorited={isFavorited}
            isLoggedIn={!!session?.user}
          />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1fr_320px]">
        {/* Contenido principal */}
        <div className="space-y-14">
          {musician.bio && (
            <section>
              <h2 className="font-display text-2xl text-ink">Sobre {musician.stageName}</h2>
              <p className="mt-4 max-w-2xl whitespace-pre-line leading-relaxed text-ink-soft">
                {musician.bio}
              </p>
            </section>
          )}

          <section className="flex flex-wrap gap-2">
            {musician.genres.map((g) => (
              <Badge key={g.id}>{g.label}</Badge>
            ))}
            {musician.instruments.map((i) => (
              <Badge key={i.id} tone="dark">
                {i.label}
              </Badge>
            ))}
          </section>

          {videos.length > 0 && (
            <section>
              <h2 className="font-display text-2xl text-ink">Vídeos</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {videos.map((v) => (
                  <VideoEmbed key={v.id} videoId={v.url} title={v.title ?? musician.stageName} />
                ))}
              </div>
            </section>
          )}

          {photos.length > 0 && (
            <section>
              <h2 className="font-display text-2xl text-ink">Galería</h2>
              <div className="mt-5">
                <PhotoGallery photos={photos} alt={musician.stageName} />
              </div>
            </section>
          )}

          {audios.length > 0 && (
            <section>
              <h2 className="font-display text-2xl text-ink">Escucha una muestra</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {audios.map((a) => (
                  <AudioPlayer key={a.id} src={a.url} title={a.title} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-display text-2xl text-ink">Eventos que realiza</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {musician.eventTypes.map((e) => (
                <Badge key={e.id}>
                  {e.icon} {e.label}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">Disponibilidad</h2>
            {upcomingBlocked.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {upcomingBlocked.map((a) => (
                  <span
                    key={a.id}
                    className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted"
                  >
                    <CalendarX2 size={13} /> {formatDate(a.date)}
                  </span>
                ))}
                <p className="w-full text-sm text-ink-muted">
                  Fechas ya reservadas. Consulta tu fecha exacta con el formulario de
                  presupuesto.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink-muted">
                Sin bloqueos conocidos por ahora — consulta tu fecha con el artista.
              </p>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-ink">Reseñas</h2>
              {musician.ratingCount > 0 && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <Star size={16} className="fill-gold text-gold" />
                  {musician.ratingAvg.toFixed(1)} · {musician.ratingCount} reseñas
                </span>
              )}
            </div>
            <div className="mt-5">
              <ReviewsList reviews={musician.reviews} />
            </div>
            <div className="mt-6">
              <ReviewForm musicianId={musician.id} defaultName={session?.user?.name} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-line bg-paper p-6 shadow-[0_24px_48px_-32px_rgba(21,18,15,0.3)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Precio orientativo
            </p>
            <p className="mt-1 font-display text-3xl text-ink">
              {musician.priceFrom ? `Desde ${formatPrice(musician.priceFrom)}` : "Consultar"}
            </p>
            {musician.priceNote && (
              <p className="mt-1 text-sm text-ink-muted">{musician.priceNote}</p>
            )}

            <ButtonLink href="#solicitar" className="mt-5 w-full">
              Solicitar presupuesto
            </ButtonLink>

            <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              {musician.yearsExperience && (
                <p className="text-ink-soft">
                  <span className="font-semibold text-ink">{musician.yearsExperience}</span>{" "}
                  años de experiencia
                </p>
              )}
              {musician.phone && (
                <a
                  href={`tel:${musician.phone}`}
                  className="flex items-center gap-2 text-ink-soft hover:text-coral"
                >
                  <Phone size={14} /> {musician.phone}
                </a>
              )}
              {musician.contactEmail && (
                <a
                  href={`mailto:${musician.contactEmail}`}
                  className="flex items-center gap-2 text-ink-soft hover:text-coral"
                >
                  <Mail size={14} /> {musician.contactEmail}
                </a>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
              {musician.website && (
                <a href={musician.website} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-coral">
                  <Globe size={18} />
                </a>
              )}
              {musician.instagram && (
                <a href={musician.instagram} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-coral">
                  <Camera size={18} />
                </a>
              )}
              {musician.youtube && (
                <a href={musician.youtube} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-coral">
                  <Play size={18} />
                </a>
              )}
              {musician.spotify && (
                <a href={musician.spotify} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-coral">
                  <Music2 size={18} />
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Formulario de solicitud */}
      <section id="solicitar" className="bg-cream-soft py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
            Contrata a {musician.stageName}
          </p>
          <h2 className="mt-2 font-display text-3xl text-ink">Solicita tu presupuesto</h2>
          <p className="mt-2 text-ink-muted">
            Cuéntanos los detalles de tu evento y {musician.stageName} te responderá
            directamente con disponibilidad y presupuesto.
          </p>
          <div className="mt-8">
            <BookingForm
              musicianId={musician.id}
              eventTypes={eventTypes}
              defaultUser={session?.user}
            />
          </div>
        </div>
      </section>

      <MobileBookingBar stageName={musician.stageName} priceFrom={musician.priceFrom} />
    </div>
  );
}
