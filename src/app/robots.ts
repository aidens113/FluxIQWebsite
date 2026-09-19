import type { MetadataRoute } from "next";

// Marked static so the export always prerenders it to out/robots.txt.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://getfluxiq.com/sitemap.xml",
  };
}
