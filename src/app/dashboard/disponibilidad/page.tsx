import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AvailabilityCalendar } from "@/components/availability-calendar";

export default async function DashboardAvailabilityPage() {
  const session = await auth();
  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session!.user.id },
    include: { availability: { where: { available: false } } },
  });
  if (!profile) return null;

  const blockedDates = profile.availability.map((a) => a.date.toISOString().slice(0, 10));

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Disponibilidad</h2>
      <p className="mt-1 max-w-lg text-sm text-ink-muted">
        Marca los días en los que ya tienes un evento para que los clientes vean tu
        disponibilidad real en tu perfil.
      </p>
      <div className="mt-6">
        <AvailabilityCalendar blockedDates={blockedDates} />
      </div>
    </div>
  );
}
