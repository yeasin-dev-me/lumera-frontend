"use client";

import Link from "next/link";
import { Category } from "@/types/catalog";

interface CategoryPillsProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryPills({ categories, activeCategory }: CategoryPillsProps) {
  return (
    <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 scrollbar-none flex items-center gap-2 flex-nowrap scroll-smooth touch-pan-x">
      <Link
        href="/products"
        className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 active:scale-95 ${
          !activeCategory
            ? "bg-lumera-primary text-white shadow-sm"
            : "bg-muted/70 text-lumera-text hover:bg-muted"
        }`}
      >
        All Products
      </Link>
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 active:scale-95 ${
              isActive
                ? "bg-lumera-primary text-white shadow-sm"
                : "bg-muted/70 text-lumera-text hover:bg-muted"
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
