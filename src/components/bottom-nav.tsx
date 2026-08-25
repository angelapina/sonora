"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Navegación inferior en móvil, al estilo de las apps nativas. Solo se muestra
 * en pantallas pequeñas; en escritorio manda el header.
 *
 * Los destinos cambian según el rol: un músico necesita llegar a su dashboard y
 * a sus solicitudes, no a "favoritos".
 */
export function BottomNav({
  role,
}: {
  role?: "CLIENT" | "MUSICIAN" | "ADMIN" | null;
}) {
  const pathname = usePathname();

  // En el flujo de alta/login la barra estorba más que ayuda.
  if (pathname.startsWith("/login") || pathname.startsWith("/registro")) return null;

  const isMusician = role === "MUSICIAN" || role === "ADMIN";

  const items = isMusician
    ? [
        { href: "/", label: "Inicio", icon: Home },
        { href: "/buscar", label: "Buscar", icon: Search },
        { href: "/dashboard/solicitudes", label: "Solicitudes", icon: MessageSquare },
        { href: "/dashboard", label: "Mi perfil", icon: User },
      ]
    : [
        { href: "/", label: "Inicio", icon: Home },
        { href: "/buscar", label: "Buscar", icon: Search },
        { href: "/cuenta/favoritos", label: "Favoritos", icon: Heart },
        { href: "/cuenta/solicitudes", label: "Mensajes", icon: MessageSquare },
        { href: role ? "/cuenta/favoritos" : "/login", label: role ? "Cuenta" : "Entrar", icon: User },
      ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="flex items-stretch">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href + item.label} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-ink" : "text-ink-muted"
                )}
              >
                <item.icon
                  size={19}
                  strokeWidth={active ? 2.3 : 1.8}
                  className={cn(active && item.label === "Favoritos" && "fill-ink")}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
