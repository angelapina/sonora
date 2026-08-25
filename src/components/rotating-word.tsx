"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Palabra que va cambiando dentro del titular.
 *
 * Decisiones que importan:
 * - Todas las palabras se renderizan en el DOM, apiladas en la misma celda de
 *   un `inline-grid`. Eso consigue tres cosas a la vez: el contenedor mide lo
 *   que la palabra más larga (sin saltos de layout al cambiar), Google ve todas
 *   las variantes dentro del H1 (cada una es una keyword de intención real:
 *   boda, fiesta, evento de empresa…), y no hace falta medir nada en JS.
 * - Solo la palabra activa es visible; las demás quedan ocultas visualmente
 *   pero presentes para el rastreador.
 * - Si el usuario ha pedido menos movimiento, se queda fija en la primera.
 */
export function RotatingWord({
  words,
  intervalMs = 2200,
  className,
}: {
  words: readonly string[];
  intervalMs?: number;
  className?: string;
}) {
  // -1 = todavía no ha arrancado el ciclo (SSR y usuarios con motion reducido):
  // en ese estado se muestra siempre la primera palabra.
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // El timer es la fuente externa que dicta el cambio; el setState va dentro
    // del callback, no en el cuerpo del efecto.
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  const activeIndex = index < 0 ? 0 : index;

  // La caja mide siempre lo que la palabra más larga (así no hay saltos al
  // rotar), y por eso el contenido va centrado dentro de ella.
  //
  // Siempre ocupa línea propia: la caja mide lo que la palabra más larga, y a
  // tamaño de titular eso dejaría un hueco enorme a mitad de renglón. Apilada
  // se lee como un titular escalonado y se comporta igual en cualquier ancho.
  return (
    <span className="relative grid w-full justify-items-center text-center">
      {words.map((w, i) => {
        const active = i === activeIndex;
        return (
          <span
            key={w}
            aria-hidden={!active}
            style={{ gridArea: "1 / 1" }}
            className={cn(
              "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              active
                ? "translate-y-0 opacity-100 blur-0"
                : "pointer-events-none -translate-y-2 opacity-0 blur-[3px]",
              className
            )}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
}
