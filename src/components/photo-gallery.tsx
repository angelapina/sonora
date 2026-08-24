import Image from "next/image";

export function PhotoGallery({ photos, alt }: { photos: { url: string }[]; alt: string }) {
  if (photos.length === 0) return null;
  const [first, ...rest] = photos;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-2xl bg-ink-soft sm:aspect-auto">
        <Image
          src={first.url}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {rest.slice(0, 4).map((p, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-ink-soft">
          <Image
            src={p.url}
            alt={alt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
