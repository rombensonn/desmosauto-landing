import { ArrowRight, ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import type { Project } from "@/data/projects";
import { assetPath } from "@/lib/site-paths";

type ProjectCardProps = {
  project: Project;
  compact?: boolean;
};

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  const visibleTags = project.tags
    .filter((tag) => tag !== project.businessType && tag !== "Опубликован")
    .slice(0, compact ? 2 : 3);

  return (
    <article id={project.slug} className="surface card-hover flex h-full flex-col overflow-hidden rounded-lg" data-gsap-card>
      <ProjectPreview project={project} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <span className="tag">{project.businessType}</span>
          <span className="tag bg-white text-neutral-700">{project.siteType}</span>
          <span className="tag bg-[#fff0e8] text-[#a33510]">#{project.id}</span>
        </div>
        <h3 className="mt-4 font-[var(--font-heading)] text-xl font-black leading-tight text-neutral-950">
          {project.title}
        </h3>
        <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600">{project.mainGoal}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.city ? (
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-neutral-100 px-3 text-xs font-bold text-neutral-800">
              <MapPin aria-hidden="true" size={14} />
              {project.city}
            </span>
          ) : null}
          {visibleTags.map((tag) => (
            <span key={tag} className="inline-flex min-h-8 items-center rounded-full bg-neutral-100 px-3 text-xs font-bold text-neutral-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          {project.futureCaseReady ? (
            <Link href={`/projects/${project.slug}`} className="btn-primary w-full">
              Открыть кейс
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          ) : (
            <CleanAnchorLink href={compact ? `/projects#${project.slug}` : "#lead-form"} className="btn-secondary w-full">
              {compact ? "Смотреть кейс" : "Получить похожий сайт"}
              <ArrowRight aria-hidden="true" size={18} />
            </CleanAnchorLink>
          )}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 text-sm font-bold text-neutral-800 transition-colors hover:border-neutral-950 hover:bg-neutral-50"
            >
              Открыть сайт
              <ExternalLink aria-hidden="true" size={16} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  const previewSrc = project.liveUrl ? assetPath(`/project-previews/${project.slug}.jpg`) : null;

  return (
    <div className="overflow-hidden border-b border-neutral-200 bg-white" aria-hidden="true">
      {previewSrc ? (
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={previewSrc}
            fill
            alt=""
            className="object-contain object-top"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 42vw, 92vw"
            unoptimized
          />
        </div>
      ) : (
        <div className="aspect-[16/10]">
          <div className="flex h-8 items-center justify-between bg-neutral-950 px-3">
            <span className="h-2 w-20 rounded-full bg-[#ff5a1f]/80" />
            <span className="h-2 w-10 rounded-full bg-white/20" />
          </div>
          <div className="grid gap-3 bg-white p-4">
            <div className="h-4 w-24 rounded-full bg-neutral-100" />
            <div className="h-6 w-4/5 rounded bg-neutral-900" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-14 rounded-md bg-[#fff0e8] ring-1 ring-neutral-200" />
              <div className="h-14 rounded-md bg-neutral-50 ring-1 ring-neutral-200" />
              <div className="h-14 rounded-md bg-[#fff0e8] ring-1 ring-neutral-200" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="h-10 flex-1 rounded-full bg-neutral-950" />
              <div className="h-10 w-16 rounded-full bg-neutral-100" />
            </div>
          </div>
        </div>
      )}
      <span className="sr-only">Мини-превью сайта: {project.title}</span>
    </div>
  );
}
