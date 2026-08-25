"use client";

/**
 * Palabras del titular que entran una a una.
 *
 * Es el tipo de animación que sí hace Apple: no un carrusel de texto, sino la
 * frase construyéndose al cargar con un desfase pequeño entre palabras. Da
 * sensación de precisión en lugar de sensación de banner.
 *
 * Devuelve solo los `<span>`, sin envoltorio: así el `<h1>` lo pone la página y
 * puede combinar esta parte estática con la palabra que rota.
 */
export function HeroWords({
  text,
  startDelayMs = 80,
  stepMs = 70,
}: {
  text: string;
  startDelayMs?: number;
  stepMs?: number;
}) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          // inline-block para que el transform del fade-up no rompa el flujo de
          // línea: cada palabra se anima como bloque pero maqueta como texto.
          className="motion-safe:animate-fade-up inline-block"
          style={{ animationDelay: `${startDelayMs + i * stepMs}ms` }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
