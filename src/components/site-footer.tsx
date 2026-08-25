import Link from "next/link";

export function SiteFooter() {
  // El colchón para la barra de navegación móvil (pb-16) vive aquí, no en
  // <main>: puesto en main pintaba una franja blanca entre el CTA oscuro y el
  // pie oscuro. En el footer, ese hueco tiene el mismo color que el bloque.
  return (
    <footer className="bg-ink pb-16 text-cream/55 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-14 pb-12 sm:grid-cols-2 sm:gap-12 sm:px-6 lg:grid-cols-4 lg:px-10">
        <div>
          <p className="text-[19px] font-semibold tracking-[-0.02em] text-white">Sonora</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            El marketplace para descubrir y contratar músicos y artistas para tu boda,
            evento o celebración.
          </p>
        </div>

        <div>
          <p className="text-[13px] font-medium text-cream/90">Para clientes</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/buscar" className="transition-colors hover:text-white">Buscar músicos</Link></li>
            <li><Link href="/buscar?eventType=boda" className="transition-colors hover:text-white">Música para bodas</Link></li>
            <li><Link href="/buscar?eventType=corporativo" className="transition-colors hover:text-white">Eventos corporativos</Link></li>
            <li><Link href="/como-funciona" className="transition-colors hover:text-white">Cómo funciona</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-medium text-cream/90">Para músicos</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/registro/musico" className="transition-colors hover:text-white">Crear perfil gratis</Link></li>
            <li><Link href="/precios" className="transition-colors hover:text-white">Planes y precios</Link></li>
            <li><Link href="/login" className="transition-colors hover:text-white">Acceder al dashboard</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-medium text-cream/90">Sonora</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/admin" className="transition-colors hover:text-white">Panel de administración</Link></li>
            <li><a href="mailto:hola@sonora.app" className="transition-colors hover:text-white">hola@sonora.app</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.08] px-5 py-7 text-center text-xs text-white/30 sm:px-6">
        © {new Date().getFullYear()} Sonora. Proyecto MVP de demostración.
      </div>
    </footer>
  );
}
