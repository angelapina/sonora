import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  const textSize = size <= 12 ? "text-[13px]" : "text-sm";
  return (
    <div className={cn("flex items-center gap-1 text-ink-soft", className)}>
      <Star size={size} className="fill-gold text-gold" strokeWidth={0} />
      <span className={cn(textSize, "font-medium text-ink")}>{value.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className="text-xs text-ink-muted">({count})</span>
      )}
    </div>
  );
}
