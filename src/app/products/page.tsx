"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { Category, ProductListItem } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CategoryPills } from "@/components/catalog/CategoryPills";
import { Alert } from "@/components/ui/Alert";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { PackageOpen, SlidersHorizontal, Check } from "lucide-react";

import { MOCK_CATEGORIES, filterMockProducts } from "@/lib/mock-data";

const PAGE_SIZE = 12;

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category") || "";
  const orderingParam = searchParams.get("ordering") || "-created_at";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [ordering, setOrdering] = useState<string>(orderingParam);
  const [currentPage, setCurrentPage] = useState<number>(pageParam || 1);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state with URL params
  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
    setOrdering(searchParams.get("ordering") || "-created_at");
  }, [searchParams]);

  const loadData = useCallback(async (page: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [cats, prodsData] = await Promise.all([
        api.getCategories().catch(() => [] as Category[]),
        api
          .getProducts({
            category: activeCategory || undefined,
            ordering: ordering || undefined,
            page: page,
            page_size: PAGE_SIZE,
          })
          .catch(() => null),
      ]);

      const finalCats = cats && cats.length > 0 ? cats : MOCK_CATEGORIES;
      setCategories(finalCats);

      if (prodsData && prodsData.results && prodsData.results.length > 0) {
        let results = prodsData.results;
        if (inStockOnly) {
          results = results.filter((p) => p.is_in_stock);
        }
        if (append) {
          setProducts((prev) => [...prev, ...results]);
        } else {
          setProducts(results);
        }
        setTotalCount(prodsData.count);
      } else {
        // Fallback to mock data with filterMockProducts
        const fallback = filterMockProducts({
          category: activeCategory || undefined,
          ordering: ordering || undefined,
          page: page,
          page_size: PAGE_SIZE,
        });
        let results = fallback.results;
        if (inStockOnly) {
          results = results.filter((p) => p.is_in_stock);
        }
        if (append) {
          setProducts((prev) => [...prev, ...results]);
        } else {
          setProducts(results);
        }
        setTotalCount(fallback.count);
      }
    } catch {
      const fallback = filterMockProducts({
        category: activeCategory || undefined,
        ordering: ordering || undefined,
      });
      setCategories(MOCK_CATEGORIES);
      setProducts(fallback.results);
      setTotalCount(fallback.count);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, ordering, inStockOnly]);

  useEffect(() => {
    loadData(currentPage, false);
  }, [loadData, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadData(nextPage, true);
  };

  const handleOrderingChange = (newOrder: string) => {
    setOrdering(newOrder);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("ordering", newOrder);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const hasMore = products.length < totalCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: "Catalog" }]} />

      {/* Header */}
      <div className="border-b border-border/60 pb-4 sm:pb-6">
        <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-foreground tracking-tight">
          Product Catalog
        </h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-lumera-text-muted">
          Clean, botanical skincare crafted to nurture your skin barrier.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="w-full sm:w-auto overflow-hidden">
          <CategoryPills categories={categories} activeCategory={activeCategory} />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Quick In-Stock Toggle */}
          <button
            type="button"
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              inStockOnly
                ? "bg-lumera-primary text-white border-lumera-primary"
                : "border-border bg-card text-lumera-text-muted hover:text-lumera-text"
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${inStockOnly ? "border-white bg-white/20" : "border-border"}`}>
              {inStockOnly && <Check className="w-3 h-3 text-white" />}
            </div>
            <span>In Stock Only</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-lumera-text-muted shrink-0" />
            <select
              value={ordering}
              onChange={(e) => handleOrderingChange(e.target.value)}
              className="text-xs rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-lumera-primary min-h-[38px] cursor-pointer"
            >
              <option value="-created_at">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="danger" title="Catalog Error">
          {error}
        </Alert>
      )}

      {/* Loading state with Skeletons */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 sm:py-20 text-center px-4">
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
        <div className="space-y-6">
          <div className="text-xs text-lumera-text-muted font-mono">
            Showing {products.length} of {totalCount} {totalCount === 1 ? "product" : "products"}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.public_id || product.id} product={product} />
            ))}
          </div>

          {/* Pagination & Mobile Load More */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={loadingMore}
            totalItems={totalCount}
            currentCount={products.length}
          />
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="h-8 w-48 rounded bg-muted/40 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
