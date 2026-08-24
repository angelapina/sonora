import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MUSICIAN") redirect("/login");

  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session.user.id },
    select: { slug: true, stageName: true, status: true, avatarUrl: true },
  });
  if (!profile) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
            Dashboard de músico
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink">{profile.stageName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={profile.status === "published" ? "coral" : "default"}>
            {profile.status === "published" ? "Perfil publicado" : "Borrador"}
          </Badge>
          <Link
            href={`/musico/${profile.slug}`}
            target="_blank"
            className="text-sm font-semibold text-ink-soft hover:text-coral"
          >
            Ver perfil público →
          </Link>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <DashboardNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
