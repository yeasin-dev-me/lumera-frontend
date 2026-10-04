"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Loader2,
  Lock,
  Check,
} from "lucide-react";

export default function WishlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    wishlist,
    isLoading: wishlistLoading,
    addToCart,
    toggleWishlist,
    error,
    clearError,
  } = useCart();

  const [actionId, setActionId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  if (authLoading || (wishlistLoading && !wishlist)) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-lumera-accent" />
          <p className="text-sm text-lumera-text-muted">Loading your saved formulas...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">
          Sign In to Access Your Wishlist
        </h1>
        <p className="text-sm text-lumera-text-muted mb-8 max-w-md mx-auto">
          Save your favorite botanical formulas and skincare favorites across all your devices. Please sign in to view and manage your saved items.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login?redirect=wishlist"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-lumera-primary text-white text-sm font-semibold hover:bg-lumera-primary-hover transition-colors shadow-sm"
          >
            Sign In to Account
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  const items = wishlist?.items || [];
  const isEmpty = items.length === 0;

  async function handleAddToCart(productId: string) {
    setActionId(productId);
    clearError();
    try {
      const success = await addToCart(productId, 1);
      if (success) {
        setAddedIds((prev) => ({ ...prev, [productId]: true }));
        setTimeout(() => {
          setAddedIds((prev) => ({ ...prev, [productId]: false }));
        }, 2500);
      }
    } catch {
      // Handled in context
    } finally {
      setActionId(null);
    }
  }

  async function handleRemove(productId: string) {
    setActionId(productId);
    clearError();
    try {
      await toggleWishlist(productId);
    } catch {
      // Handled in context
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            My Wishlist
          </h1>
          <p className="text-sm text-lumera-text-muted mt-1">
            {isEmpty
              ? "Your wishlist is currently empty."
              : `${wishlist?.item_count || 0} ${
                  wishlist?.item_count === 1 ? "formula" : "formulas"
                } saved for future care.`}
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs text-lumera-primary hover:underline inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue browsing catalog</span>
        </Link>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mt-6">
          <Alert variant="danger" title="Wishlist Notice">
            {error}
          </Alert>
        </div>
      )}

      {/* Empty State */}
      {isEmpty ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
            No Saved Formulas Yet
          </h2>
          <p className="text-sm text-lumera-text-muted mb-8">
            Click the heart icon on any product in our catalog to save items to your personal wishlist.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lumera-primary text-white text-sm font-semibold hover:bg-lumera-primary-hover transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discover Skincare</span>
          </Link>
        </div>
      ) : (
        /* Wishlist Items Grid */
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isProcessing = actionId === item.product.public_id;
            const isAdded = Boolean(addedIds[item.product.public_id]);
            const isOutOfStock = !item.product.is_in_stock;

            return (
              <div
                key={item.product.public_id}
                className="group relative flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-lumera-primary/30"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
                  <Link href={`/products/${item.product.slug}`} className="block h-full w-full">
                    {item.product.primary_image ? (
                      <img
                        src={item.product.primary_image}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-lumera-cream text-lumera-primary font-serif text-2xl">
                        {item.product.name.charAt(0)}
                      </div>
                    )}
                  </Link>

                  {/* Stock Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                    {isOutOfStock ? (
                      <Badge variant="danger" className="text-[10px] uppercase font-semibold">
                        Sold Out
                      </Badge>
                    ) : item.product.discount_price ? (
                      <Badge variant="accent" className="text-[10px] uppercase font-semibold">
                        Sale
                      </Badge>
                    ) : null}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.product.public_id)}
                    disabled={isProcessing}
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-card/90 text-lumera-text-muted hover:text-rose-600 transition-colors shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-base sm:text-lg font-medium text-foreground line-clamp-1 group-hover:text-lumera-primary transition-colors">
                    <Link href={`/products/${item.product.slug}`}>
                      {item.product.name}
                    </Link>
                  </h3>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-lg font-semibold text-foreground">
                      ${item.product.effective_price}
                    </span>
                    {item.product.discount_price && (
                      <span className="text-xs text-lumera-text-muted line-through">
                        ${item.product.price}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-border/60 flex items-center gap-3">
                    <button
                      onClick={() => handleAddToCart(item.product.public_id)}
                      disabled={isOutOfStock || isProcessing}
                      className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold transition-all ${
                        isOutOfStock
                          ? "bg-muted text-lumera-text-muted cursor-not-allowed"
                          : isAdded
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-lumera-primary text-white hover:bg-lumera-primary-hover shadow-sm"
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
