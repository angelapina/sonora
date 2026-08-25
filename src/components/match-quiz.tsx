"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { CITIES } from "@/lib/taxonomy-data";
import { cn } from "@/lib/utils";

type QuestionKey = "eventType" | "mood" | "guests" | "city" | "budget";

const QUESTIONS: {
  key: QuestionKey;
  question: string;
  hint: string;
  options: { value: string; label: string; sub?: string }[];
}[] = [
  {
    key: "eventType",
    question: "¿Qué estás organizando?",
    hint: "Para saber a qué tipo de bolo está acostumbrado el artista",
    options: [
      { value: "boda", label: "Una boda" },
      { value: "corporativo", label: "Un evento de empresa" },
      { value: "fiesta-privada", label: "Una fiesta privada" },
      { value: "cumpleanos", label: "Un cumpleaños" },
      { value: "restaurante", label: "Algo en un restaurante" },
      { value: "hotel", label: "Algo en un hotel" },
    ],
  },
  {
    key: "mood",
    question: "¿Qué ambiente buscas?",
    hint: "Lo que quieres que sienta la gente",
    options: [
      { value: "elegante", label: "Elegante", sub: "Jazz, clásica, swing" },
      { value: "fiesta", label: "De fiesta", sub: "Que no pare la pista" },
      { value: "intimo", label: "Íntimo", sub: "Acústico y cercano" },
      { value: "tradicional", label: "Con raíces", sub: "Flamenco, copla, latino" },
      { value: "moderno", label: "Actual", sub: "Pop, soul, versiones" },
    ],
  },
  {
    key: "guests",
    question: "¿Cuánta gente vendrá?",
    hint: "Nos ayuda a proponerte la formación adecuada",
    options: [
      { value: "0-50", label: "Menos de 50" },
      { value: "50-120", label: "Entre 50 y 120" },
      { value: "120-250", label: "Entre 120 y 250" },
      { value: "250+", label: "Más de 250" },
    ],
  },
  {
    key: "city",
    question: "¿Dónde es?",
    hint: "Para priorizar artistas de tu zona",
    options: CITIES.map((c) => ({ value: c.name, label: c.name })),
  },
  {
    key: "budget",
    question: "¿Cuánto quieres invertir en música?",
    hint: "Orientativo, para no proponerte nada fuera de rango",
    options: [
      { value: "0-400", label: "Hasta 400 €" },
      { value: "400-700", label: "400 – 700 €" },
      { value: "700-1200", label: "700 – 1.200 €" },
      { value: "1200+", label: "Más de 1.200 €" },
    ],
  },
];

export function MatchQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, string>>>({});

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  function choose(value: string) {
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    if (isLast) {
      const params = new URLSearchParams(next as Record<string, string>);
      router.push(`/match/resultados?${params.toString()}`);
    } else {
      setTimeout(() => setStep(step + 1), 160);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 flex items-center gap-2">
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-500",
              i <= step ? "bg-ink" : "bg-line"
            )}
          />
        ))}
      </div>

      <p className="text-[13px] font-medium text-coral">
        Pregunta {step + 1} de {QUESTIONS.length}
      </p>
      <h1 className="mt-2 font-display text-[30px] font-semibold leading-tight tracking-tight text-ink sm:text-[38px]">
        {q.question}
      </h1>
      <p className="mt-2 text-[15px] text-ink-muted">{q.hint}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {q.options.map((o) => (
          <button
            key={o.value}
            onClick={() => choose(o.value)}
            className={cn(
              "rounded-2xl border px-5 py-4 text-left transition-all duration-200",
              answers[q.key] === o.value
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-ink/30"
            )}
          >
            <span className="block text-[15px] font-medium">{o.label}</span>
            {o.sub && (
              <span
                className={cn(
                  "mt-0.5 block text-[13px]",
                  answers[q.key] === o.value ? "text-white/60" : "text-ink-muted"
                )}
              >
                {o.sub}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink disabled:invisible"
        >
          <ArrowLeft size={15} /> Atrás
        </button>

        {isLast ? (
          <button
            onClick={() => {
              const params = new URLSearchParams(answers as Record<string, string>);
              router.push(`/match/resultados?${params.toString()}`);
            }}
            className="flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-medium text-white transition-all hover:bg-coral-dark active:scale-95"
          >
            <Sparkles size={15} /> Ver mis artistas
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Saltar <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
