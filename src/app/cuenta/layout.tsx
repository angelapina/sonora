import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Heart, Inbox } from "lucide-react";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Mi cuenta</p>
        <h1 className="mt-1 font-display text-3xl text-ink">Hola, {session.user.name}</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
          <Link
            href="/cuenta/favoritos"
            className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-ink/5"
          >
            <Heart size={16} /> Favoritos
          </Link>
          <Link
            href="/cuenta/solicitudes"
            className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-ink/5"
          >
            <Inbox size={16} /> Mis solicitudes
          </Link>
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
