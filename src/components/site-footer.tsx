import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-ink text-cream/55">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold text-cream">Sonora</p>
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
      <div className="border-t border-white/[0.08] px-6 py-7 text-center text-xs text-cream/30">
        © {new Date().getFullYear()} Sonora. Proyecto MVP de demostración.
      </div>
    </footer>
  );
}
