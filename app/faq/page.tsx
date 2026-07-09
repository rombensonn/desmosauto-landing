import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { FAQ } from "@/components/FAQ";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { faqs } from "@/data/faqs";
import { breadcrumbJsonLd, createPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "FAQ ДесмосАвто — вопросы о сайтах для автосервисов",
  description:
    "Ответы на вопросы о демо-версии сайта, заявках, SEO/AEO, страницах услуг, обработке персональных данных и запуске сайта для автосервиса.",
  path: "/faq"
});

export default function FaqPage() {
  return (
    <>
      <SeoJsonLd id="faq-page-jsonld" data={faqJsonLd(faqs)} />
      <SeoJsonLd
        id="faq-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "FAQ", path: "/faq" }
        ])}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-page max-w-4xl">
          <p className="eyebrow">FAQ ДесмосАвто</p>
          <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-black leading-[1.02] text-neutral-950 md:text-6xl">
            Вопросы о сайтах для автосервисов
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg">
            Короткие ответы про демо, заявки, SEO/AEO, страницы услуг и запуск сайта.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Получить демо
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link href="/services" className="btn-hero-secondary">
              Смотреть услуги
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <FAQ items={faqs} />
        </div>
      </section>

      <CTASection
        title="Остался вопрос по сайту?"
        text="Оставьте имя и телефон. Ответим по формату сайта, демо-версии, заявкам и дальнейшему запуску."
        submitLabel="Задать вопрос"
        source="faq-final"
      />
    </>
  );
}
