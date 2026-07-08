import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, GitBranch, MonitorUp, ShieldCheck } from "lucide-react";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import { CTASection } from "@/components/CTASection";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { getProjectBySlug, projects } from "@/data/projects";
import { breadcrumbJsonLd, createPageMetadata, siteConfig } from "@/lib/seo";

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects
    .filter((project) => project.futureCaseReady)
    .map((project) => ({
      slug: project.slug
    }));
}

export async function generateMetadata({ params }: CasePageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return createPageMetadata({
    title: `${project.title} — кейс сайта для автосервиса`,
    description: `${project.description} Откройте описание кейса и опубликованную версию проекта.`,
    path: `/projects/${project.slug}`
  });
}

export default async function ProjectCasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.futureCaseReady || !project.caseData) {
    notFound();
  }

  const caseJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${siteConfig.url}/projects/${project.slug}`,
    workExample: project.liveUrl,
    about: project.businessType
  };

  return (
    <>
      <SeoJsonLd id={`${project.slug}-case-jsonld`} data={caseJsonLd} />
      <SeoJsonLd
        id={`${project.slug}-breadcrumb-jsonld`}
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Кейсы", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` }
        ])}
      />

      <section className="pb-10 pt-8 md:pb-14 md:pt-12">
        <div className="container-page">
          <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 font-bold text-[#a33510] transition-colors hover:text-neutral-950">
            <ArrowLeft aria-hidden="true" size={18} />
            Вернуться к кейсам
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="tag">{project.businessType}</span>
                <span className="tag bg-white text-slate-700">{project.siteType}</span>
                <span className="tag border-[#ff5a1f]/25 bg-[#fff0e8] text-[#a33510]">{project.status}</span>
              </div>
              <h1 className="mt-6 font-[var(--font-heading)] text-4xl font-black leading-tight text-slate-950 md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">{project.mainGoal}.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                    Открыть опубликованный проект
                    <ExternalLink aria-hidden="true" size={18} />
                  </a>
                ) : null}
                <CleanAnchorLink href="#lead-form" className="btn-secondary">
                  Получить похожий сайт
                  <ArrowRight aria-hidden="true" size={18} />
                </CleanAnchorLink>
              </div>
            </div>

            <div className="surface overflow-hidden rounded-lg">
              <div className="flex items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-950 px-4 py-3 text-white">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <MonitorUp aria-hidden="true" size={18} className="text-[#ffb08a]" />
                  Опубликованная версия
                </div>
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-white/72 transition-colors hover:text-white">
                    Опубликован
                  </a>
                ) : null}
              </div>
              {project.liveUrl ? (
                <iframe
                  src={project.liveUrl}
                  title={`Опубликованный проект: ${project.title}`}
                  className="h-[520px] w-full bg-white"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-5 lg:grid-cols-3">
          {[
            ["Контекст", project.caseData.clientContext],
            ["Проблема", project.caseData.problem],
            ["Решение", project.caseData.solution]
          ].map(([title, text]) => (
            <article key={title} className="surface rounded-lg p-5">
              <ShieldCheck aria-hidden="true" className="mb-5 text-[#ff5a1f]" size={26} />
              <h2 className="font-[var(--font-heading)] text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-700">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Что внутри кейса</p>
            <h2 className="mt-5 font-[var(--font-heading)] text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
              Структура, которая ведет к заявке
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              Кейс показывает не только визуальный пример, но и смысловую механику: какие блоки объясняют услугу, где возникает доверие и как клиент переходит к обращению.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <CaseList title="Структура страницы" items={project.caseData.structure} />
            <CaseList title="SEO-опора" items={project.caseData.seoPlan} />
            <CaseList title="AEO-ответы" items={project.caseData.aeoPlan} />
            <article className="surface rounded-lg p-5">
              <h3 className="font-[var(--font-heading)] text-xl font-bold text-slate-950">Форма и мобильная логика</h3>
              <p className="mt-3 leading-7 text-slate-700">{project.caseData.leadFormLogic}</p>
              <p className="mt-3 leading-7 text-slate-700">{project.caseData.mobileLogic}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="surface rounded-lg p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow">Итог</p>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                  {project.caseData.result}
                </p>
              </div>
              {project.repositoryUrl ? (
                <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="btn-secondary shrink-0">
                  Репозиторий проекта
                  <GitBranch aria-hidden="true" size={18} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Получите похожий сайт за сутки"
        text="Оставьте заявку — подберем ближайший реальный кейс, адаптируем структуру под ваши услуги и покажем демо-версию без предоплаты."
        submitLabel="Получить демо за сутки"
        source={`case-${project.slug}`}
      />
    </>
  );
}

function CaseList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="surface rounded-lg p-5">
      <h3 className="font-[var(--font-heading)] text-xl font-bold text-slate-950">{title}</h3>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-7 text-slate-700">
            <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#ff5a1f]" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
