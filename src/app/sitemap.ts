import type { MetadataRoute } from "next";
import { contentUrl, getContent } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/projects", "/essays", "/notes", "/about"];
  const pages = staticPages.map((pathname) => ({
    url: `${siteConfig.url}${pathname}`,
  }));
  const documents = getContent({ includeDrafts: false }).map((document) => ({
    url: `${siteConfig.url}${contentUrl(document)}`,
    lastModified: document.updated ?? document.date,
  }));

  return [...pages, ...documents];
}
