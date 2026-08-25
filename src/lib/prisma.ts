import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Limita el pool de cada cliente Prisma.
 *
 * Next.js prerenderiza con varios workers en paralelo y cada uno instancia su
 * propio PrismaClient; con el pool por defecto (nº_cpus * 2 + 1 conexiones cada
 * uno) se agota el límite de conexiones de Postgres durante el build. En
 * serverless pasa lo mismo con muchas lambdas concurrentes. Una conexión por
 * cliente es suficiente para nuestras consultas (cortas y secuenciales) y hace
 * el build y el runtime predecibles.
 */
function buildDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("connection_limit")) {
      parsed.searchParams.set("connection_limit", "1");
    }
    if (!parsed.searchParams.has("pool_timeout")) {
      parsed.searchParams.set("pool_timeout", "20");
    }
    return parsed.toString();
  } catch {
    return url; // si no parsea, dejamos que Prisma dé el error real
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: buildDatasourceUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
