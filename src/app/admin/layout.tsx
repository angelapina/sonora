import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { LayoutGrid, Music4, Users, Star } from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Resumen", icon: LayoutGrid },
  { href: "/admin/musicos", label: "Músicos", icon: Music4 },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/resenas", label: "Reseñas", icon: Star },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
        Panel de administración
      </p>
      <h1 className="mt-1 font-display text-3xl text-ink">Sonora Admin</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-ink/5"
            >
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
