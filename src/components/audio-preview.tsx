"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Un único elemento <audio> compartido por toda la página: al darle play a una
 * pista se detiene automáticamente la anterior, como en Spotify. Evita el caos
 * de veinte reproductores sonando a la vez en una lista de resultados.
 */
let currentAudio: HTMLAudioElement | null = null;
const listeners = new Set<(src: string | null) => void>();

function notify(src: string | null) {
  listeners.forEach((l) => l(src));
}

function playSrc(src: string) {
  if (currentAudio) {
    currentAudio.pause();
  }
  const audio = new Audio(src);
  currentAudio = audio;
  audio.play().catch(() => notify(null));
  audio.addEventListener("ended", () => {
    if (currentAudio === audio) {
      currentAudio = null;
      notify(null);
    }
  });
  notify(src);
}

function stop() {
  currentAudio?.pause();
  currentAudio = null;
  notify(null);
}

/** Botón compacto de play/pausa para tarjetas de resultados. */
export function AudioPreviewButton({
  src,
  className,
  label = "Escuchar",
}: {
  src: string;
  className?: string;
  label?: string;
}) {
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);
  const isPlaying = playingSrc === src;

  useEffect(() => {
    const listener = (s: string | null) => setPlayingSrc(s);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isPlaying) stop();
        else playSrc(src);
      }}
      aria-label={isPlaying ? "Pausar" : label}
      className={cn(
        "flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-[13px] font-medium text-ink shadow-[0_4px_16px_rgba(0,0,0,0.16)] backdrop-blur transition-all duration-300 hover:bg-white active:scale-95",
        className
      )}
    >
      {isPlaying ? (
        <Pause size={13} className="fill-ink" />
      ) : (
        <Play size={13} className="ml-0.5 fill-ink" />
      )}
      {isPlaying ? "Sonando" : label}
    </button>
  );
}

/** Reproductor con barra de progreso, para el perfil del artista. */
export function AudioTrack({
  src,
  title,
  index,
}: {
  src: string;
  title?: string | null;
  index: number;
}) {
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | undefined>(undefined);
  const isPlaying = playingSrc === src;

  useEffect(() => {
    const listener = (s: string | null) => setPlayingSrc(s);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    function tick() {
      // El progreso lo dicta el elemento <audio> (sistema externo), no React:
      // leemos su estado en cada frame en vez de derivarlo con un setState suelto.
      if (currentAudio && currentAudio.duration) {
        setProgress((currentAudio.currentTime / currentAudio.duration) * 100);
      }
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      setProgress(0); // al parar, la barra vuelve a cero en la limpieza
    };
  }, [isPlaying]);

  return (
    <button
      type="button"
      onClick={() => (isPlaying ? stop() : playSrc(src))}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
        isPlaying ? "border-ink bg-cream-soft" : "border-line bg-white hover:border-ink/25"
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
          isPlaying ? "bg-coral text-white" : "bg-ink text-white group-hover:bg-ink-soft"
        )}
      >
        {isPlaying ? (
          <Pause size={15} className="fill-current" />
        ) : (
          <Play size={15} className="ml-0.5 fill-current" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-ink">
          {title ?? `Muestra ${index + 1}`}
        </span>
        <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-line">
          <span
            className="block h-full rounded-full bg-coral transition-[width] duration-150 ease-linear"
            style={{ width: `${isPlaying ? progress : 0}%` }}
          />
        </span>
      </span>
    </button>
  );
}
