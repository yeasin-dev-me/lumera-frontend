"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductListItem } from "@/types/catalog";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/lib/cart/cart-context";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, ShoppingBag, Heart, Check, Loader2 } from "lucide-react";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = Boolean(product.discount_price && product.discount_price !== product.price);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const toast = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const inWishlist = isInWishlist(product.public_id);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_in_stock || isAdding) return;

    setIsAdding(true);
    setCardError(null);
    try {
      const success = await addToCart(product.public_id, 1, {
        public_id: product.public_id,
        name: product.name,
        slug: product.slug,
        primary_image: product.primary_image,
        price: product.price,
        discount_price: product.discount_price,
        effective_price: product.effective_price,
        stock_quantity: product.stock_quantity,
        is_in_stock: product.is_in_stock,
      });
      if (success) {
        setJustAdded(true);
        toast.success(`Added ${product.name} to shopping bag.`);
        setTimeout(() => setJustAdded(false), 2000);
      }
    } catch (err: any) {
      const msg = err.message || "Could not add to cart";
      setCardError(msg);
      toast.error(msg);
      setTimeout(() => setCardError(null), 3000);
    } finally {
      setIsAdding(false);
    }
  }

  async function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisting) return;

    setIsWishlisting(true);
    try {
      await toggleWishlist(product.public_id);
      if (inWishlist) {
        toast.info(`Removed ${product.name} from wishlist.`);
      } else {
        toast.success(`Saved ${product.name} to wishlist.`);
      }
    } catch {
      // Ignored / handled in context
    } finally {
      setIsWishlisting(false);
    }
  }

  return (
    <div className="group relative flex flex-col rounded-xl sm:rounded-2xl border border-border/70 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-lumera-primary/40">
      {/* Image container */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-muted/40">
        <Link href={`/products/${product.slug}`} className="block h-full w-full relative">
          {product.primary_image ? (
            <Image
              src={product.primary_image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-lumera-cream to-muted/80 text-lumera-text-muted">
              <span className="font-serif text-2xl sm:text-3xl font-light text-lumera-primary/40">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </Link>

        {/* Badges on Top Left */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-1 z-10 pointer-events-none">
          {!product.is_in_stock && (
            <Badge variant="danger" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-semibold">
              Sold Out
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="accent" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-semibold">
              Sale
            </Badge>
          )}
          {product.is_featured && (
            <Badge variant="primary" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 flex items-center gap-1 font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Featured</span>
            </Badge>
          )}
        </div>

        {/* Wishlist Button on Top Right (min 40x40 touch target) */}
        <button
          onClick={handleToggleWishlist}
          disabled={isWishlisting}
          aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm active:scale-90 ${
            inWishlist
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-white/90 dark:bg-card/90 text-lumera-text-muted hover:text-rose-500 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 transition-colors ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="text-[10px] sm:text-xs font-semibold text-lumera-primary tracking-wider uppercase mb-1 truncate">
          {product.category?.name || "Skincare"}
        </div>

        <h3 className="font-serif text-xs sm:text-sm md:text-base font-medium text-foreground line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-lumera-primary transition-colors">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {/* Pricing & Add to Cart button */}
        <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
            <span className="font-serif text-sm sm:text-base lg:text-lg font-semibold text-lumera-text">
              ${product.effective_price}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-lumera-text-muted line-through">
                ${product.price}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.is_in_stock || isAdding}
            className={`inline-flex items-center justify-center gap-1 min-h-[34px] sm:min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              !product.is_in_stock
                ? "bg-muted text-lumera-text-muted cursor-not-allowed text-[10px]"
                : justAdded
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-lumera-primary text-white hover:bg-lumera-primary-hover shadow-sm"
            }`}
            title={product.is_in_stock ? "Add to cart" : "Out of stock"}
          >
            {isAdding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.is_in_stock ? "Add" : "Sold"}</span>
              </>
            )}
          </button>
        </div>

        {cardError && (
          <p className="mt-1.5 text-[10px] text-rose-600 font-medium">
            {cardError}
          </p>
        )}
      </div>
    </div>
  );
}
