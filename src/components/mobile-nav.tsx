"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const noopSubscribe = () => () => {};

/** true solo tras el montaje en cliente, sin efectos con setState (evita el
 * mismatch de hidratación al usar createPortal contra document.body). */
function useIsMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export function MobileNav({
  isLoggedIn,
  dashboardHref,
}: {
  isLoggedIn: boolean;
  dashboardHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const mounted = useIsMounted();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const menu = (
    <div className="fixed inset-0 z-50 bg-ink/40" onClick={() => setOpen(false)}>
          <div
            className="ml-auto flex h-full w-72 flex-col gap-1 bg-cream p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-xl text-ink">Menú</span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="text-ink">
                <X size={20} />
              </button>
            </div>
            <Link href="/buscar" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-ink/5">
              Buscar músicos
            </Link>
            <Link href="/buscar?eventType=boda" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-ink/5">
              Bodas
            </Link>
            <Link href="/buscar?eventType=corporativo" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-ink/5">
              Eventos de empresa
            </Link>
            <Link href="/registro/musico" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-ink/5">
              Soy músico
            </Link>
            <div className="my-2 border-t border-line" />
            {isLoggedIn ? (
              <Link href={dashboardHref ?? "/"} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-coral hover:bg-coral/5">
                Mi cuenta
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-ink/5">
                  Iniciar sesión
                </Link>
                <Link href="/registro" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-coral hover:bg-coral/5">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="flex h-9 w-9 items-center justify-center text-ink"
      >
        <Menu size={22} />
      </button>

      {open && mounted && createPortal(menu, document.body)}
    </div>
  );
}
