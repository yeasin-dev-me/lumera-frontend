import React, { Suspense } from "react";
import type { Metadata } from "next";
import SearchClient from "./search-client";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Search Botanical Skincare",
  description: "Search Penguin Mart's pure botanical skincare formulations, cleansers, serums, and barrier treatments.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 py-6">
          <div className="h-12 w-full max-w-2xl mx-auto rounded-full bg-muted/40 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
