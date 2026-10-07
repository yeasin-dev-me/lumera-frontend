import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/canonical";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/products/*", "/content/*"],
        disallow: [
          "/account",
          "/account/*",
          "/checkout",
          "/checkout/*",
          "/cart",
          "/login",
          "/register",
          "/api/*",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
