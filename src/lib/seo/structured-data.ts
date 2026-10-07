/**
 * Structured Data (JSON-LD) generator using authoritative backend data (ADR-0017).
 */
import { ProductDetail } from "@/types/catalog";
import { SITE_URL } from "./canonical";

export function generateProductJsonLd(product: ProductDetail, baseUrl = SITE_URL) {
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.is_primary)?.image_url || product.images[0].image_url
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: primaryImage,
    description: product.description || product.seo_description || product.name,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Lumera",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.effective_price,
      availability: product.is_in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${baseUrl}/products/${product.slug}`,
    },
  };
}
