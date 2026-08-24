import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Music2, Heart, LayoutDashboard, LogOut } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-cream/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-[19px] font-semibold tracking-tight text-ink">Sonora</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-medium text-ink-muted md:flex">
          <Link href="/buscar" className="transition-colors hover:text-ink">
            Buscar músicos
          </Link>
          <Link href="/buscar?eventType=boda" className="transition-colors hover:text-ink">
            Bodas
          </Link>
          <Link href="/buscar?eventType=corporativo" className="transition-colors hover:text-ink">
            Eventos de empresa
          </Link>
          <Link href="/registro/musico" className="transition-colors hover:text-ink">
            Soy músico
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              {session.user.role === "CLIENT" && (
                <Link
                  href="/cuenta/favoritos"
                  className="hidden items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:flex"
                >
                  <Heart size={16} /> Favoritos
                </Link>
              )}
              {(session.user.role === "MUSICIAN" || session.user.role === "ADMIN") && (
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  className="hidden items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:flex"
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
                  className="flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
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
                className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:block"
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
