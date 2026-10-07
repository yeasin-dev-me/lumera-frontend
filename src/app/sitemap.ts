import type { MetadataRoute } from "next";
import { api } from "@/lib/api/client";
import { SITE_URL } from "@/lib/seo/canonical";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const [categories, products] = await Promise.all([
      api.getCategories().catch(() => []),
      api.getProducts({ page_size: 100 }).catch(() => ({ count: 0, results: [], next: null, previous: null })),
    ]);

    for (const cat of categories) {
      routes.push({
        url: `${SITE_URL}/products?category=${encodeURIComponent(cat.slug)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const prod of products.results) {
      routes.push({
        url: `${SITE_URL}/products/${encodeURIComponent(prod.slug)}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  } catch {
    // Fail-safe: returns core static indexable routes if API is offline
  }

  return routes;
}
