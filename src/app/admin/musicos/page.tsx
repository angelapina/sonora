import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { AdminMusicianActions } from "@/components/admin-musician-actions";

export default async function AdminMusiciansPage() {
  const musicians = await prisma.musicianProfile.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      stageName: true,
      city: true,
      status: true,
      featured: true,
      plan: true,
      ratingAvg: true,
      ratingCount: true,
    },
  });

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Músicos ({musicians.length})</h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Ciudad</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Valoración</th>
              <th className="px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {musicians.map((m) => (
              <tr key={m.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 font-medium text-ink">
                  <Link href={`/musico/${m.slug}`} target="_blank" className="hover:text-coral">
                    {m.stageName}
                  </Link>
                  {m.featured && (
                    <Badge tone="coral" className="ml-2">
                      Destacado
                    </Badge>
                  )}
                  {m.plan === "premium" && (
                    <Badge tone="gold" className="ml-2">
                      Premium
                    </Badge>
                  )}
                </td>
                <td className="px-5 py-3 text-ink-soft">{m.city}</td>
                <td className="px-5 py-3">
                  <Badge tone={m.status === "published" ? "default" : "gold"}>
                    {m.status === "published" ? "Publicado" : "Borrador"}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-ink-soft">
                  {m.ratingAvg.toFixed(1)} ({m.ratingCount})
                </td>
                <td className="px-5 py-3">
                  <AdminMusicianActions musicianId={m.id} featured={m.featured} status={m.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
