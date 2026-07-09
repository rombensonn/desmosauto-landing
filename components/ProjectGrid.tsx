import type { Project } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectGrid({ projects, compact = false }: { projects: Project[]; compact?: boolean }) {
  return (
    <div className={compact ? "projects-grid projects-grid-compact" : "projects-grid"} data-gsap-card-group>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} compact={compact} />
      ))}
    </div>
  );
}
