import Link from "next/link";
import { ProductListItem } from "@/types/catalog";
import { Badge } from "@/components/ui/Badge";
import { Sparkles } from "lucide-react";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = Boolean(product.discount_price && product.discount_price !== product.price);

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-lumera-primary/5 hover:border-lumera-primary/30">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
        {product.primary_image ? (
          <img
            src={product.primary_image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-lumera-cream to-muted/80 text-lumera-text-muted">
            <span className="font-serif text-3xl font-light text-lumera-primary/30">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {!product.is_in_stock && (
            <Badge variant="danger" className="text-[10px] uppercase tracking-wider font-semibold">
              Sold Out
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="accent" className="text-[10px] uppercase tracking-wider font-semibold">
              Sale
            </Badge>
          )}
          {product.is_featured && (
            <Badge variant="primary" className="text-[10px] flex items-center gap-1 font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="text-xs font-medium text-lumera-primary tracking-wide uppercase mb-1">
          {product.category?.name || "Skincare"}
        </div>

        <h3 className="font-serif text-base sm:text-lg font-medium text-foreground line-clamp-1 group-hover:text-lumera-primary transition-colors">
          <Link href={`/products/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="font-serif text-lg font-semibold text-lumera-text">
            ${product.effective_price}
          </span>
          {hasDiscount && (
            <span className="text-xs text-lumera-text-muted line-through">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
