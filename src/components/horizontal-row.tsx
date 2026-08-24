"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HorizontalRow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function updateEdges() {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    updateEdges();
    const el = ref.current;
    if (!el) return;
    const onResize = () => updateEdges();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function scrollBy(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="group/row relative">
      <div
        ref={ref}
        onScroll={updateEdges}
        className="scroll-row flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {children}
      </div>

      <button
        aria-label="Anterior"
        onClick={() => scrollBy(-1)}
        className={cn(
          "absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-opacity duration-300 group-hover/row:opacity-100 md:flex",
          !canLeft && "pointer-events-none opacity-0"
        )}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        aria-label="Siguiente"
        onClick={() => scrollBy(1)}
        className={cn(
          "absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-opacity duration-300 group-hover/row:opacity-100 md:flex",
          !canRight && "pointer-events-none opacity-0"
        )}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export function RowItem({ children }: { children: ReactNode }) {
  return (
    <div className="w-[46vw] shrink-0 snap-start sm:w-[30vw] md:w-[22vw] lg:w-[240px]">
      {children}
    </div>
  );
}
