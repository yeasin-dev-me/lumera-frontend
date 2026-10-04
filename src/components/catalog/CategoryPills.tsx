"use client";

import Link from "next/link";
import { Category } from "@/types/catalog";

interface CategoryPillsProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryPills({ categories, activeCategory }: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Link
        href="/products"
        className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
          !activeCategory
            ? "bg-lumera-primary text-white shadow-sm"
            : "bg-muted/60 text-lumera-text hover:bg-muted"
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
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "bg-lumera-primary text-white shadow-sm"
                : "bg-muted/60 text-lumera-text hover:bg-muted"
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
