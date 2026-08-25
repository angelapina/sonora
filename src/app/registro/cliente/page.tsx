import Link from "next/link";
import type { Metadata } from "next";
import { RegisterClientForm } from "@/components/register-client-form";

export const metadata: Metadata = { title: "Crear cuenta de cliente" };

export default function RegisterClientPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl text-ink">Crea tu cuenta</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Guarda favoritos y haz seguimiento de tus solicitudes de presupuesto.
      </p>
      <div className="mt-8">
        <RegisterClientForm />
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
