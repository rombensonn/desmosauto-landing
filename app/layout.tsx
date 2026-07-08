import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { HashScrollGuard } from "@/components/HashScrollGuard";
import { Header } from "@/components/Header";
import { siteConfig } from "@/lib/seo";
import { assetPath } from "@/lib/site-paths";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ДесмосАвто — сайт для автосервиса за сутки без предоплаты",
    template: "%s"
  },
  description:
    "Покажем демо-версию сайта для автосервиса за сутки без предоплаты и обязательств. В портфеле 120 рабочих проектов для автомобильного бизнеса.",
  applicationName: "ДесмосАвто",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "ДесмосАвто",
    url: siteConfig.url,
    title: "ДесмосАвто — сайт для автосервиса за сутки без предоплаты",
    description:
      "Демо-версия сайта за сутки, 120 рабочих проектов и структура заявок для автосервисов.",
    images: ["/og/desmosauto-og.svg"]
  },
  icons: {
    icon: assetPath("/icon.svg")
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body className="font-[var(--font-body)] antialiased">
        <HashScrollGuard />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
