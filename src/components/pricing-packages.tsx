import { Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Pkg = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number | null;
  includes: string | null;
};

function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export function PricingPackages({
  packages,
  priceNote,
}: {
  packages: Pkg[];
  priceNote?: string | null;
}) {
  if (packages.length === 0) return null;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((p, i) => (
          <div
            key={p.id}
            className={cnCard(i === 1 && packages.length > 2)}
          >
            <p className="text-[13px] font-medium uppercase tracking-wide text-ink-muted">
              {p.name}
            </p>
            <p className="mt-2 font-display text-[28px] font-semibold tracking-tight text-ink">
              {formatPrice(p.price)}
            </p>
            {p.durationMin && (
              <p className="mt-0.5 text-[13px] text-ink-muted">
                {formatDuration(p.durationMin)} de actuación
              </p>
            )}
            {p.description && (
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{p.description}</p>
            )}
            {p.includes && (
              <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                {p.includes.split("\n").filter(Boolean).map((item) => (
                  <li key={item} className="flex gap-2 text-[13px] text-ink-soft">
                    <Check size={14} className="mt-0.5 shrink-0 text-coral" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {priceNote && (
        <p className="mt-5 text-[13px] leading-relaxed text-ink-muted">{priceNote}</p>
      )}
    </div>
  );
}

function cnCard(highlight: boolean) {
  return [
    "rounded-2xl border p-6 transition-shadow duration-300",
    highlight
      ? "border-ink/20 bg-cream-soft shadow-[0_8px_32px_-16px_rgba(0,0,0,0.2)]"
      : "border-line bg-white",
  ].join(" ");
}
