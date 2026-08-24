# Sonora — Marketplace de músicos y artistas

MVP funcional de una plataforma para descubrir y contratar músicos y artistas para
bodas, fiestas, restaurantes, hoteles y eventos corporativos. App full‑stack en
Next.js con base de datos real en producción.

- **Web en producción:** https://sonora-theta-eight.vercel.app
- **Repositorio:** https://github.com/angelapina/sonora

## Stack técnico

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **Prisma 6 + Postgres** (Prisma Postgres, provisionado vía integración de Vercel;
  `prisma/dev.db` con SQLite sigue funcionando en local si se prefiere, ver más abajo)
- **NextAuth (Auth.js) v5** con proveedor de credenciales (email + contraseña), sesión JWT
- **Framer Motion** para scroll storytelling y microinteracciones (reveals al hacer
  scroll, filas horizontales estilo Spotify, sección pinned con crossfade de fotos)
- **Zod** + **react-hook-form** para validación
- **Server Actions** de React 19 para todas las mutaciones (sin API REST intermedia,
  salvo `/api/upload` para subir ficheros y `/api/auth/[...nextauth]`)
- Tipografía: **Geist** (una sola familia, varios pesos), vía `next/font`
- Diseño: dirección minimalista Apple × Spotify — ver [Notas de diseño](#notas-de-diseño)

## Arquitectura de carpetas

```
src/
  app/                    # Rutas (App Router)
    (home) page.tsx       # Home
    buscar/                # Resultados + filtros
    musico/[slug]/         # Perfil público de músico
    login, registro/       # Autenticación
    dashboard/              # Panel del músico (protegido, rol MUSICIAN)
    cuenta/                 # Panel del cliente (protegido, rol CLIENT)
    admin/                  # Panel de administración (protegido, rol ADMIN)
    api/upload/              # Subida de ficheros (fotos/audio)
    api/auth/[...nextauth]/  # Endpoint de NextAuth
  components/             # Componentes UI y de feature (incluye reveal.tsx,
                          # horizontal-row.tsx, scroll-story.tsx para el scrollytelling)
  lib/
    data/                 # Funciones de lectura (Prisma) reutilizadas por varias páginas
    actions/               # Server Actions (mutaciones): auth, booking, favorites,
                            # reviews, musician (dashboard), admin
    prisma.ts              # Cliente Prisma singleton
    validations.ts          # Esquemas Zod compartidos
    taxonomy-data.ts        # Fuente única de tipos de artista / géneros / eventos /
                            # instrumentos / ciudades (con coordenadas para geolocalización)
  auth.ts                  # Configuración de NextAuth
  proxy.ts                 # Middleware (Next 16 renombró "middleware" a "proxy"):
                            # protege /dashboard, /cuenta y /admin por rol
prisma/
  schema.prisma            # Modelo de datos (provider postgresql)
  seed.ts                  # Seed con ~20 músicos realistas + usuarios demo
```

## Modelo de datos (resumen)

- `User` (CLIENT | MUSICIAN | ADMIN) — `MusicianProfile` 1:1 con el usuario músico
- Taxonomías en BD y gestionables desde `/admin`: `ArtistType`, `Genre`, `EventType`,
  `Instrument` (relación muchos‑a‑muchos con `MusicianProfile`)
- `Media` (foto | vídeo | audio), `AvailabilityBlock` (calendario simplificado),
  `BookingRequest` (solicitud de presupuesto) + `Message` (mensajería asociada),
  `Review` (con moderación `approved`), `Favorite`
- Campos ya presentes para monetización futura sin tocar el esquema:
  `MusicianProfile.plan` (free/premium), `featured`, `featuredUntil`
- Los "enum" (roles, estados, etc.) son `String` documentados y validados con Zod en
  la capa de aplicación en vez de `enum` de Prisma, para que el esquema sea portable
  entre proveedores sin reescribir migraciones.

## Cómo ejecutar el proyecto en local

Requiere Node.js 20.9+ (este entorno no tenía Node instalado; se dejó uno portátil en
`~/.local/node`, ya añadido al `PATH` en `~/.zshrc`/`~/.zshenv`, junto con `gh` y el
uso de `vercel` vía `npx`).

```bash
cd ~/Projects/sonora
npm install
npm run dev             # http://localhost:3000, usa DATABASE_URL de .env
```

`.env` ya apunta a la misma base Prisma Postgres que usa producción (útil para probar
con datos reales). Si prefieres una base local aislada, crea un `.env.local` con un
`DATABASE_URL` de SQLite (`file:./dev.db`) y cambia el `provider` en
`prisma/schema.prisma` de vuelta a `"sqlite"` antes de migrar.

Otros scripts:

```bash
npm run build       # prisma migrate deploy + next build (el mismo que corre Vercel)
npm run lint         # ESLint
npm run db:seed      # (re)genera los datos de ejemplo
npm run db:studio    # Prisma Studio, explorador visual de la BD
```

## Despliegue (ya configurado)

- **GitHub → Vercel:** proyecto `angie-b6eb/sonora` en Vercel, conectado a
  `npx vercel deploy --prod` (el auto-deploy en cada `git push` requiere enlazar
  GitHub como método de login en la cuenta de Vercel; hoy el deploy es manual vía CLI).
- **Base de datos:** Prisma Postgres, instalado como integración de marketplace de
  Vercel (`vercel integration add prisma/prisma-postgres`), con `DATABASE_URL`
  inyectado automáticamente en Production/Preview/Development.
- **Variables de entorno en Vercel:** `DATABASE_URL` / `POSTGRES_URL` /
  `PRISMA_DATABASE_URL` (de la integración), `AUTH_SECRET` (generado aparte para
  producción), `AUTH_TRUST_HOST=true`.
- Para desplegar una actualización manualmente:
  ```bash
  cd ~/Projects/sonora
  git push                      # sube el código
  npx vercel deploy --prod      # construye y publica
  ```

### Limitación conocida: subida de ficheros en producción

`/api/upload` (fotos y audio desde el dashboard de músico) escribe en
`public/uploads/` en disco local — funciona en desarrollo, pero el sistema de
ficheros de Vercel es efímero/de solo lectura en producción, así que **las subidas
fallarán en la web desplegada** (fallan con un error visible, no rompen el resto de
la app). Para arreglarlo en producción hace falta mover ese endpoint a un storage
real (Vercel Blob es la opción más directa dado que ya usamos integraciones de
Vercel; S3/Cloudinary también encajarían). Los vídeos por URL de YouTube no se ven
afectados.

## Cuentas de prueba (creadas por el seed)

| Rol      | Email                          | Contraseña    |
|----------|---------------------------------|---------------|
| Admin    | `admin@sonora.app`              | `Admin1234!`  |
| Cliente  | `cliente@ejemplo.com`           | `Cliente1234!`|
| Músico   | `marta-vidal@sonora.app` (o cualquier `<slug>@sonora.app`, ver tabla `MusicianProfile`) | `Musico1234!` |

## Funcionalidades implementadas (MVP)

- Home con hero minimalista, buscador (con geolocalización real vía navegador),
  sección de scroll storytelling (fotos a pantalla completa con crossfade por tipo
  de evento), categorías visuales y filas horizontales de músicos ("recomendados",
  "más contratados", "nuevos artistas")
- `/buscar`: filtros por tipo de artista, género, ciudad, tipo de evento y precio
  (acordeón colapsado por defecto en móvil); orden por relevancia/precio/valoración;
  paginación; destacados fijados arriba
- Perfil público de músico: hero, bio, vídeos (YouTube), galería de fotos, muestras de
  audio, géneros/instrumentos/eventos, disponibilidad, reseñas + formulario de reseña,
  formulario de solicitud de presupuesto, favoritos, redes sociales, barra de reserva
  fija en móvil
- Registro/login diferenciado (cliente vs músico) con NextAuth
- Dashboard de músico: resumen con checklist de perfil, editar perfil completo
  (incluye taxonomías), gestión de multimedia (subida de fotos/audio, vídeos por
  URL de YouTube — ver limitación de subidas en producción arriba), calendario de
  disponibilidad, bandeja de solicitudes con aceptar/rechazar/completar, mensajería
  por solicitud, listado de reseñas
- Panel de cliente (`/cuenta`): favoritos, mis solicitudes con mensajería
- Panel de administración: resumen, gestión de músicos (publicar/destacar), usuarios,
  moderación de reseñas (aprobar/rechazar)
- Menú móvil, diseño responsive de extremo a extremo

## Deliberadamente fuera del MVP (arquitectura lista para añadirlo)

Pagos/suscripciones (Stripe) y comisión por contratación, posiciones destacadas de
pago por ciudad, sincronización de calendario externo, chat en tiempo real
(websockets), notificaciones por email, storage real para subidas (ver arriba), i18n
completo a inglés (los textos ya están centralizados y la Home usa `es` por defecto),
SEO avanzado/sitemap, auto-deploy en cada push (requiere enlazar GitHub en Vercel).

## Notas de diseño

Dirección visual minimalista inspirada en Apple × Spotify: base blanco/negro/gris con
un único acento de marca (coral), tipografía Geist a varios pesos, radios sutiles,
sombras casi imperceptibles y mucho aire entre secciones. El scroll forma parte de la
narrativa (sección pinned con crossfade de fotos grandes, reveals progresivos al
entrar en viewport) y las listas de músicos usan filas de scroll horizontal al estilo
Spotify en vez de rejillas estáticas. Todo construido con Tailwind + componentes
propios en `src/components`, sin dependencia de una librería de UI de terceros.

<!-- auto-deploy verificado -->
