import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BottomNav } from "@/components/bottom-nav";
import { auth } from "@/auth";
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonora-theta-eight.vercel.app"
  ),
  title: {
    // El título por defecto es también el de la home: lleva delante las
    // palabras que la gente busca de verdad ("músicos para bodas") y deja la
    // marca al final, que es donde no compite por espacio en el snippet.
    default: "Músicos para bodas, fiestas y eventos de empresa | Sonora",
    template: "%s | Sonora",
  },
  description:
    "Contrata músicos y artistas en directo para tu boda, fiesta o evento de empresa. Escúchalos antes de reservar, compara precios reales y consulta su disponibilidad. Sin intermediarios.",
  openGraph: {
    siteName: "Sonora",
    locale: "es_ES",
    type: "website",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <BottomNav role={session?.user?.role ?? null} />
      </body>
    </html>
  );
}
