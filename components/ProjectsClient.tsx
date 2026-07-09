"use client";

import { RotateCcw, Search } from "lucide-react";
import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
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

const numberFormatter = new Intl.NumberFormat("ru-RU");

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
    <div className="projects-catalog">
      <div className="projects-filter-panel" data-projects-reveal>
        <div className="projects-filter-top">
          <div>
            <h2>Каталог проектов</h2>
            <p>Фильтруйте по нише, формату сайта, SEO/AEO и быстрому запуску.</p>
          </div>
          <motion.div
            className="projects-result-count"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            layout
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 340, damping: 26, mass: 0.9 }}
          >
            <AnimatedResultNumber value={filteredProjects.length} />
            <p>найдено</p>
          </motion.div>
        </div>

        <div className="projects-search-row">
          <label className="projects-search-field">
            <span>Поиск по каталогу</span>
            <span className="projects-search-input-wrap">
              <Search aria-hidden="true" size={20} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Название, город или услуга"
              />
            </span>
          </label>
          <button type="button" className="projects-reset-button" onClick={resetFilters}>
            <RotateCcw aria-hidden="true" size={18} />
            Сбросить
          </button>
        </div>

        <div className="projects-filter-scroll" aria-label="Фильтры проектов">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? "is-active" : ""}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-grid-wrap">
        {filteredProjects.length > 0 ? (
          <ProjectGrid projects={filteredProjects} />
        ) : (
          <div className="projects-empty-state">
            <h2>Ничего не найдено</h2>
            <p>Сбросьте фильтры или оставьте заявку, чтобы мы подобрали структуру вручную.</p>
            <button type="button" onClick={resetFilters}>
              Показать все проекты
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AnimatedResultNumber({ value }: { value: number }) {
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const previousValueRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = numberRef.current;

    if (!node) {
      return undefined;
    }

    if (reducedMotion) {
      node.textContent = numberFormatter.format(value);
      previousValueRef.current = value;
      return undefined;
    }

    node.textContent = numberFormatter.format(previousValueRef.current);

    const controls = animate(previousValueRef.current, value, {
      type: "spring",
      stiffness: 260,
      damping: 28,
      mass: 0.9,
      onUpdate: (latest) => {
        node.textContent = numberFormatter.format(Math.round(latest));
      }
    });

    previousValueRef.current = value;

    return () => controls.stop();
  }, [reducedMotion, value]);

  return (
    <>
      <span className="projects-result-number-animated" ref={numberRef} suppressHydrationWarning>
        {numberFormatter.format(0)}
      </span>
      <span className="projects-result-number-static">{numberFormatter.format(value)}</span>
    </>
  );
}
