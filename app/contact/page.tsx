import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { breadcrumbJsonLd, createPageMetadata, siteConfig } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Заявка на сайт для автосервиса — ДесмосАвто",
  description:
    "Оставьте имя и телефон, чтобы получить демо-версию сайта для автосервиса, СТО, шиномонтажа, детейлинга или диагностики за сутки.",
  path: "/contact"
});

function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Заявка на сайт для автосервиса",
    url: `${siteConfig.url}/contact`,
    inLanguage: "ru-RU",
    about: {
      "@type": "Service",
      name: "Разработка сайта для автосервиса"
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    }
  };
}

export default function ContactPage() {
  return (
    <>
      <SeoJsonLd id="contact-page-jsonld" data={contactPageJsonLd()} />
      <SeoJsonLd
        id="contact-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Заявка", path: "/contact" }
        ])}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">Заявка ДесмосАвто</p>
            <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-black leading-[1.02] text-neutral-950 md:text-6xl">
              Получить демо сайта для автосервиса за сутки
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg">
              Оставьте имя и телефон. Подберём структуру под ваш тип сервиса и покажем первую версию без предоплаты.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/services" className="btn-hero-secondary">
                Выбрать услугу
              </Link>
              <Link href="/projects" className="btn-hero-secondary">
                Смотреть кейсы
              </Link>
            </div>
          </div>

          <div className="surface rounded-lg p-6">
            <h2 className="font-[var(--font-heading)] text-2xl font-black text-neutral-950">Что подготовить</h2>
            <ul className="mt-5 grid gap-3 text-sm font-bold text-neutral-700">
              {["Тип сервиса", "Город или район", "Основные услуги", "Контакты", "Фото и примеры по возможности"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-[#ff5a1f]" size={17} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection
        title="Оставьте заявку"
        text="Мы свяжемся с вами и уточним, какой сайт нужен вашему автосервису."
        submitLabel="Получить демо за сутки"
        source="contact-page"
      />
    </>
  );
}
