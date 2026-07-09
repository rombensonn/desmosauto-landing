import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { services } from "@/data/services";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  serviceJsonLd,
  siteConfig,
  sitelinksItemListJsonLd
} from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Услуги ДесмосАвто — сайты для автосервисов, СТО и детейлинга",
  description:
    "Форматы сайтов для автосервиса, СТО, шиномонтажа, детейлинга, кузовного ремонта, диагностики, техосмотра и автозапчастей.",
  path: "/services"
});

function servicesCollectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Услуги ДесмосАвто",
    url: `${siteConfig.url}/services`,
    inLanguage: "ru-RU",
    description: "Форматы сайтов для автомобильного бизнеса.",
    hasPart: services.map((service) => ({
      "@type": "Service",
      name: service.title,
      description: service.description,
      url: `${siteConfig.url}/services/${service.id}`
    }))
  };
}

export default function ServicesPage() {
  return (
    <>
      <SeoJsonLd id="services-collection-jsonld" data={servicesCollectionJsonLd()} />
      <SeoJsonLd id="services-sitelinks-jsonld" data={sitelinksItemListJsonLd()} />
      <SeoJsonLd id="services-main-service-jsonld" data={serviceJsonLd()} />
      <SeoJsonLd
        id="services-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Услуги", path: "/services" }
        ])}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-page max-w-4xl">
          <p className="eyebrow">Услуги ДесмосАвто</p>
          <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-black leading-[1.02] text-neutral-950 md:text-6xl">
            Сайты для автосервисов и смежного автомобильного бизнеса
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg">
            Выберите формат: лендинг, многостраничный сайт, страница под шиномонтаж, детейлинг, кузовной ремонт,
            диагностику, техосмотр или автозапчасти.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Получить демо
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link href="/projects" className="btn-hero-secondary">
              Смотреть кейсы
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.id} className="surface rounded-lg p-6">
                <h2 className="font-[var(--font-heading)] text-2xl font-black leading-tight text-neutral-950">
                  <Link href={`/services/${service.id}`}>{service.title}</Link>
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-700">{service.description}</p>
                <ul className="mt-5 grid gap-2 text-sm font-bold text-neutral-700">
                  {service.included.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-[#ff5a1f]" size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={`/services/${service.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-neutral-950">
                  Подробнее
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Не знаете, какой формат сайта нужен?"
        text="Оставьте имя и телефон. Подберём ближайший формат под услуги, город, поток заявок и покажем демо-версию за сутки."
        submitLabel="Подобрать формат"
        source="services-final"
      />
    </>
  );
}
