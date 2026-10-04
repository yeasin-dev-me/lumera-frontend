"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api/client";
import { Category, ProductListItem } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CheckCircle2, Server, ArrowRight, Sparkles, RefreshCw, ShoppingBag } from "lucide-react";

export default function StorefrontHomePage() {
  const [healthStatus, setHealthStatus] = useState<string>("Checking...");
  const [backendConfig, setBackendConfig] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [health, config, cats, prods] = await Promise.all([
        api.getHealth(),
        api.getConfig(),
        api.getCategories().catch(() => [] as Category[]),
        api.getProducts({ page_size: 4 }).catch(() => ({ count: 0, results: [] as ProductListItem[], next: null, previous: null })),
      ]);
      setHealthStatus(health.status);
      setBackendConfig(config);
      setCategories(cats);
      setFeaturedProducts(prods.results);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(`Backend Error (${err.code}): ${err.message}`);
      } else {
        setError("Unable to communicate with the Backend API.");
      }
      setHealthStatus("unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 max-w-4xl mx-auto space-y-6">
        <Badge variant="accent" className="px-4 py-1 text-xs">
          Clean Botanical Formulations
        </Badge>
        <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight text-lumera-text leading-tight">
          Pure botanicals for luminous, healthy skin.
        </h1>
        <p className="text-lumera-text-muted text-base sm:text-lg max-w-2xl mx-auto">
          Thoughtfully crafted formulas designed to nurture and fortify your skin barrier using clinically validated natural actives.
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

      {/* Featured Categories Carousel / Grid */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">Shop by Category</h2>
              <p className="text-xs text-lumera-text-muted mt-1">Targeted botanical treatments for every skin need</p>
            </div>
            <Link href="/products" className="text-xs font-semibold text-lumera-primary flex items-center gap-1 hover:underline">
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
              <h2 className="font-serif text-2xl font-semibold text-foreground">Featured Formulations</h2>
              <p className="text-xs text-lumera-text-muted mt-1">Our most loved, skin-rebalancing botanical products</p>
            </div>
            <Link href="/products" className="text-xs font-semibold text-lumera-primary flex items-center gap-1 hover:underline">
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
