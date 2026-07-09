import type { Metadata } from "next";
import type { Project } from "@/data/projects";
import { defaultSiteUrl } from "@/lib/site-paths";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;

export const siteConfig = {
  name: "ДесмосАвто",
  alternateName: ["Десмосавто", "Десмос Авто", "DesmosAuto", "Desmos Auto"],
  url: rawSiteUrl.replace(/\/$/, ""),
  description:
    "Разрабатываем сайты и лендинги для автосервисов, СТО, шиномонтажей, детейлинга и смежного автомобильного бизнеса.",
  phone: "+7 999 579 60 03",
  email: ""
};

export const sitelinkPages = [
  {
    name: "Услуги",
    path: "/services",
    description: "Форматы сайтов для СТО, шиномонтажа, детейлинга, диагностики и автозапчастей."
  },
  {
    name: "Кейсы",
    path: "/projects",
    description: "120 рабочих примеров сайтов для автомобильного бизнеса."
  },
  {
    name: "SEO/AEO",
    path: "/aeo",
    description: "Структура сайта под поисковые системы, AI-поиск и быстрые ответы."
  },
  {
    name: "FAQ",
    path: "/faq",
    description: "Ответы на вопросы о демо, заявках, услугах, SEO и запуске сайта."
  },
  {
    name: "Заявка",
    path: "/contact",
    description: "Форма заявки на демо-версию сайта для автосервиса за сутки."
  }
];

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
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      areaServed: "RU",
      availableLanguage: "Russian"
    },
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Сайт для автосервиса за сутки",
        serviceType: "Разработка сайтов для автомобильного бизнеса"
      }
    }
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    inLanguage: "ru-RU"
  };
}

export function serviceJsonLd(service?: {
  title: string;
  description: string;
  id?: string;
}) {
  const name = service?.title || "Разработка сайтов для автосервисов";
  const url = service?.id ? `${siteConfig.url}/services/${service.id}` : siteConfig.url;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    url,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed: "RU",
    serviceType: "Создание лендингов и многостраничных сайтов для автомобильного бизнеса",
    description:
      service?.description ||
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

export function sitelinksItemListJsonLd(items = sitelinkPages) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Основные разделы сайта ДесмосАвто",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: item.description,
      url: `${siteConfig.url}${item.path}`
    }))
  };
}
