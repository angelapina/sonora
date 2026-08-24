import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  href,
  hrefLabel = "Ver todos",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[13px] font-medium text-coral">{eyebrow}</p>
        )}
        <h2 className="mt-1.5 font-display text-[28px] font-semibold tracking-tight text-ink sm:text-[34px]">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group hidden shrink-0 items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-ink sm:flex"
        >
          {hrefLabel}{" "}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
