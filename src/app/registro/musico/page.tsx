import Link from "next/link";
import type { Metadata } from "next";
import { RegisterMusicianForm } from "@/components/register-musician-form";

export const metadata: Metadata = { title: "Regístrate como músico" };

export default function RegisterMusicianPage() {
  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-12 text-cream lg:flex">
        <Link href="/" className="font-display text-2xl">
          Sonora
        </Link>
        <div>
          <p className="font-display text-4xl leading-snug">
            Consigue más bolos con un perfil profesional.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-cream/70">
            <li>✓ Sube vídeos, fotos y muestras de audio</li>
            <li>✓ Define tus precios y disponibilidad</li>
            <li>✓ Recibe solicitudes directas de clientes</li>
            <li>✓ Empieza gratis, hazte Premium cuando quieras</li>
          </ul>
        </div>
        <p className="text-xs text-cream/40">© {new Date().getFullYear()} Sonora</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-ink">Crea tu perfil de músico</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Es gratis. Podrás completar el resto de tu perfil desde tu dashboard.
          </p>
          <div className="mt-8">
            <RegisterMusicianForm />
          </div>
          <p className="mt-8 text-sm text-ink-muted">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-coral hover:text-coral-dark">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
