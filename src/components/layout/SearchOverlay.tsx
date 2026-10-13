"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, ArrowRight } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Cleanser",
  "Hyaluronic Serum",
  "Barrier Cream",
  "Facial Oil",
  "Peptides",
  "Toner",
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleSelectPopular = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Penguin Mart"
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Header bar */}
      <div className="border-b border-border bg-surface px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <form onSubmit={handleSubmit} className="relative flex-1 flex items-center">
            <Search className="absolute left-3.5 w-5 h-5 text-lumera-text-muted" />
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Penguin Mart skincare, serums, cleansers..."
              className="w-full h-12 pl-11 pr-10 rounded-full border border-border bg-surface-muted/60 text-sm sm:text-base text-lumera-text placeholder:text-lumera-text-muted/70 focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search input"
                className="absolute right-3.5 p-1 rounded-full text-lumera-text-muted hover:text-lumera-text transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium text-lumera-text-muted hover:text-lumera-text min-h-[44px] flex items-center justify-center transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Suggested & Popular searches */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-6">
          {query.trim().length > 0 ? (
            <div>
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-surface hover:bg-surface-muted transition-colors text-left"
              >
                <span className="text-sm font-medium text-lumera-primary flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search for &ldquo;{query}&rdquo;
                </span>
                <ArrowRight className="w-4 h-4 text-lumera-text-muted" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lumera-text-muted mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-lumera-primary" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectPopular(term)}
                    className="px-3.5 py-2 rounded-full border border-border bg-surface hover:border-lumera-primary hover:text-lumera-primary text-xs sm:text-sm text-lumera-text transition-all active:scale-95 shadow-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
