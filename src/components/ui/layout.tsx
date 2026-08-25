import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Contenedor y sección: el andamio de toda la web.
 *
 * El problema que resuelven: cada página venía definiendo su propio
 * `max-w-7xl px-6 py-20` a mano, con valores distintos según el día. Eso hacía
 * que el margen lateral bailara entre páginas y que el aire vertical no tuviera
 * relación de una sección a otra. Centralizarlo aquí es lo que hace que el
 * conjunto se lea armónico sin tener que pensarlo en cada pantalla.
 *
 * El margen lateral crece con la pantalla (20px en móvil, 24 en tablet, 40 en
 * escritorio): en móvil el contenido debe aprovechar el ancho, y en escritorio
 * necesita respirar contra el borde.
 */
export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  /** `narrow` para texto largo (mejor legibilidad), `wide` para rejillas. */
  size?: "narrow" | "default" | "wide";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };

  return (
    <div className={cn("mx-auto w-full px-5 sm:px-6 lg:px-10", widths[size], className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  tight = false,
  flushTop = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  /** Para bloques secundarios que no necesitan el aire completo. */
  tight?: boolean;
  /**
   * Quita el espacio superior porque la sección anterior comparte fondo.
   *
   * Cuando dos secciones seguidas tienen el mismo color, sus espacios se suman
   * y dejan un hueco del doble (medido: 237px entre "beneficios" y el cierre).
   * Como no hay separación de color que justifique ese vacío, se lee como un
   * error. Con esto, el hueco lo aporta solo la sección de arriba.
   */
  flushTop?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        tight ? "section-tight" : "section",
        flushTop && "pt-0",
        className
      )}
    >
      {children}
    </section>
  );
}

/**
 * Encabezado de sección: eyebrow + título + apoyo opcional.
 *
 * Unificarlo garantiza que la distancia entre esos tres elementos sea idéntica
 * en toda la web, que es una de las cosas que más delata a una web "cosida a
 * mano" cuando varía de sección en sección.
 */
export function SectionHead({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        centered && "sm:flex-col sm:items-center sm:justify-center"
      )}
    >
      <div className={cn("max-w-2xl", centered && "text-center")}>
        {eyebrow && <p className="t-eyebrow text-coral">{eyebrow}</p>}
        <h2 className={cn("t-h2 text-ink", eyebrow && "mt-2")}>{title}</h2>
        {subtitle && (
          <p className={cn("t-lead mt-3 text-ink-muted", centered && "mx-auto")}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Enlace de acción con flecha.
 *
 * Aparecía repetido media docena de veces con tamaños y colores ligeramente
 * distintos (17px aquí, 16px allá, 15px más abajo). Unificarlo es de las cosas
 * que más ordenan visualmente sin que se sepa explicar por qué.
 */
export function ArrowLink({
  href,
  children,
  tone = "accent",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "accent" | "muted" | "light";
  className?: string;
}) {
  const tones = {
    accent: "text-coral hover:text-coral-dark",
    muted: "text-ink-muted hover:text-ink",
    light: "text-white/70 hover:text-white",
  };

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-[15px] font-medium transition-colors",
        tones[tone],
        className
      )}
    >
      {children}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-0.5"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
