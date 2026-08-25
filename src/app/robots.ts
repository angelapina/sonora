import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Páginas privadas o sin valor de indexación. /buscar se permite
        // (es una landing útil) pero sus combinaciones de filtros no aportan
        // nada y generarían contenido duplicado infinito.
        disallow: [
          "/dashboard",
          "/cuenta",
          "/admin",
          "/api/",
          "/match/resultados",
          "/buscar?",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
