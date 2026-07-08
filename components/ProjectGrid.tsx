import type { Project } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectGrid({ projects, compact = false }: { projects: Project[]; compact?: boolean }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" data-gsap-card-group>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} compact={compact} />
      ))}
    </div>
  );
}
