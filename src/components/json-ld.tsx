/**
 * Inyecta datos estructurados. Acepta uno o varios objetos: cuando son varios
 * los envuelve en un `@graph`, que es la forma correcta de declarar entidades
 * relacionadas en una misma página sin repetir bloques `<script>`.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data.map(stripContext) }
    : data;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

/** Dentro de un `@graph` el `@context` va una sola vez, en la raíz. */
function stripContext(obj: object) {
  const rest = { ...(obj as Record<string, unknown>) };
  delete rest["@context"];
  return rest;
}
