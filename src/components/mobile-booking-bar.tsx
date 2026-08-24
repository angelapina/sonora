"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export function MobileBookingBar({
  stageName,
  priceFrom,
}: {
  stageName: string;
  priceFrom: number | null;
}) {
  const [visible, setVisible] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 420);
        ticking.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const form = document.getElementById("solicitar");
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      { rootMargin: "0px 0px -40% 0px" }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const show = visible && !formInView;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
        show ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] text-ink-muted">{stageName}</p>
          <p className="text-[15px] font-semibold text-ink">
            {priceFrom ? `Desde ${formatPrice(priceFrom)}` : "Consultar precio"}
          </p>
        </div>
        <Link
          href="#solicitar"
          className="shrink-0 rounded-full bg-coral px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
        >
          Solicitar presupuesto
        </Link>
      </div>
    </div>
  );
}
