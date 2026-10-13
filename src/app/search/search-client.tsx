"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, Sparkles, ArrowLeft, RefreshCw, X } from "lucide-react";
import { api } from "@/lib/api/client";
import { filterMockProducts } from "@/lib/mock-data";
import { ProductListItem } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const POPULAR_TAGS = ["Cleanser", "Serum", "Moisturizer", "Oil", "Toner", "Peptides"];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [ordering, setOrdering] = useState("");
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchResults = useCallback(async (query: string, sort: string) => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        search: query.trim() || undefined,
        ordering: sort || undefined,
        page_size: 24,
      });
      setProducts(res.results || []);
      setTotalCount(res.count || (res.results ? res.results.length : 0));
    } catch {
      // Fallback to mock data with client search filtering
      const fallback = filterMockProducts({
        search: query.trim() || undefined,
        ordering: sort || undefined,
      });
      setProducts(fallback.results);
      setTotalCount(fallback.count);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchTerm(q);
    setActiveQuery(q);
    fetchResults(q, ordering);
  }, [searchParams, ordering, fetchResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Search" }]} />

      {/* Search Header Banner */}
      <div className="bg-gradient-to-br from-surface to-surface-muted/60 border border-border/80 rounded-2xl p-5 sm:p-8 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto space-y-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-lumera-text-muted" />
            <input
              type="search"
              inputMode="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, benefit, or ingredient..."
              className="w-full h-13 pl-12 pr-12 rounded-full border border-border bg-surface text-sm sm:text-base text-lumera-text placeholder:text-lumera-text-muted/70 focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 shadow-sm transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-4 p-1 rounded-full text-lumera-text-muted hover:text-lumera-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Tag Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
            <span className="text-xs text-lumera-text-muted shrink-0 font-medium">Quick tags:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                  activeQuery.toLowerCase() === tag.toLowerCase()
                    ? "bg-lumera-primary text-white"
                    : "bg-surface border border-border text-lumera-text hover:border-lumera-primary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Results Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-lg sm:text-xl font-serif font-medium text-lumera-text">
            {activeQuery ? (
              <>
                Search Results for <span className="text-lumera-primary italic">&ldquo;{activeQuery}&rdquo;</span>
              </>
            ) : (
              "All Botanical Formulations"
            )}
          </h1>
          <p className="text-xs sm:text-sm text-lumera-text-muted">
            {loading ? "Searching catalog..." : `${totalCount} ${totalCount === 1 ? "product" : "products"} found`}
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="search-sort" className="text-xs text-lumera-text-muted font-medium shrink-0">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="search-sort"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="h-10 pl-3 pr-8 rounded-lg border border-border bg-surface text-xs sm:text-sm text-lumera-text font-medium focus:outline-none focus:border-lumera-primary transition-colors appearance-none cursor-pointer"
            >
              <option value="">Featured / Relevance</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="-created_at">Newest First</option>
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-lumera-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product Grid / Loading / Empty State */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.public_id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border/80 bg-surface/60 py-16 px-4 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-lumera-cream border border-border flex items-center justify-center mx-auto text-lumera-primary">
            <Search className="w-6 h-6 opacity-60" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-lumera-text">
              No matching formulations found
            </h3>
            <p className="text-xs sm:text-sm text-lumera-text-muted max-w-sm mx-auto">
              We couldn&apos;t find any products matching &ldquo;{activeQuery}&rdquo;. Try another keyword or explore our full collection.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => {
                setSearchTerm("");
                router.push("/search");
              }}
              className="px-4 py-2.5 rounded-full border border-border bg-surface text-xs sm:text-sm font-medium text-lumera-text hover:bg-surface-muted transition-colors"
            >
              Clear Search
            </button>
            <Link
              href="/products"
              className="px-4 py-2.5 rounded-full bg-lumera-primary text-white text-xs sm:text-sm font-medium hover:bg-lumera-primary-hover transition-colors shadow-sm"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
