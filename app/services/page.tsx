import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, SearchCheck, TimerReset } from "lucide-react";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import { CTASection } from "@/components/CTASection";
import { GsapScrollExperience } from "@/components/GsapScrollExperience";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { ServicesGrid } from "@/components/ServicesGrid";
import { services } from "@/data/services";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  serviceJsonLd,
  siteConfig,
  sitelinksItemListJsonLd
} from "@/lib/seo";
import { assetPath } from "@/lib/site-paths";

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

const serviceModels: Record<string, string> = {
  "auto-service-landing": assetPath("/images/service-models/auto-service-landing.webp"),
  "sto-multipage": assetPath("/images/service-models/sto-multipage.webp"),
  "tire-service": assetPath("/images/service-models/tire-service.webp"),
  detailing: assetPath("/images/service-models/detailing.webp"),
  "body-repair": assetPath("/images/service-models/body-repair.webp"),
  diagnostics: assetPath("/images/service-models/diagnostics.webp"),
  inspection: assetPath("/images/service-models/inspection.webp"),
  "auto-parts": assetPath("/images/service-models/auto-parts.webp")
};

const heroStats = [
  ["8", "форматов под авто-нишу"],
  ["24 часа", "первая демо-версия"],
  ["120", "рабочих проектов"]
];

const proofItems = [
  "Лендинги и многостраничные сайты",
  "Структура услуг, цен и FAQ",
  "SEO/AEO-основа с первого дня",
  "Заявка: имя + телефон"
];

