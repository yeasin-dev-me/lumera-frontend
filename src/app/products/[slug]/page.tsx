import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import { generateProductJsonLd } from "@/lib/seo/structured-data";
import { ProductDetailClient } from "./product-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await api.getProduct(slug);
    const title = product.seo_title || product.name;
    const description =
      product.seo_description ||
      product.description ||
      `Experience ${product.name} botanical formulation at Lumera.`;
    const image = product.images?.[0]?.image_url;

    return {
      title,
      description,
      alternates: {
        canonical: `/products/${product.slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        images: image ? [{ url: image, alt: product.name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return {
      title: "Product Detail",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let product;
  try {
    product = await api.getProduct(slug);
  } catch {
    // If backend is unavailable or not found
    return <ProductDetailClient />;
  }

  const jsonLd = generateProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
