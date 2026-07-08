import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${siteConfig.url}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4
    },
    {
      url: `${siteConfig.url}/personal-data-consent`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4
    },
    ...projects
      .filter((project) => project.futureCaseReady)
      .map((project) => ({
        url: `${siteConfig.url}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.75
      }))
  ];
}
