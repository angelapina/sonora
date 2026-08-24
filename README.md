# Sonora — Marketplace de músicos y artistas

MVP funcional de una plataforma para descubrir y contratar músicos y artistas para
bodas, fiestas, restaurantes, hoteles y eventos corporativos. Construida como una app
full‑stack en Next.js con base de datos real (SQLite en desarrollo), pensada para
migrar a Postgres/producción sin rediseñar el modelo de datos.

## Stack técnico

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **Prisma 6 + SQLite** (`prisma/dev.db`) como base de datos de desarrollo
- **NextAuth (Auth.js) v5** con proveedor de credenciales (email + contraseña), sesión JWT
- **Framer Motion**-style microinteracciones vía utilidades Tailwind (`animate-fade-up`)
- **Zod** + **react-hook-form** para validación
- **Server Actions** de React 19 para todas las mutaciones (sin API REST intermedia,
  salvo `/api/upload` para subir ficheros y `/api/auth/[...nextauth]`)
- Fuentes: **Fraunces** (display/editorial) + **Manrope** (UI), vía `next/font`

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
  components/             # Componentes UI y de feature
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
  schema.prisma            # Modelo de datos
  seed.ts                  # Seed con ~20 músicos realistas + usuarios demo
```

## Modelo de datos (resumen)

- `User` (CLIENT | MUSICIAN | ADMIN) — `MusicianProfile` 1:1 con el usuario músico
- Taxonomías en BD y gestionables desde `/admin`: `ArtistType`, `Genre`, `EventType`,
  `Instrument` (relación muchos‑a‗muchos con `MusicianProfile`)
- `Media` (foto | vídeo | audio), `AvailabilityBlock` (calendario simplificado),
  `BookingRequest` (solicitud de presupuesto) + `Message` (mensajería asociada),
  `Review` (con moderación `approved`), `Favorite`
- Campos ya presentes para monetización futura sin tocar el esquema:
  `MusicianProfile.plan` (free/premium), `featured`, `featuredUntil`

SQLite no soporta `enum` ni arrays escalares de Prisma: los "enum" (roles, estados,
etc.) son `String` documentados y validados con Zod en la capa de aplicación; las
taxonomías multivalor son tablas de referencia con relaciones, no arrays.

## Cómo ejecutar el proyecto

Requiere Node.js 20.9+ (este entorno no tenía Node instalado; se dejó uno portátil en
`~/.local/node`, ya añadido al `PATH` en `~/.zshrc`/`~/.zshenv`).

```bash
cd ~/Projects/sonora
npm install                 # si hace falta reinstalar dependencias
npx prisma migrate dev      # aplica el esquema (ya aplicado)
npm run db:seed             # (re)genera los datos de ejemplo
npm run dev                 # http://localhost:3000
```

Otros scripts:

```bash
npm run build      # build de producción (verificado sin errores)
npm run lint        # ESLint
npm run db:studio   # Prisma Studio, explorador visual de la BD
```

## Cuentas de prueba (creadas por el seed)

| Rol      | Email                          | Contraseña    |
|----------|---------------------------------|---------------|
| Admin    | `admin@sonora.app`              | `Admin1234!`  |
| Cliente  | `cliente@ejemplo.com`           | `Cliente1234!`|
| Músico   | `marta-vidal@sonora.app` (o cualquier `<slug>@sonora.app`, ver tabla `MusicianProfile`) | `Musico1234!` |

## Funcionalidades implementadas (MVP)

- Home con hero, buscador (qué / dónde con geolocalización real vía navegador / tipo
  de evento), categorías visuales y secciones "cerca de ti", "más contratados",
  "nuevos artistas", "bodas", "corporativo"
- `/buscar`: filtros por tipo de artista, género, ciudad, tipo de evento y precio;
  orden por relevancia/precio/valoración; paginación; destacados fijados arriba
- Perfil público de músico: hero, bio, vídeos (YouTube), galería de fotos, muestras de
  audio, géneros/instrumentos/eventos, disponibilidad, reseñas + formulario de reseña,
  formulario de solicitud de presupuesto, favoritos, redes sociales
- Registro/login diferenciado (cliente vs músico) con NextAuth
- Dashboard de músico: resumen con checklist de perfil, editar perfil completo
  (incluye taxonomías), gestión de multimedia (subida real de fotos/audio, vídeos por
  URL de YouTube), calendario de disponibilidad, bandeja de solicitudes con
  aceptar/rechazar/completar, mensajería por solicitud, listado de reseñas
- Panel de cliente (`/cuenta`): favoritos, mis solicitudes con mensajería
- Panel de administración: resumen, gestión de músicos (publicar/destacar), usuarios,
  moderación de reseñas (aprobar/rechazar)
- Menú móvil, diseño responsive de extremo a extremo

## Deliberadamente fuera del MVP (arquitectura lista para añadirlo)

Pagos/suscripciones (Stripe) y comisión por contratación, posiciones destacadas de
pago por ciudad, sincronización de calendario externo, chat en tiempo real
(websockets), notificaciones por email, almacenamiento en S3/Cloudinary (hoy
`/public/uploads`), i18n completo a inglés (los textos ya están centralizados y la
Home usa `es` por defecto), SEO avanzado/sitemap.

## Notas de diseño

Paleta editorial (tinta/crema + acento coral + dorado), tipografía display serif
(Fraunces) + sans (Manrope), tarjetas foto‑protagonistas con microinteracciones,
secciones alternando fondo crema/tinta al estilo revista. Sin dependencia de un
único componente de terceros de UI: todo construido con Tailwind + componentes
propios en `src/components`.