const formatGuide = [
  {
    icon: TimerReset,
    title: "Нужно быстро проверить спрос",
    text: "Начинаем с лендинга под одну услугу, направление или сезонную задачу."
  },
  {
    icon: ClipboardList,
    title: "Услуг много и нужна навигация",
    text: "Собираем многостраничную структуру под услуги, районы, бренды, FAQ и будущий поиск."
  },
  {
    icon: SearchCheck,
    title: "Важны ответы до звонка",
    text: "Показываем симптомы, этапы, гарантии, фото, цены от и следующий шаг к записи."
  }
];

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
      <GsapScrollExperience />

      <section className="services-index-hero" data-gsap-hero>
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(360px,0.78fr)] lg:items-center">
          <div className="max-w-3xl">
            <p className="eyebrow" data-gsap-hero-item>
              Услуги ДесмосАвто
            </p>
            <h1
              className="mt-5 max-w-3xl font-[var(--font-heading)] text-4xl font-black leading-[0.98] text-neutral-950 sm:text-5xl md:text-6xl"
              data-gsap-hero-item
            >
              Сайты для автосервисов{" "}
              <span className="serif-accent">под ваш формат</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg" data-gsap-hero-item>
              Подбираем структуру под СТО, шиномонтаж, детейлинг, кузовной ремонт, диагностику,
              техосмотр или автозапчасти. Сайт должен объяснять услуги, закрывать вопросы клиента и вести к заявке.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-gsap-hero-item>
              <CleanAnchorLink href="/services#lead-form" className="btn-primary">
                Получить демо за сутки
                <ArrowRight aria-hidden="true" size={18} />
              </CleanAnchorLink>
              <CleanAnchorLink href="/services#service-catalog" className="btn-hero-secondary">
                Выбрать формат
              </CleanAnchorLink>
            </div>
            <div className="services-index-stats" data-gsap-hero-item>
              {heroStats.map(([value, label]) => (
                <div key={label} className="services-index-stat">
                  <p>{value}</p>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="reference-hero-shell services-index-panel rounded-lg" aria-label="Что входит в сайт для автосервиса" data-gsap-hero-item>
            <div className="services-index-panel-media">
              <Image
                src={assetPath("/images/service-models/sto-multipage.webp")}
                alt=""
                width={640}
                height={460}
                className="services-index-panel-image"
                sizes="(min-width: 1024px) 34vw, 92vw"
                aria-hidden="true"
                unoptimized
                priority
              />
            </div>
            <div className="services-index-panel-copy">
              <p className="service-detail-label">Карта будущего сайта</p>
              <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-black leading-tight text-neutral-950">
                Услуги, доверие, цены, FAQ и короткая заявка в одной системе.
              </h2>
              <ul className="mt-5 grid gap-3">
                {proofItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-bold leading-6 text-neutral-700">
                    <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-[#ff5a1f]" size={17} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="reference-proof-strip" aria-label="Ключевые преимущества страницы услуг">
        <div className="container-page services-proof-grid">
          {proofItems.map((item) => (
            <div key={item} className="flex min-h-14 items-center gap-2 text-sm font-bold text-neutral-700">
              <CheckCircle2 aria-hidden="true" size={17} className="shrink-0 text-[#ff5a1f]" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="service-catalog" className="section-y" data-gsap-section>
        <div className="container-page">
          <div className="services-section-head" data-gsap-section-head>
            <div>
              <p className="eyebrow">Каталог форматов</p>
              <h2 className="mt-5 font-[var(--font-heading)] text-3xl font-black leading-[1.05] text-neutral-950 md:text-5xl">
                Не один шаблон, а формат под задачу сервиса
              </h2>
            </div>
            <p className="answer-box">
              Лендинг подходит для быстрого запуска отдельного направления. Многостраничный сайт нужен, когда
              важно развести услуги, бренды, районы, FAQ и будущие SEO/AEO-страницы.
            </p>
          </div>
          <ServicesGrid services={services} serviceModels={serviceModels} variant="list" />
        </div>
      </section>

      <section className="section-y reference-soft-section" data-gsap-section>
        <div className="container-page grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <div data-gsap-section-head>
            <p className="eyebrow">Как выбрать</p>
            <h2 className="mt-5 max-w-xl font-[var(--font-heading)] text-3xl font-black leading-[1.05] text-neutral-950 md:text-5xl">
              Отталкиваемся от того, как клиент ищет и выбирает сервис
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-neutral-700">
              У владельца СТО, шиномонтажа и детейлинга разные вопросы от клиентов. Поэтому структура сайта
              должна быть разной: где-то важны пакеты, где-то симптомы, где-то фото работ и гарантии.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3" data-gsap-card-group>
            {formatGuide.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="surface card-hover flex min-h-[260px] flex-col rounded-lg p-5" data-gsap-card>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#080808] text-white">
                    <Icon aria-hidden="true" size={21} />
                  </span>
                  <h3 className="mt-5 font-[var(--font-heading)] text-xl font-black leading-tight text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-neutral-700">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="examples" className="section-y reference-dark-section text-white" data-gsap-section>
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div data-gsap-section-head>
            <p className="eyebrow">Кейсы</p>
            <h2 className="mt-5 max-w-3xl font-[var(--font-heading)] text-3xl font-black leading-[1.05] text-white md:text-5xl">
              Формат проще выбрать, когда видно реальные сайты из авто-ниши
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
              В каталоге 120 рабочих проектов: СТО, шиномонтажи, диагностика, кузовной ремонт,
              детейлинг, магазины запчастей и смежные направления.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/projects" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-black text-neutral-950 transition hover:bg-[#ffd8c5]">
                Смотреть 120 кейсов
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <CleanAnchorLink href="/services#lead-form" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/22 bg-white/10 px-5 py-3 font-bold text-white transition hover:border-white/42 hover:bg-white/16">
                Подобрать формат
              </CleanAnchorLink>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1" data-gsap-card-group>
            {[
              ["120", "проектов для авто-бизнеса"],
              ["24 часа", "до первой демо-версии"]
            ].map(([value, label]) => (
              <div key={label} className="surface-dark rounded-lg p-5" data-gsap-card>
                <p className="font-[var(--font-heading)] text-4xl font-black text-white">{value}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-white/66">{label}</p>
              </div>
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
