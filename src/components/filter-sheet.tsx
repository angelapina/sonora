"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, X } from "lucide-react";

const noopSubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

/**
 * Filtros en móvil como hoja inferior, no como acordeón.
 *
 * El acordeón empujaba los resultados hacia abajo: al abrirlo perdías de vista
 * lo que estabas filtrando, y al cerrarlo la página daba un salto. Una hoja
 * que sube desde abajo mantiene el contexto y se cierra con el pulgar, que es
 * donde está la mano en el móvil. El botón de aplicar va pegado arriba dentro
 * del formulario, así que sigue a la vista sin recorrer todos los filtros.
 */
export function FilterSheet({
  activeCount,
  children,
}: {
  activeCount: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const mounted = useIsMounted();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const sheet = (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
      <button
        aria-label="Cerrar filtros"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />

      <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[24px] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.2)] motion-safe:animate-[sheet-up_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Asa: señal universal de "esto se arrastra" */}
        <div className="flex justify-center pt-3">
          <span className="h-1 w-10 rounded-full bg-line" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 pt-3">
          <p className="text-[17px] font-semibold text-ink">Filtros</p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-[15px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:bg-cream-soft lg:hidden"
      >
        <SlidersHorizontal size={16} />
        Filtros
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[11px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {open && mounted && createPortal(sheet, document.body)}
    </>
  );
}
