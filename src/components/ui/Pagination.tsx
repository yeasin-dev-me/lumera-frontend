"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  totalItems?: number;
  currentCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  onLoadMore,
  hasMore = false,
  totalItems,
  currentCount,
}: PaginationProps) {
  if (totalPages <= 1 && !hasMore) return null;

  // Generate page numbers with ellipsis
  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6 w-full">
      {/* Mobile Load More pattern if supported */}
      {onLoadMore && hasMore && (
        <div className="w-full flex flex-col items-center gap-2 sm:hidden">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="secondary"
            className="w-full max-w-xs h-12 text-sm font-medium rounded-full border-lumera-primary/30 text-lumera-primary active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading More...
              </span>
            ) : (
              "Load More Products"
            )}
          </Button>
          {totalItems && currentCount && (
            <p className="text-xs text-lumera-text-muted">
              Showing {currentCount} of {totalItems} items
            </p>
          )}
        </div>
      )}

      {/* Standard desktop & mobile pagination bar */}
      <nav
        role="navigation"
        aria-label="Pagination Navigation"
        className="flex items-center justify-center gap-1.5 sm:gap-2 select-none"
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          aria-label="Previous Page"
          className="min-w-[40px] min-h-[40px] rounded-lg border border-border flex items-center justify-center text-lumera-text-muted hover:text-lumera-text hover:bg-surface-muted disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPages().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 text-center text-xs text-lumera-text-muted"
              >
                ...
              </span>
            );
          }

          const pageNum = Number(page);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
              aria-current={isActive ? "page" : undefined}
              className={`min-w-[40px] min-h-[40px] px-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-lumera-primary text-white shadow-sm"
                  : "border border-border text-lumera-text hover:bg-surface-muted"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          aria-label="Next Page"
          className="min-w-[40px] min-h-[40px] rounded-lg border border-border flex items-center justify-center text-lumera-text-muted hover:text-lumera-text hover:bg-surface-muted disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}
