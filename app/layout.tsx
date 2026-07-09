import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { HashScrollGuard } from "@/components/HashScrollGuard";
import { Header } from "@/components/Header";
import { siteConfig } from "@/lib/seo";
import { assetPath } from "@/lib/site-paths";

const aaStetica = localFont({
  src: [
    {
      path: "../public/fonts/aa-stetica/aa-stetica-light.otf",
      weight: "300",
      style: "normal"
    },
    {
      path: "../public/fonts/aa-stetica/aa-stetica-light-italic.otf",
      weight: "300",
      style: "italic"
    },
    {
      path: "../public/fonts/aa-stetica/aa-stetica-regular.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../public/fonts/aa-stetica/aa-stetica-regular-italic.otf",
      weight: "400",
      style: "italic"
    },
    {
      path: "../public/fonts/aa-stetica/aa-stetica-medium.otf",
      weight: "500",
      style: "normal"
    },
    {
      path: "../public/fonts/aa-stetica/aa-stetica-medium-italic.otf",
      weight: "500",
      style: "italic"
    },
    {
      path: "../public/fonts/aa-stetica/aa-stetica-bold.otf",
      weight: "700",
      style: "normal"
    },
    {
      path: "../public/fonts/aa-stetica/aa-stetica-bold-italic.otf",
      weight: "700",
      style: "italic"
    },
    {
      path: "../public/fonts/aa-stetica/aa-stetica-black.otf",
      weight: "900",
      style: "normal"
    }
  ],
  variable: "--font-aa-stetica",
  display: "swap",
  fallback: ["Arial", "Helvetica Neue", "system-ui", "sans-serif"]
});

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
    icon: [
      {
        url: assetPath("/icon.svg"),
        type: "image/svg+xml",
        sizes: "any",
        media: "(prefers-color-scheme: light)"
      },
      {
        url: assetPath("/icon-light.svg"),
        type: "image/svg+xml",
        sizes: "any",
        media: "(prefers-color-scheme: dark)"
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" className={aaStetica.variable}>
      <body className="font-[var(--font-body)] antialiased">
        <HashScrollGuard />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
