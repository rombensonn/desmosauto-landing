import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { services } from "@/data/services";
import { breadcrumbJsonLd, createPageMetadata, serviceJsonLd } from "@/lib/seo";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.id
  }));
}

function getService(slug: string) {
  return services.find((service) => service.id === slug);
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {};
  }

  return createPageMetadata({
    title: `${service.title} — ДесмосАвто`,
    description: `${service.description} Демо-версия за сутки без предоплаты для автомобильного бизнеса.`,
    path: `/services/${service.id}`
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <SeoJsonLd id="service-jsonld" data={serviceJsonLd(service)} />
      <SeoJsonLd
        id="service-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Услуги", path: "/services" },
          { name: service.title, path: `/services/${service.id}` }
        ])}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="eyebrow">Услуга ДесмосАвто</p>
            <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-black leading-[1.02] text-neutral-950 md:text-6xl">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg">{service.description}</p>
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

          <div className="surface rounded-lg p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Подходит</p>
            <p className="mt-3 text-lg font-bold leading-8 text-neutral-950">{service.bestFor}</p>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          <article className="surface rounded-lg p-6">
            <h2 className="font-[var(--font-heading)] text-2xl font-black text-neutral-950">В составе</h2>
            <ul className="mt-5 grid gap-3 text-sm font-bold text-neutral-700">
              {service.included.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-[#ff5a1f]" size={17} />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="surface rounded-lg p-6">
            <h2 className="font-[var(--font-heading)] text-2xl font-black text-neutral-950">Что делаем</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-neutral-700">
              {service.workScope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="surface rounded-lg border-[#ffccb8] bg-[#fff7f2] p-6">
            <h2 className="font-[var(--font-heading)] text-2xl font-black text-neutral-950">Результат</h2>
            <p className="mt-5 text-base font-bold leading-8 text-neutral-800">{service.outcome}</p>
          </article>
        </div>
      </section>

      <CTASection
        title={`Хотите ${service.title.toLowerCase()}?`}
        text="Оставьте имя и телефон. Подготовим демо-версию под ваши услуги, город, доказательства и сценарий заявки."
        submitLabel={service.cta}
        source={`service-${service.id}`}
      />
    </>
  );
}
