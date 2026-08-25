import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, RotateCcw } from "lucide-react";
import { MusicianCard } from "@/components/musician-card";
import { ButtonLink } from "@/components/ui/button";
import { findMatches, type MatchAnswers } from "@/lib/data/match";

export const metadata: Metadata = {
  title: "Tus artistas recomendados",
  robots: { index: false }, // resultados personalizados: no aportan a SEO
};

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v ?? undefined;

export default async function MatchResultsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const answers: MatchAnswers = {
    eventType: one(sp.eventType),
    mood: one(sp.mood),
    guests: one(sp.guests),
    city: one(sp.city),
    budget: one(sp.budget),
  };

  const matches = await findMatches(answers, 6);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-coral">
          <Sparkles size={14} /> Tu match
        </p>
        <h1 className="mt-2 font-display text-[32px] font-semibold leading-tight tracking-tight text-ink sm:text-[42px]">
          Creemos que estos artistas encajan contigo.
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">
          Ordenados por afinidad con lo que nos has contado. El porcentaje mide cuánto
          encaja cada artista con tu evento, no su calidad.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-line p-12 text-center">
          <p className="font-display text-xl text-ink">
            No hemos encontrado artistas con esos criterios
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink-muted">
            Prueba a ampliar la ciudad o el presupuesto.
          </p>
          <ButtonLink href="/match" variant="secondary" className="mt-6">
            <RotateCcw size={15} /> Repetir el test
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((m) => (
              <div key={m.musician.id}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[12px] font-semibold text-white">
                    {m.score}% match
                  </span>
                </div>
                <MusicianCard musician={m.musician} />
                {m.reasons.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {m.reasons.map((r) => (
                      <li key={r} className="flex gap-1.5 text-[13px] text-ink-muted">
                        <span className="text-coral">·</span> {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-4 border-t border-line pt-10">
            <Link
              href="/match"
              className="flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              <RotateCcw size={15} /> Repetir el test
            </Link>
            <ButtonLink href="/buscar" variant="secondary">
              Ver todos los artistas
            </ButtonLink>
          </div>
        </>
      )}
    </div>
  );
}
