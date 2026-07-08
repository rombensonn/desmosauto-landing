import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import { CTASection } from "@/components/CTASection";
import { ProjectsClient } from "@/components/ProjectsClient";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { projects } from "@/data/projects";
import { breadcrumbJsonLd, createPageMetadata, projectsItemListJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "120 рабочих кейсов сайтов для автосервисов — ДесмосАвто",
  description:
    "Каталог 120 рабочих проектов для СТО, шиномонтажей, детейлинга, кузовного ремонта, диагностики и автозапчастей. Получите демо-версию сайта за сутки без предоплаты.",
  path: "/projects"
});

export default function ProjectsPage() {
  return (
    <>
      <SeoJsonLd id="projects-itemlist-jsonld" data={projectsItemListJsonLd(projects)} />
      <SeoJsonLd
        id="projects-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Кейсы", path: "/projects" }
        ])}
      />

      <section className="pb-10 pt-10 md:pb-14 md:pt-14">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-end">
          <div>
            <p className="eyebrow">120 рабочих проектов</p>
            <h1 className="mt-6 max-w-4xl font-[var(--font-heading)] text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              120 рабочих кейсов сайтов для автосервисов
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700 md:text-xl">
              Собрали рабочие лендинги и многостраничные сайты для СТО, шиномонтажей, детейлинга, кузовного ремонта, диагностики, техосмотра и автозапчастей. Выберите близкий кейс — мы покажем демо-версию под ваш сервис за сутки.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CleanAnchorLink href="#lead-form" className="btn-primary">
                Получить демо за сутки
                <ArrowRight aria-hidden="true" size={18} />
              </CleanAnchorLink>
              <Link href="/" className="btn-secondary">
                Вернуться на главную
              </Link>
            </div>
          </div>
          <div className="surface rounded-lg p-5">
            <p className="text-sm font-bold uppercase text-[#a33510]">Что такое каталог кейсов</p>
            <p className="mt-3 leading-7 text-slate-700">
              Это база из 120 рабочих проектов. Она помогает быстрее выбрать структуру сайта под ваш автосервис и не начинать обсуждение с пустого листа.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <ProjectsClient projects={projects} />
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow">Как читать кейсы</p>
            <h2 className="mt-5 font-[var(--font-heading)] text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
              Это не просто галерея дизайна
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Каждый кейс показывает структуру под конкретную задачу автосервиса.",
              "По кейсу видно, какие блоки ведут клиента к заявке: услуги, доверие, FAQ, форма и мобильная подача.",
              "Для 120 опубликованных проектов доступны отдельные страницы с описанием и живой версией проекта."
            ].map((text) => (
              <div key={text} className="surface rounded-lg p-5">
                <BookOpenCheck aria-hidden="true" className="mb-5 text-[#ff5a1f]" size={26} />
                <p className="leading-7 text-slate-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Не нашли кейс под свой автосервис?"
        text="Оставьте имя и телефон — подберём ближайший рабочий проект и покажем демо-версию под ваши услуги, город и формат работы за сутки."
        submitLabel="Получить демо за сутки"
        source="projects-final"
      />
    </>
  );
}
