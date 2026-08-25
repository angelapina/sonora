import type { Metadata } from "next";
import { MatchQuiz } from "@/components/match-quiz";

export const metadata: Metadata = {
  title: "Encuentra tu músico ideal",
  description:
    "Cuéntanos cómo es tu evento y te proponemos los artistas que mejor encajan: estilo, formato, presupuesto y disponibilidad.",
};

export default function MatchPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <MatchQuiz />
    </div>
  );
}
