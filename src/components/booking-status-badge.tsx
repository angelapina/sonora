import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  declined: "Rechazada",
  completed: "Completada",
};

export function BookingStatusBadge({ status }: { status: string }) {
  const tone = status === "accepted" || status === "completed" ? "coral" : status === "declined" ? "default" : "gold";
  return <Badge tone={tone}>{LABELS[status] ?? status}</Badge>;
}
