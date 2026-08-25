import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-12 text-cream lg:flex">
        <Link href="/" className="font-display text-2xl">
          Sonora
        </Link>
        <div>
          <p className="font-display text-4xl italic leading-snug">
            “La música perfecta empieza por encontrar al artista perfecto.”
          </p>
          <p className="mt-6 text-sm text-cream/60">
            Accede para gestionar tus solicitudes, favoritos o tu perfil de músico.
          </p>
        </div>
        <p className="text-xs text-cream/40">© {new Date().getFullYear()} Sonora</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-ink">Bienvenido de nuevo</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Inicia sesión para continuar en Sonora.
          </p>
          <div className="mt-8">
            <LoginForm callbackUrl={callbackUrl} />
          </div>
          <p className="mt-8 text-sm text-ink-muted">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="font-semibold text-coral hover:text-coral-dark">
              Regístrate
            </Link>
          </p>
          <p className="mt-8 rounded-xl border border-line bg-cream-soft p-4 text-xs text-ink-muted">
            Demo: <strong>cliente@ejemplo.com</strong> / Cliente1234! · músico ej.{" "}
            <strong>marta-vidal@sonora.app</strong> / Musico1234! · admin{" "}
            <strong>admin@sonora.app</strong> / Admin1234!
          </p>
        </div>
      </div>
    </div>
  );
}
