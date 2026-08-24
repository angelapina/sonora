import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Usuarios ({users.length})</h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Alta</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-5 py-3 text-ink-soft">{u.email}</td>
                <td className="px-5 py-3">
                  <Badge tone={u.role === "ADMIN" ? "coral" : u.role === "MUSICIAN" ? "gold" : "default"}>
                    {u.role}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-ink-soft">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
