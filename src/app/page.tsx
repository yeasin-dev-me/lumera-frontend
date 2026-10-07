"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api/client";
import { Category, ProductListItem } from "@/types/catalog";
import { StorefrontHomeContent, StorefrontConfig } from "@/types/content";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { track } from "@/lib/tracking";
import {
  CheckCircle2,
  Server,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Megaphone,
} from "lucide-react";

import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_HOME_CONTENT,
  MOCK_CONFIG,
} from "@/lib/mock-data";

export default function StorefrontHomePage() {
  const [healthStatus, setHealthStatus] = useState<string>("Checking...");
  const [backendConfig, setBackendConfig] = useState<StorefrontConfig | null>(null);
  const [homeContent, setHomeContent] = useState<StorefrontHomeContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [health, config, content, cats, prods] = await Promise.all([
        api.getHealth().catch(() => ({ status: "demo_mode" })),
        api.getConfig().catch(() => MOCK_CONFIG),
        api.getHomeContent().catch(() => MOCK_HOME_CONTENT),
        api.getCategories().catch(() => [] as Category[]),
        api.getProducts({ page_size: 4 }).catch(() => ({
          count: 0,
          results: [] as ProductListItem[],
          next: null,
          previous: null,
        })),
      ]);
      setHealthStatus(health.status);
      setBackendConfig(config || MOCK_CONFIG);
      setHomeContent(content || MOCK_HOME_CONTENT);
      setCategories(cats && cats.length > 0 ? cats : MOCK_CATEGORIES);
      setFeaturedProducts(
        prods && prods.results && prods.results.length > 0
          ? prods.results
          : (MOCK_PRODUCTS.slice(0, 4) as ProductListItem[])
      );
    } catch {
      setHealthStatus("demo_mode");
      setBackendConfig(MOCK_CONFIG);
      setHomeContent(MOCK_HOME_CONTENT);
      setCategories(MOCK_CATEGORIES);
      setFeaturedProducts(MOCK_PRODUCTS.slice(0, 4) as ProductListItem[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    track("page_view", { page: "home" });
  }, []);

  const announcement =
    homeContent?.announcement?.body ||
    homeContent?.announcement?.title ||
    backendConfig?.announcement_text;

  return (
    <div className="space-y-16 py-4">
      {/* Dynamic Announcement Bar */}
      {announcement && (
        <div className="rounded-full bg-lumera-cream/80 border border-lumera-primary/20 px-4 py-2 flex items-center justify-center gap-2 text-xs text-lumera-primary font-medium shadow-sm max-w-3xl mx-auto">
          <Megaphone className="w-3.5 h-3.5 text-lumera-primary shrink-0" />
          <span className="truncate">{announcement}</span>
          {homeContent?.announcement?.cta_url && homeContent?.announcement?.cta_label && (
            <Link
              href={homeContent.announcement.cta_url}
              className="underline font-semibold hover:opacity-80 shrink-0 ml-1"
            >
              {homeContent.announcement.cta_label}
            </Link>
          )}
        </div>
      )}

      {/* Hero Section — CMS Driven with Botanical Fallback */}
      {homeContent?.hero ? (
        <section className="relative overflow-hidden rounded-3xl bg-surface border border-border/70 p-8 sm:p-12 lg:p-16 max-w-6xl mx-auto shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-left">
              <Badge variant="accent" className="px-4 py-1 text-xs">
                Featured Editorial
              </Badge>
              <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-lumera-text leading-tight">
                {homeContent.hero.title}
              </h1>
              {homeContent.hero.body && (
                <p className="text-lumera-text-muted text-sm sm:text-base leading-relaxed">
                  {homeContent.hero.body}
                </p>
              )}
              <div className="pt-2 flex items-center gap-4">
                <Link
                  href={homeContent.hero.cta_url || "/products"}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lumera-primary text-white text-sm font-semibold hover:bg-lumera-primary-hover shadow-md transition-all hover:scale-105"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {homeContent.hero.cta_label || "Explore Collection"}
                </Link>
              </div>
            </div>
            {homeContent.hero.image_url && (
              <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border">
                <img
                  src={homeContent.hero.image_url}
                  alt={homeContent.hero.alt_text || homeContent.hero.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <Badge variant="accent" className="px-4 py-1 text-xs">
            Clean Botanical Formulations
          </Badge>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight text-lumera-text leading-tight">
            Pure botanicals for luminous, healthy skin.
          </h1>
          <p className="text-lumera-text-muted text-base sm:text-lg max-w-2xl mx-auto">
            Thoughtfully crafted formulas designed to nurture and fortify your skin barrier using
            clinically validated natural actives.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lumera-primary text-white text-sm font-semibold hover:bg-lumera-primary-hover shadow-md transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              Explore Catalog
            </Link>
          </div>
        </section>
      )}

      {/* Dynamic Promotional Banners */}
      {homeContent?.banners && homeContent.banners.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homeContent.banners.map((banner) => (
              <div
                key={banner.public_id}
                className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-lumera-accent font-semibold">
                    Special Feature
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-lumera-text">
                    {banner.title}
                  </h3>
                  {banner.body && (
                    <p className="text-xs text-lumera-text-muted leading-relaxed">
                      {banner.body}
                    </p>
                  )}
                </div>
                {banner.cta_label && (
                  <div>
                    <Link
                      href={banner.cta_url || "/products"}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-lumera-primary hover:underline"
                    >
                      <span>{banner.cta_label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Categories Grid */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">Shop by Category</h2>
              <p className="text-xs text-lumera-text-muted mt-1">
                Targeted botanical treatments for every skin need
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-lumera-primary flex items-center gap-1 hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center p-4 rounded-2xl border border-border/70 bg-card hover:border-lumera-primary/50 hover:shadow-lg transition-all text-center"
              >
                <div className="w-12 h-12 rounded-full bg-lumera-cream flex items-center justify-center mb-3 text-lumera-primary font-serif font-bold text-lg group-hover:scale-110 transition-transform">
                  {cat.name.charAt(0)}
                </div>
                <span className="font-serif text-sm font-medium text-foreground group-hover:text-lumera-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Featured Formulations
              </h2>
              <p className="text-xs text-lumera-text-muted mt-1">
                Our most loved, skin-rebalancing botanical products
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-lumera-primary flex items-center gap-1 hover:underline"
            >
              <span>See Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Editorial Content Sections (if configured) */}
      {homeContent?.sections && homeContent.sections.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 space-y-8">
          {homeContent.sections.map((sec) => (
            <div
              key={sec.public_id}
              className="rounded-3xl bg-muted/30 border border-border/60 p-8 sm:p-12 text-center space-y-4"
            >
              <Sparkles className="w-8 h-8 mx-auto text-lumera-primary" />
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-lumera-text">
                {sec.title}
              </h2>
              {sec.body && (
                <p className="text-xs sm:text-sm text-lumera-text-muted max-w-2xl mx-auto leading-relaxed">
                  {sec.body}
                </p>
              )}
              {sec.cta_label && (
                <div className="pt-2">
                  <Link
                    href={sec.cta_url || "/products"}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-lumera-primary text-lumera-primary text-xs font-semibold hover:bg-lumera-primary hover:text-white transition-colors"
                  >
                    <span>{sec.cta_label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Backend Integration Live Status Card */}
      <section className="max-w-2xl mx-auto px-4">
        <Card lifted className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-lumera-primary/10 text-lumera-primary">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lumera-text">Backend API Integration</h3>
                <p className="text-xs text-lumera-text-muted">
                  Validating Storefront ↔ Django REST API connection
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              isLoading={loading}
              onClick={loadData}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Ping API</span>
            </Button>
          </div>

          {error ? (
            <Alert variant="danger" title="Connection Failed">
              {error}
            </Alert>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <span className="text-xs text-lumera-text-muted">Health Endpoint</span>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-mono text-sm font-semibold capitalize text-lumera-text">
                    {healthStatus}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <span className="text-xs text-lumera-text-muted">Authoritative Currency</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm font-semibold text-lumera-text">
                    {backendConfig?.currency || "USD"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
