"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Category, ProductListItem } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CategoryPills } from "@/components/catalog/CategoryPills";
import { Alert } from "@/components/ui/Alert";
import { Loader2, PackageOpen, SlidersHorizontal } from "lucide-react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const orderingParam = searchParams.get("ordering") || "-created_at";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [ordering, setOrdering] = useState<string>(orderingParam);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [cats, prodsData] = await Promise.all([
          api.getCategories().catch(() => [] as Category[]),
          api.getProducts({
            category: activeCategory || undefined,
            ordering: ordering || undefined,
          }),
        ]);

        setCategories(cats);
        setProducts(prodsData.results);
        setTotalCount(prodsData.count);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load product catalog");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activeCategory, ordering]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 border-b border-border/60 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
          Product Catalog
        </h1>
        <p className="mt-2 text-sm text-lumera-text-muted">
          Clean, botanical skincare crafted to nurture your skin barrier.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <CategoryPills categories={categories} activeCategory={activeCategory} />

        <div className="flex items-center gap-2 self-end md:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-lumera-text-muted" />
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="text-xs rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-lumera-primary"
          >
            <option value="-created_at">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-8">
          <Alert variant="danger" title="Catalog Error">
            {error}
          </Alert>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-lumera-text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-lumera-primary mb-3" />
          <p className="text-sm">Curating formulas...</p>
        </div>
      ) : products.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <PackageOpen className="w-12 h-12 text-lumera-text-muted/60 mb-3" />
          <h3 className="font-serif text-lg font-medium text-foreground">No formulas found</h3>
          <p className="text-xs text-lumera-text-muted max-w-sm mt-1">
            {activeCategory
              ? "There are currently no products available in this category."
              : "Our catalog is currently being updated. Please check back shortly."}
          </p>
        </div>
      ) : (
        /* Product Grid */
        <div>
          <div className="text-xs text-lumera-text-muted mb-4 font-mono">
            Showing {products.length} of {totalCount} {totalCount === 1 ? "product" : "products"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-lumera-primary" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
