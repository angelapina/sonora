import Link from "next/link";
import type { Metadata } from "next";
import { Music4, User } from "lucide-react";

export const metadata: Metadata = { title: "Crear cuenta | Sonora" };

export default function RegisterChoicePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
        Únete a Sonora
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink">¿Cómo quieres registrarte?</h1>
      <p className="mt-3 max-w-md text-ink-muted">
        Elige la opción que mejor te describa. Podrás cambiarlo más adelante.
      </p>

      <div className="mt-10 grid w-full gap-6 sm:grid-cols-2">
        <Link
          href="/registro/cliente"
          className="group flex flex-col items-center gap-3 rounded-3xl border border-line bg-paper p-10 transition-all hover:-translate-y-1 hover:border-coral/40 hover:shadow-[0_24px_48px_-24px_rgba(21,18,15,0.25)]"
        >
          <User size={28} className="text-coral" />
          <p className="font-display text-xl text-ink">Busco músicos</p>
          <p className="text-sm text-ink-muted">
            Contrata artistas para tu boda o evento y guarda tus favoritos.
          </p>
        </Link>
        <Link
          href="/registro/musico"
          className="group flex flex-col items-center gap-3 rounded-3xl border border-line bg-paper p-10 transition-all hover:-translate-y-1 hover:border-coral/40 hover:shadow-[0_24px_48px_-24px_rgba(21,18,15,0.25)]"
        >
          <Music4 size={28} className="text-coral" />
          <p className="font-display text-xl text-ink">Soy músico o artista</p>
          <p className="text-sm text-ink-muted">
            Crea tu perfil profesional y empieza a recibir solicitudes.
          </p>
        </Link>
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-coral hover:text-coral-dark">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
