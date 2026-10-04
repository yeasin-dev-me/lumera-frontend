"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductListItem } from "@/types/catalog";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/lib/cart/cart-context";
import { Sparkles, ShoppingBag, Heart, Check, Loader2 } from "lucide-react";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = Boolean(product.discount_price && product.discount_price !== product.price);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

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
      const success = await addToCart(product.public_id, 1);
      if (success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    } catch (err: any) {
      setCardError(err.message || "Could not add to cart");
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
    } catch {
      // Ignored / handled in context
    } finally {
      setIsWishlisting(false);
    }
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-lumera-primary/5 hover:border-lumera-primary/30">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
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
        </Link>

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
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

        {/* Wishlist Button on Top Right */}
        <button
          onClick={handleToggleWishlist}
          disabled={isWishlisting}
          aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            inWishlist
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-white/80 dark:bg-card/80 text-lumera-text-muted hover:text-rose-500 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="text-xs font-medium text-lumera-primary tracking-wide uppercase mb-1">
          {product.category?.name || "Skincare"}
        </div>

        <h3 className="font-serif text-base sm:text-lg font-medium text-foreground line-clamp-1 group-hover:text-lumera-primary transition-colors">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Pricing & Add to Cart button */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-semibold text-lumera-text">
              ${product.effective_price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-lumera-text-muted line-through">
                ${product.price}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.is_in_stock || isAdding}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !product.is_in_stock
                ? "bg-muted text-lumera-text-muted cursor-not-allowed"
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
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.is_in_stock ? "Add" : "Sold Out"}</span>
              </>
            )}
          </button>
        </div>

        {cardError && (
          <p className="mt-2 text-[11px] text-rose-600 font-medium animate-fadeIn">
            {cardError}
          </p>
        )}
      </div>
    </div>
  );
}
