import Link from "next/link";
import { ARTIST_TYPES } from "@/lib/taxonomy-data";

export function CategoryGrid() {
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {ARTIST_TYPES.map((type) => (
        <Link
          key={type.slug}
          href={`/buscar?artistType=${type.slug}`}
          className="group flex items-center gap-2 rounded-full bg-cream-soft px-4 py-2.5 text-sm font-medium text-ink transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink hover:text-white"
        >
          <span className="text-base leading-none transition-transform duration-300 group-hover:scale-110">
            {type.icon}
          </span>
          {type.label}
        </Link>
      ))}
    </div>
  );
}
