"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Calendario público de disponibilidad. El artista solo marca lo que tiene
 * ocupado, así que aquí traducimos a tres estados legibles para el cliente:
 * verde (libre), rojo (ocupado) y ámbar para fechas lejanas, donde "libre"
 * todavía no es un compromiso firme y conviene confirmar.
 */
const CONFIRM_HORIZON_DAYS = 120;

function startOfDayUTC(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export function AvailabilityViewer({
  blockedDates,
  stageName,
}: {
  /** Fechas ocupadas en formato yyyy-mm-dd */
  blockedDates: string[];
  stageName: string;
}) {
  const today = startOfDayUTC(new Date());
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const blocked = new Set(blockedDates);

  const viewDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset, 1));
  const year = viewDate.getUTCFullYear();
  const month = viewDate.getUTCMonth();

  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const monthLabel = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(viewDate);

  function statusFor(iso: string, date: Date): "past" | "busy" | "free" | "ask" {
    if (date < today) return "past";
    if (blocked.has(iso)) return "busy";
    const diffDays = (date.getTime() - today.getTime()) / 86_400_000;
    return diffDays > CONFIRM_HORIZON_DAYS ? "ask" : "free";
  }

  const selectedStatus = selected
    ? statusFor(selected, new Date(`${selected}T00:00:00.000Z`))
    : null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
          disabled={monthOffset === 0}
          aria-label="Mes anterior"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink/30 disabled:opacity-30"
        >
          <ChevronLeft size={15} />
        </button>
        <p className="text-[15px] font-medium capitalize text-ink">{monthLabel}</p>
        <button
          onClick={() => setMonthOffset((m) => Math.min(11, m + 1))}
          disabled={monthOffset === 11}
          aria-label="Mes siguiente"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink/30 disabled:opacity-30"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
          <span key={i} className="pb-1 text-[11px] font-medium text-ink-muted">
            {d}
          </span>
        ))}
        {Array.from({ length: firstWeekday }, (_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(Date.UTC(year, month, day));
          const iso = date.toISOString().slice(0, 10);
          const status = statusFor(iso, date);
          const isSelected = selected === iso;

          return (
            <button
              key={iso}
              disabled={status === "past"}
              onClick={() => setSelected(isSelected ? null : iso)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-[13px] transition-all duration-200",
                status === "past" && "text-line",
                status === "free" && "bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
                status === "ask" && "bg-amber-50 text-amber-900 hover:bg-amber-100",
                status === "busy" && "bg-red-50 text-red-400 line-through",
                isSelected && "ring-2 ring-ink ring-offset-1"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Libre
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Consultar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" /> Ocupado
        </span>
      </div>

      {selected && selectedStatus && selectedStatus !== "past" && (
        <div className="mt-5 rounded-2xl border border-line bg-cream-soft p-4">
          <p className="text-[14px] text-ink">
            {selectedStatus === "busy" ? (
              <>
                <strong>{stageName}</strong> tiene ese día ocupado. Escríbele igualmente
                por si puede recomendarte a alguien.
              </>
            ) : selectedStatus === "ask" ? (
              <>
                Esa fecha está lejos y aún no está confirmada. Consúltasela a{" "}
                <strong>{stageName}</strong> para reservarla.
              </>
            ) : (
              <>
                <strong>{stageName}</strong> tiene esa fecha libre. Pídele presupuesto
                antes de que se la reserve otro evento.
              </>
            )}
          </p>
          <a
            href="#solicitar"
            className="mt-3 inline-flex rounded-full bg-coral px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-coral-dark"
          >
            Consultar esa fecha
          </a>
        </div>
      )}
    </div>
  );
}
