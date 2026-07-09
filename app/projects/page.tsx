import Image from "next/image";
import { ArrowRight, BookOpenCheck, Layers3, SearchCheck, Sparkles, type LucideIcon } from "lucide-react";
import { Geist_Mono, Manrope } from "next/font/google";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import { CTASection } from "@/components/CTASection";
import { ProjectsClient } from "@/components/ProjectsClient";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { projectCategories, projects } from "@/data/projects";
import { breadcrumbJsonLd, createPageMetadata, projectsItemListJsonLd } from "@/lib/seo";
import { assetPath } from "@/lib/site-paths";

const projectsSans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--projects-font",
  display: "swap"
});

const projectsMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--projects-mono",
  display: "swap"
});

export const metadata = createPageMetadata({
  title: "120 рабочих кейсов сайтов для автосервисов - ДесмосАвто",
  description:
    "Каталог 120 рабочих проектов для СТО, шиномонтажей, детейлинга, кузовного ремонта, диагностики и автозапчастей. Получите демо-версию сайта за сутки без предоплаты.",
  path: "/projects"
});

const projectStats = [
  [String(projects.length), "рабочих проектов в каталоге"],
  [String(projectCategories.length), "типов автомобильных ниш"],
  ["24 часа", "на первую демо-версию"]
];

const readingCards: Array<{ title: string; text: string; Icon: LucideIcon }> = [
  {
    title: "Структура",
    text: "Первый экран, услуги, доверие, FAQ и форма заявки должны собираться в один путь.",
    Icon: Layers3
  },
  {
    title: "Подача",
    text: "Визуал и тексты должны быстро объяснять, почему сервису можно доверять.",
    Icon: BookOpenCheck
  },
  {
    title: "Поиск",
    text: "SEO и AEO-ответы помогают клиенту найти нужную услугу до звонка.",
    Icon: SearchCheck
  }
];

export default function ProjectsPage() {
  return (
    <div className={`${projectsSans.variable} ${projectsMono.variable} projects-showcase-page`}>
      <SeoJsonLd id="projects-itemlist-jsonld" data={projectsItemListJsonLd(projects)} />
      <SeoJsonLd
        id="projects-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Кейсы", path: "/projects" }
        ])}
      />

      <section className="projects-hero" data-projects-reveal>
        <div className="container-page projects-hero-grid">
          <div className="projects-hero-copy">
            <p className="projects-kicker">Кейсы ДесмосАвто</p>
            <h1>
              Сайты для автосервисов
            </h1>
            <p>
              120 рабочих кейсов: выберите нишу, посмотрите структуру и получите демо под ваш сервис за сутки.
            </p>
            <div className="projects-hero-actions">
              <CleanAnchorLink href="#lead-form" className="projects-primary-action">
                Демо за сутки
                <ArrowRight aria-hidden="true" size={18} />
              </CleanAnchorLink>
              <CleanAnchorLink href="#projects-catalog" className="projects-secondary-action">
                Смотреть каталог
              </CleanAnchorLink>
            </div>
          </div>

          <div className="projects-hero-model" aria-label="3D-модель структуры сайта для автосервиса">
            <Image
              src={assetPath("/images/projects-hero-3d-model.png")}
              alt=""
              fill
              priority
              className="projects-hero-model-image"
              sizes="(min-width: 1024px) 48vw, 92vw"
              unoptimized
            />
          </div>
        </div>

        <div className="container-page projects-stat-rail" aria-label="Ключевые числа каталога">
          {projectStats.map(([value, label]) => (
            <div key={label} className="projects-stat">
              <span>{value}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="projects-curator-section" aria-label="Как устроен каталог">
        <div className="container-page projects-curator-grid">
          <div className="projects-curator-copy" data-projects-reveal>
            <h2>Каталог работает как быстрый подбор структуры</h2>
            <p>
              Кейс показывает не только внешний вид. По нему видно, какие блоки снимают тревогу клиента и ведут к заявке.
            </p>
          </div>
          <div className="projects-curator-note" data-projects-reveal>
            <Sparkles aria-hidden="true" size={22} />
            <p>Берем близкий пример, меняем услуги, город, доказательства и сценарий формы под ваш бизнес.</p>
          </div>
        </div>
      </section>

      <section id="projects-catalog" className="projects-catalog-section">
        <div className="container-page">
          <ProjectsClient projects={projects} />
        </div>
      </section>

      <section className="projects-reading-section">
        <div className="container-page">
          <div className="projects-reading-head" data-projects-reveal>
            <h2>Что смотреть внутри кейса</h2>
            <p>Три вещи помогают понять, подойдет ли структура под ваш сервис.</p>
          </div>
          <div className="projects-reading-grid">
            {readingCards.map(({ title, text, Icon }) => (
              <div key={title} className="projects-reading-card" data-projects-reveal>
                <Icon aria-hidden="true" size={26} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Не нашли кейс под свой автосервис?"
        text="Оставьте имя и телефон, подберём ближайший рабочий проект и покажем демо-версию под ваши услуги, город и формат работы за сутки."
        submitLabel="Демо за сутки"
        source="projects-final"
      />
    </div>
  );
}
