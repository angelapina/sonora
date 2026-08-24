"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Upload, Plus, Music4 } from "lucide-react";
import { addMedia, deleteMedia } from "@/lib/actions/musician";

type MediaItem = {
  id: string;
  type: string;
  url: string;
  title: string | null;
  provider: string | null;
};

function extractYoutubeId(input: string) {
  const trimmed = input.trim();
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{6,})/
  );
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{6,}$/.test(trimmed)) return trimmed;
  return null;
}

export function MediaManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [pending, startTransition] = useTransition();
  const [videoInput, setVideoInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function refresh() {
    router.refresh();
  }

  async function handleUpload(file: File, type: "photo" | "audio") {
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Error al subir el archivo");
      return;
    }
    startTransition(async () => {
      await addMedia({ type, url: data.url, provider: "upload", title: file.name });
      setMedia((m) => [...m, { id: crypto.randomUUID(), type, url: data.url, title: file.name, provider: "upload" }]);
      refresh();
    });
  }

  function handleAddVideo() {
    const id = extractYoutubeId(videoInput);
    if (!id) {
      setError("Pega un enlace de YouTube válido");
      return;
    }
    setError(null);
    startTransition(async () => {
      await addMedia({ type: "video", url: id, provider: "youtube" });
      setMedia((m) => [...m, { id: crypto.randomUUID(), type: "video", url: id, title: null, provider: "youtube" }]);
      setVideoInput("");
      refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMedia(id);
      setMedia((m) => m.filter((item) => item.id !== id));
      refresh();
    });
  }

  const photos = media.filter((m) => m.type === "photo");
  const videos = media.filter((m) => m.type === "video");
  const audios = media.filter((m) => m.type === "audio");

  return (
    <div className="space-y-12">
      {error && <p className="text-sm text-coral-dark">{error}</p>}

      <section>
        <h3 className="font-display text-xl text-ink">Fotos</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl bg-ink-soft">
              <Image src={p.url} alt="" fill sizes="200px" className="object-cover" />
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-cream opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => photoInputRef.current?.click()}
            disabled={pending}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line text-ink-muted hover:border-coral hover:text-coral"
          >
            <Upload size={18} />
            <span className="text-xs font-medium">Subir foto</span>
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file, "photo");
              e.target.value = "";
            }}
          />
        </div>
      </section>

      <section>
        <h3 className="font-display text-xl text-ink">Vídeos (YouTube)</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {videos.map((v) => (
            <div key={v.id} className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm">
              <span className="max-w-[160px] truncate">{v.url}</span>
              <button onClick={() => handleDelete(v.id)} className="text-ink-muted hover:text-coral">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex max-w-lg gap-2">
          <input
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            placeholder="Pega el enlace de YouTube…"
            className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
          <button
            onClick={handleAddVideo}
            disabled={pending || !videoInput}
            className="flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-cream hover:bg-ink-soft disabled:opacity-60"
          >
            <Plus size={14} /> Añadir
          </button>
        </div>
      </section>

      <section>
        <h3 className="font-display text-xl text-ink">Audio</h3>
        <div className="mt-4 space-y-2">
          {audios.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-2.5 text-sm">
              <span className="flex items-center gap-2 truncate">
                <Music4 size={14} className="text-coral shrink-0" /> {a.title ?? a.url}
              </span>
              <button onClick={() => handleDelete(a.id)} className="text-ink-muted hover:text-coral">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => audioInputRef.current?.click()}
            disabled={pending}
            className="flex items-center gap-1.5 rounded-xl border-2 border-dashed border-line px-4 py-2.5 text-sm text-ink-muted hover:border-coral hover:text-coral"
          >
            <Upload size={14} /> Subir audio
          </button>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file, "audio");
              e.target.value = "";
            }}
          />
        </div>
      </section>
    </div>
  );
}
