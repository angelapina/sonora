import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Music2, Heart, LayoutDashboard, LogOut } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

export async function SiteHeader() {
  const session = await auth();

  // Cabecera oscura y sin borde inferior: sobre el hero negro se funde con él
  // (antes el borde claro dibujaba una línea blanca muy visible), y en las
  // páginas de fondo blanco actúa como barra de contraste.
  return (
    <header className="sticky top-0 z-40 bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[19px] font-semibold tracking-[-0.02em] text-white">Sonora</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-white/60 md:flex">
          <Link href="/buscar" className="transition-colors hover:text-white">
            Buscar músicos
          </Link>
          <Link href="/musica-para/bodas" className="transition-colors hover:text-white">
            Bodas
          </Link>
          <Link href="/musica-para/eventos-corporativos" className="transition-colors hover:text-white">
            Empresas
          </Link>
          <Link href="/como-funciona" className="transition-colors hover:text-white">
            Cómo funciona
          </Link>
          <Link href="/para-musicos" className="transition-colors hover:text-white">
            Para músicos
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              {session.user.role === "CLIENT" && (
                <Link
                  href="/cuenta/favoritos"
                  className="hidden items-center gap-1.5 text-[13px] font-medium text-white/65 transition-colors hover:text-white sm:flex"
                >
                  <Heart size={16} /> Favoritos
                </Link>
              )}
              {(session.user.role === "MUSICIAN" || session.user.role === "ADMIN") && (
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  className="hidden items-center gap-1.5 text-[13px] font-medium text-white/65 transition-colors hover:text-white sm:flex"
                >
                  <LayoutDashboard size={16} />
                  {session.user.role === "ADMIN" ? "Panel admin" : "Mi dashboard"}
                </Link>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-[13px] font-medium text-white/65 transition-colors hover:text-white"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[13px] font-medium text-white/65 transition-colors hover:text-white sm:block"
              >
                Iniciar sesión
              </Link>
              <ButtonLink href="/buscar" size="sm" className="hidden sm:inline-flex">
                <Music2 size={15} /> Buscar músicos
              </ButtonLink>
            </>
          )}
          <MobileNav
            isLoggedIn={!!session?.user}
            dashboardHref={
              session?.user?.role === "ADMIN"
                ? "/admin"
                : session?.user?.role === "MUSICIAN"
                  ? "/dashboard"
                  : "/cuenta/favoritos"
            }
          />
        </div>
      </div>
    </header>
  );
}
