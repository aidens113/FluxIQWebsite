import type { MetadataRoute } from "next";

// Marked static so the export always prerenders it to out/sitemap.xml. The
// site has four pages, and `lastModified` is left out so every build is identical.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://getfluxiq.com/", changeFrequency: "monthly", priority: 1 },
    { url: "https://getfluxiq.com/extension/", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://getfluxiq.com/privacy/", changeFrequency: "yearly", priority: 0.2 },
    { url: "https://getfluxiq.com/terms/", changeFrequency: "yearly", priority: 0.2 },
  ];
}
