"use client";

import { RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectGrid } from "@/components/ProjectGrid";

const filters = [
  "Все",
  "Автосервис",
  "Шиномонтаж",
  "Детейлинг",
  "Кузовной ремонт",
  "Диагностика",
  "Техосмотр",
  "Автозапчасти",
  "Многостраничный сайт",
  "Лендинг",
  "SEO/AEO",
  "Быстрый запуск"
];

const businessTypeFilters = new Set([
  "Автосервис",
  "Шиномонтаж",
  "Детейлинг",
  "Кузовной ремонт",
  "Диагностика",
  "Техосмотр",
  "Автозапчасти"
]);

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return projects.filter((project) => {
      const haystack = [
        project.title,
        project.businessType,
        project.siteType,
        project.mainGoal,
        project.description,
        ...project.tags,
        ...project.seoFocus,
        ...project.aeoFocus
      ]
        .join(" ")
        .toLowerCase();

      const searchMatches = normalizedSearch === "" || haystack.includes(normalizedSearch);
      const filterMatches =
        activeFilter === "Все" ||
        (businessTypeFilters.has(activeFilter) && project.businessType === activeFilter) ||
        project.siteType === activeFilter ||
        (activeFilter === "SEO/AEO" &&
          [...project.tags, ...project.seoFocus, ...project.aeoFocus].some((item) => /seo|aeo/i.test(item))) ||
        (activeFilter === "Быстрый запуск" && project.tags.some((tag) => tag.includes("Быстрый")));

      return searchMatches && filterMatches;
    });
  }, [activeFilter, projects, search]);

  function resetFilters() {
    setActiveFilter("Все");
    setSearch("");
  }

  return (
    <div>
      <div className="surface rounded-lg p-4 md:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <span className="sr-only">Поиск по проектам</span>
            <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по названию, услуге или акценту"
              className="min-h-12 w-full rounded-lg border border-neutral-300 bg-white py-3 pl-12 pr-4 text-base text-neutral-950 transition-colors placeholder:text-neutral-400 focus:border-neutral-950"
            />
          </label>
          <button type="button" className="btn-secondary" onClick={resetFilters}>
            <RotateCcw aria-hidden="true" size={18} />
            Сбросить фильтры
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" aria-label="Фильтры проектов">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`min-h-11 rounded-full border px-4 text-sm font-bold transition-colors ${
                activeFilter === filter
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-[#ff5a1f]/30 hover:bg-[#fff0e8]"
              }`}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm font-semibold text-slate-700" role="status">
          Найдено проектов: {filteredProjects.length}
        </p>
      </div>

      <div className="mt-8">
        {filteredProjects.length > 0 ? (
          <ProjectGrid projects={filteredProjects} />
        ) : (
          <div className="surface rounded-lg p-8 text-center">
            <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">Ничего не найдено</h2>
            <p className="mt-3 text-slate-700">Сбросьте фильтры или оставьте заявку, чтобы мы подобрали структуру вручную.</p>
            <button type="button" className="btn-primary mt-6" onClick={resetFilters}>
              Показать все проекты
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
