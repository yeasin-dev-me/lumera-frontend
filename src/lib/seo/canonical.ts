/**
 * Canonical URL utilities for deterministic SEO indexing (ADR-0017).
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://penguinmart.com";

export function getCanonicalUrl(path = ""): string {
  // Strip trailing query parameters, hash fragments, and tracking tokens
  const cleanPath = path.split("?")[0].split("#")[0];
  const normalized = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${SITE_URL}${normalized}`;
}
