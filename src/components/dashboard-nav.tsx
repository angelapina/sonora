"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, UserCog, Images, CalendarClock, Inbox, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Resumen", icon: LayoutGrid },
  { href: "/dashboard/perfil", label: "Editar perfil", icon: UserCog },
  { href: "/dashboard/media", label: "Multimedia", icon: Images },
  { href: "/dashboard/disponibilidad", label: "Disponibilidad", icon: CalendarClock },
  { href: "/dashboard/solicitudes", label: "Solicitudes", icon: Inbox },
  { href: "/dashboard/resenas", label: "Reseñas", icon: Star },
];

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-ink text-cream" : "text-ink-soft hover:bg-ink/5"
            )}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
