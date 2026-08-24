import { Music4 } from "lucide-react";

export function AudioPlayer({ src, title }: { src: string; title?: string | null }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Music4 size={16} className="text-coral" />
        {title ?? "Muestra de audio"}
      </div>
      <audio controls preload="none" className="w-full">
        <source src={src} />
      </audio>
    </div>
  );
}
