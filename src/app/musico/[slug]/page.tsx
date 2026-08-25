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
  Music2,
  BadgeCheck,
  Zap,
  Users,
  Clock,
  Speaker,
  Languages,
  Route,
} from "lucide-react";
import { getMusicianBySlug } from "@/lib/data/musicians";
import { citySlug } from "@/lib/seo-landings";
import { getEventTypes } from "@/lib/data/taxonomy";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { profile as copy, badges } from "@/lib/copy";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { VideoEmbed } from "@/components/video-embed";
import { AudioTrack } from "@/components/audio-preview";
import { PhotoGallery } from "@/components/photo-gallery";
import { ReviewsList, ReviewsSummary } from "@/components/reviews-list";
import { ReviewForm } from "@/components/review-form";
import { BookingForm } from "@/components/booking-form";
import { FavoriteButton } from "@/components/favorite-button";
import { MobileBookingBar } from "@/components/mobile-booking-bar";
import { PricingPackages } from "@/components/pricing-packages";
import { AvailabilityViewer } from "@/components/availability-viewer";
import { ClientPriceBreakdown } from "@/components/price-breakdown";
import type { CancellationPolicy } from "@/lib/pricing";
import { JsonLd } from "@/components/json-ld";
import { musicianJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMusicianBySlug(slug);
  if (!m) return {};

  const type = m.artistTypes[0]?.label ?? "Artista";
  const title = `${m.stageName} — ${type} en ${m.city}`;
  const description =
    m.tagline ??
    `Contrata a ${m.stageName}, ${type.toLowerCase()} en ${m.city}. Vídeos, audio, precios y disponibilidad en Sonora.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: m.coverUrl ? [m.coverUrl] : undefined,
      type: "profile",
    },
  };
}

const LANGUAGE_LABELS: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  fr: "Francés",
  it: "Italiano",
  ca: "Catalán",
  eu: "Euskera",
  gl: "Gallego",
  pt: "Portugués",
};

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
  const blockedDates = musician.availability
    .filter((a) => !a.available)
    .map((a) => a.date.toISOString().slice(0, 10));

  const languages = musician.languages
    ?.split(",")
    .map((l) => LANGUAGE_LABELS[l.trim()] ?? l.trim())
    .filter(Boolean);

  // Datos duros que el cliente pregunta antes de escribir.
  const facts = [
    musician.membersCount && {
      icon: Users,
      label: `${musician.membersCount} ${musician.membersCount === 1 ? "músico" : "músicos"}`,
    },
    musician.minDurationMin && {
      icon: Clock,
      label: `Desde ${Math.round(musician.minDurationMin / 60)} h de actuación`,
    },
    musician.equipmentIncluded && { icon: Speaker, label: "Equipo de sonido incluido" },
    musician.travelRadiusKm && { icon: Route, label: `Se desplaza hasta ${musician.travelRadiusKm} km` },
    languages?.length && { icon: Languages, label: languages.join(", ") },
  ].filter(Boolean) as { icon: typeof Users; label: string }[];

  const jsonLd = [
    musicianJsonLd(musician),
    breadcrumbJsonLd([
      { name: "Sonora", path: "/" },
      { name: musician.city, path: `/musicos/${citySlug(musician.city)}` },
      { name: musician.stageName, path: `/musico/${musician.slug}` },
    ]),
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <JsonLd data={jsonLd} />

      {/* ---------- HERO ---------- */}
      <section className="relative h-[46vh] min-h-[340px] w-full overflow-hidden bg-ink sm:h-[58vh] sm:min-h-[440px]">
        {musician.coverUrl && (
          <Image
            src={musician.coverUrl}
            alt={musician.stageName}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-6 text-white sm:gap-5 sm:px-6 sm:pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-3 sm:gap-5">
              {musician.avatarUrl && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-white/90 shadow-xl sm:h-28 sm:w-28 sm:rounded-2xl sm:border-4">
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
                  {musician.verified && (
                    <Badge tone="dark">
                      <BadgeCheck size={12} /> {badges.verified}
                    </Badge>
                  )}
                  {musician.featured && <Badge tone="coral">{badges.featured}</Badge>}
                  {musician.plan === "premium" && <Badge tone="gold">{badges.premium}</Badge>}
                  {musician.respondsFast && (
                    <Badge tone="dark">
                      <Zap size={11} className="fill-gold text-gold" /> {badges.respondsFast}
                    </Badge>
                  )}
                </div>
                <h1 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-[44px]">
                  {musician.stageName}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-white/75 sm:mt-2 sm:gap-x-4 sm:text-[15px]">
                  <span>{musician.artistTypes.map((t) => t.label).join(" · ")}</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {musician.city}
                  </span>
                  {musician.ratingCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Star size={13} strokeWidth={0} className="fill-gold text-gold" />
                      <strong className="font-medium text-white">
                        {musician.ratingAvg.toFixed(1)}
                      </strong>
                      ({musician.ratingCount} reseñas)
                    </span>
                  )}
                  {musician.gigsCount > 0 && (
                    <span className="hidden sm:inline">{musician.gigsCount} actuaciones</span>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <FavoriteButton
                musicianId={musician.id}
                slug={musician.slug}
                initialFavorited={isFavorited}
                isLoggedIn={!!session?.user}
              />
              <ButtonLink href="#solicitar" size="lg">
                {copy.requestCta}
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-4 lg:hidden">
          <FavoriteButton
            musicianId={musician.id}
            slug={musician.slug}
            initialFavorited={isFavorited}
            isLoggedIn={!!session?.user}
          />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[1fr_340px] lg:py-16">
        {/* ---------- CONTENIDO ---------- */}
        <div className="min-w-0 space-y-14">
          {/* Datos rápidos */}
          {facts.length > 0 && (
            <section className="flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-8">
              {facts.map((f) => (
                <span key={f.label} className="flex items-center gap-2 text-[14px] text-ink-soft">
                  <f.icon size={15} className="text-ink-muted" />
                  {f.label}
                </span>
              ))}
            </section>
          )}

          {musician.bio && (
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {copy.sections.about}
              </h2>
              <p className="mt-4 max-w-2xl whitespace-pre-line text-[16px] leading-relaxed text-ink-soft">
                {musician.bio}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {musician.genres.map((g) => (
                  <Badge key={g.id}>{g.label}</Badge>
                ))}
                {musician.instruments.map((i) => (
                  <Badge key={i.id} tone="default">
                    {i.label}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Audio */}
          {audios.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {copy.sections.media}
              </h2>
              <p className="mt-1 text-[15px] text-ink-muted">
                Escucha antes de decidir. Así suena en directo.
              </p>
              <div className="mt-5 space-y-3">
                {audios.map((a, i) => (
                  <AudioTrack key={a.id} src={a.url} title={a.title} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Vídeos */}
          {videos.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Vídeos
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {videos.map((v) => (
                  <VideoEmbed key={v.id} videoId={v.url} title={v.title ?? musician.stageName} />
                ))}
              </div>
            </section>
          )}

          {/* Repertorio */}
          {(musician.repertoire || musician.influences) && (
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {copy.sections.repertoire}
              </h2>
              {musician.repertoire && (
                <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
                  {musician.repertoire}
                </p>
              )}
              {musician.influences && (
                <p className="mt-3 text-[14px] text-ink-muted">
                  <span className="font-medium text-ink">Influencias:</span>{" "}
                  {musician.influences}
                </p>
              )}
            </section>
          )}

          {/* Perfecto para */}
          {musician.eventTypes.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {copy.sections.perfectFor}
              </h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {musician.eventTypes.map((e) => (
                  <span
                    key={e.id}
                    className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-[14px] text-ink"
                  >
                    <span className="text-base leading-none">{e.icon}</span>
                    {e.label}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Paquetes */}
          {musician.packages.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {copy.sections.packages}
              </h2>
              <p className="mt-1 text-[15px] text-ink-muted">
                Precios orientativos configurados por el artista.
              </p>
              <div className="mt-6">
                <PricingPackages
                  packages={musician.packages}
                  priceNote={musician.priceNote ?? copy.priceNoteDefault}
                />
              </div>
            </section>
          )}

          {/* Galería */}
          {photos.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Galería
              </h2>
              <div className="mt-5">
                <PhotoGallery photos={photos} alt={musician.stageName} />
              </div>
            </section>
          )}

          {/* Disponibilidad */}
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              {copy.sections.availability}
            </h2>
            <p className="mt-1 text-[15px] text-ink-muted">
              Comprueba si tiene libre tu fecha antes de escribirle.
            </p>
            <div className="mt-6 max-w-md rounded-2xl border border-line bg-white p-5">
              <AvailabilityViewer
                blockedDates={blockedDates}
                stageName={musician.stageName}
              />
            </div>
          </section>

          {/* Reseñas */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {copy.sections.reviews}
              </h2>
              {musician.ratingCount > 0 && (
                <span className="flex items-center gap-1.5 text-[15px]">
                  <Star size={15} strokeWidth={0} className="fill-gold text-gold" />
                  <strong className="font-semibold text-ink">
                    {musician.ratingAvg.toFixed(1)}
                  </strong>
                  <span className="text-ink-muted">· {musician.ratingCount} reseñas</span>
                </span>
              )}
            </div>

            <div className="mt-6 space-y-6">
              <ReviewsSummary reviews={musician.reviews} />
              <ReviewsList reviews={musician.reviews} />
            </div>

            <div className="mt-8">
              <ReviewForm musicianId={musician.id} defaultName={session?.user?.name} />
            </div>
          </section>
        </div>

        {/* ---------- SIDEBAR ---------- */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_16px_48px_-32px_rgba(0,0,0,0.28)]">
            <p className="text-[13px] text-ink-muted">Precio orientativo</p>
            <p className="mt-1 font-display text-[32px] font-semibold tracking-tight text-ink">
              {musician.priceFrom ? (
                <>
                  Desde {formatPrice(musician.priceFrom)}
                </>
              ) : (
                "Consultar"
              )}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
              {musician.priceNote ?? copy.priceNoteDefault}
            </p>

            <ButtonLink href="#solicitar" className="mt-5 w-full">
              {copy.requestCta}
            </ButtonLink>

            {musician.priceFrom && (
              <details className="group mt-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-medium text-ink-muted transition-colors hover:text-ink">
                  Ver desglose del precio
                  <span className="transition-transform duration-300 group-open:rotate-180">⌄</span>
                </summary>
                <div className="mt-3">
                  <ClientPriceBreakdown
                    basePrice={musician.priceFrom}
                    policy={musician.cancellationPolicy as CancellationPolicy}
                  />
                </div>
              </details>
            )}

            {(musician.gigsCount > 0 || musician.yearsExperience) && (
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
                {musician.yearsExperience && (
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">
                      {musician.yearsExperience}
                    </p>
                    <p className="text-[13px] text-ink-muted">años de experiencia</p>
                  </div>
                )}
                {musician.gigsCount > 0 && (
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">
                      {musician.gigsCount}
                    </p>
                    <p className="text-[13px] text-ink-muted">actuaciones</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 space-y-2 border-t border-line pt-5 text-[14px]">
              {musician.phone && (
                <a
                  href={`tel:${musician.phone}`}
                  className="flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
                >
                  <Phone size={14} /> {musician.phone}
                </a>
              )}
              {musician.contactEmail && (
                <a
                  href={`mailto:${musician.contactEmail}`}
                  className="flex items-center gap-2 truncate text-ink-soft transition-colors hover:text-ink"
                >
                  <Mail size={14} /> {musician.contactEmail}
                </a>
              )}
            </div>

            <div className="mt-5 flex items-center gap-4 border-t border-line pt-5">
              {musician.website && (
                <a href={musician.website} target="_blank" rel="noopener noreferrer" aria-label="Web" className="text-ink-muted transition-colors hover:text-ink">
                  <Globe size={17} />
                </a>
              )}
              {musician.instagram && (
                <a href={musician.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ink-muted transition-colors hover:text-ink">
                  <Camera size={17} />
                </a>
              )}
              {musician.youtube && (
                <a href={musician.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-ink-muted transition-colors hover:text-ink">
                  <Play size={17} />
                </a>
              )}
              {musician.spotify && (
                <a href={musician.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify" className="text-ink-muted transition-colors hover:text-ink">
                  <Music2 size={17} />
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ---------- SOLICITUD ---------- */}
      <section id="solicitar" className="bg-cream-soft py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-[13px] font-medium text-coral">
            Contrata a {musician.stageName}
          </p>
          <h2 className="mt-2 font-display text-[30px] font-semibold tracking-tight text-ink sm:text-[36px]">
            Cuéntanos tu evento
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
            {copy.bookingIntro(musician.stageName)}
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
