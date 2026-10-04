"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { ProductDetail } from "@/types/catalog";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const data = await api.getProduct(slug);
        setProduct(data);
        setActiveImage(data.primary_image || (data.images.length > 0 ? data.images[0].image_url : null));
      } catch (err: any) {
        if (err.status === 404 || err.code === "not_found") {
          setNotFound(true);
        } else {
          setError(err.message || "Failed to load product details.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-lumera-primary mb-3" />
        <p className="text-sm text-lumera-text-muted">Loading formula details...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">Formula Not Found</h1>
        <p className="text-sm text-lumera-text-muted mb-6">
          The product you are looking for might have been retired or is currently unavailable.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-lumera-primary text-white text-sm font-medium hover:bg-lumera-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Alert variant="danger" title="Unable to Display Product">
          {error || "An unexpected error occurred while loading this product."}
        </Alert>
        <div className="mt-6 text-center">
          <Link href="/products" className="text-sm text-lumera-primary hover:underline">
            &larr; Return to catalog
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = Boolean(product.discount_price && product.discount_price !== product.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-lumera-text-muted mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border" />
        <Link href="/products" className="hover:text-foreground transition-colors">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Images */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-muted/30 border border-border/70 shadow-sm">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-lumera-cream to-muted/80">
                <span className="font-serif text-6xl font-light text-lumera-primary/20">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Badges on main image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {product.is_featured && (
                <Badge variant="primary" className="text-xs flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  Featured Formula
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="accent" className="text-xs font-semibold">
                  Promotional Offer
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`relative aspect-square w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img.image_url
                      ? "border-lumera-primary shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-start">
          <div className="mb-2">
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-xs font-semibold tracking-wider text-lumera-primary uppercase hover:underline"
            >
              {product.category.name}
            </Link>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-3 text-xs text-lumera-text-muted font-mono">
            <span>SKU: {product.sku}</span>
          </div>

          {/* Price authoritative display */}
          <div className="mt-6 flex items-baseline gap-3 pb-6 border-b border-border/70">
            <span className="font-serif text-3xl font-bold text-foreground">
              ${product.effective_price}
            </span>
            {hasDiscount && (
              <span className="text-base text-lumera-text-muted line-through font-serif">
                ${product.price}
              </span>
            )}
            <span className="text-xs text-lumera-text-muted">USD</span>
          </div>

          {/* Stock / Availability Status */}
          <div className="mt-6 flex items-center gap-2">
            {product.is_in_stock ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock ({product.stock_quantity} available)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-medium">
                <XCircle className="w-4 h-4" />
                <span>Currently Out of Stock</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-lumera-text-muted mb-2">
              Formula Details
            </h3>
            <div className="text-sm text-lumera-text leading-relaxed whitespace-pre-line">
              {product.description || "Crafted with pure active botanicals to soothe, repair, and protect your skin."}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-10 rounded-2xl bg-muted/40 border border-border/60 p-5 flex flex-col gap-3 text-xs text-lumera-text-muted">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-lumera-primary" />
              <span className="text-foreground font-medium">Dermatologist tested & cruelty-free</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-lumera-accent" />
              <span>Authoritative catalog pricing and verified real-time inventory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
