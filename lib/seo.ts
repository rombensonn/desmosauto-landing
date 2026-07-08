import type { Metadata } from "next";
import type { Project } from "@/data/projects";
import { defaultSiteUrl } from "@/lib/site-paths";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;

export const siteConfig = {
  name: "ДесмосАвто",
  url: rawSiteUrl.replace(/\/$/, ""),
  description:
    "Разрабатываем сайты и лендинги для автосервисов, СТО, шиномонтажей, детейлинга и смежного автомобильного бизнеса.",
  phone: "+7 999 579 60 03",
  email: ""
};

type PageSeo = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({ title, description, path }: PageSeo): Metadata {
  const canonical = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: siteConfig.name,
      url: canonical,
      title,
      description,
      images: ["/og/desmosauto-og.svg"]
    }
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: []
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "ru-RU",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/projects?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Разработка сайтов для автосервисов",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed: "RU",
    serviceType: "Создание лендингов и многостраничных сайтов для автомобильного бизнеса",
    description:
      "Структура услуг, доверие, форма заявки, мобильная адаптация, SEO/AEO-основа и подготовка сайта к дальнейшему расширению."
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function projectsItemListJsonLd(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Рабочие кейсы сайтов для автосервисов",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      description: project.description,
      url: project.futureCaseReady
        ? `${siteConfig.url}/projects/${project.slug}`
        : `${siteConfig.url}/projects#${project.slug}`
    }))
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`
    }))
  };
}
