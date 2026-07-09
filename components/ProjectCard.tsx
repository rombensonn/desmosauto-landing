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
    <article id={project.slug} className="projects-card" data-gsap-card data-projects-reveal>
      <ProjectPreview project={project} />
      <div className="projects-card-body">
        <div className="projects-card-meta">
          <span>{project.businessType}</span>
          <span>{project.siteType}</span>
          {project.city ? <span>{project.city}</span> : null}
        </div>
        <h3>
          {project.title}
        </h3>
        <p className="projects-card-goal">{project.mainGoal}</p>

        <div className="projects-card-tags">
          {visibleTags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className="projects-card-actions">
          {project.futureCaseReady ? (
            <Link href={`/projects/${project.slug}`} className="projects-card-primary">
              Открыть кейс
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          ) : (
            <CleanAnchorLink href={compact ? `/projects#${project.slug}` : "#lead-form"} className="projects-card-primary">
              {compact ? "Смотреть кейс" : "Похожий сайт"}
              <ArrowRight aria-hidden="true" size={18} />
            </CleanAnchorLink>
          )}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="projects-card-secondary"
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
    <div className="projects-card-preview" aria-hidden="true">
      {previewSrc ? (
        <div className="projects-card-image-wrap">
          <Image
            src={previewSrc}
            fill
            alt=""
            className="projects-card-image"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 42vw, 92vw"
            unoptimized
          />
        </div>
      ) : (
        <div className="projects-card-fallback">
          <MapPin aria-hidden="true" size={30} />
          <p>Превью готовится</p>
        </div>
      )}
      <span className="sr-only">Мини-превью сайта: {project.title}</span>
    </div>
  );
}
