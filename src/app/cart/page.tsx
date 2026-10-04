"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Lock,
} from "lucide-react";

export default function CartPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    cart,
    isLoading: cartLoading,
    isCartActionLoading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    clearError,
  } = useCart();

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (authLoading || (cartLoading && !cart)) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-lumera-primary" />
          <p className="text-sm text-lumera-text-muted">Loading your curated cart...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-lumera-primary/10 text-lumera-primary flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">
          Sign In to Access Your Cart
        </h1>
        <p className="text-sm text-lumera-text-muted mb-8 max-w-md mx-auto">
          Your shopping cart is securely protected. Please sign in to view your items, check real-time stock, and continue shopping.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login?redirect=cart"
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

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  async function handleQtyChange(productId: string, currentQty: number, delta: number, maxStock: number) {
    const target = currentQty + delta;
    if (target < 1 || target > 20 || target > maxStock) return;
    setUpdatingId(productId);
    clearError();
    try {
      await updateQuantity(productId, target);
    } catch {
      // Error handled in context
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(productId: string) {
    setUpdatingId(productId);
    clearError();
    try {
      await removeFromCart(productId);
    } catch {
      // Error handled in context
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-lumera-text-muted mt-1">
            {isEmpty
              ? "Your cart is currently empty."
              : `${cart?.item_count || 0} ${
                  cart?.item_count === 1 ? "item" : "items"
                } reserved with authoritative backend pricing.`}
          </p>
        </div>

        {!isEmpty && (
          <button
            onClick={() => clearCart()}
            disabled={isCartActionLoading}
            className="text-xs text-lumera-text-muted hover:text-rose-600 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        )}
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mt-6">
          <Alert variant="danger" title="Cart Notice">
            {error}
          </Alert>
        </div>
      )}

      {/* Empty State */}
      {isEmpty ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-muted/60 text-lumera-text-muted flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-lumera-text-muted mb-8">
            You haven&apos;t added any skincare formulas yet. Explore our high-performance botanicals and elixirs.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lumera-primary text-white text-sm font-semibold hover:bg-lumera-primary-hover transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      ) : (
        /* Cart Content Grid */
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Items Column */}
          <div className="lg:col-span-8 space-y-4">
            {cart?.has_unavailable_items && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Some items in your cart are currently out of stock or unavailable. They have been excluded from your subtotal. Please remove them to proceed cleanly.
                </span>
              </div>
            )}

            <div className="divide-y divide-border border border-border/80 rounded-2xl bg-card overflow-hidden shadow-sm">
              {items.map((item) => {
                const isItemUpdating = updatingId === item.product.public_id;
                const isOutOfStock = !item.is_purchasable;
                const maxStock = item.product.stock_quantity;

                return (
                  <div
                    key={item.product.public_id}
                    className={`p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-opacity ${
                      isItemUpdating ? "opacity-60" : "opacity-100"
                    } ${isOutOfStock ? "bg-muted/20" : ""}`}
                  >
                    {/* Product info & image */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="relative aspect-square w-20 sm:w-24 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/60">
                        {item.product.primary_image ? (
                          <img
                            src={item.product.primary_image}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-lumera-cream text-lumera-primary font-serif text-xl">
                            {item.product.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-base sm:text-lg font-medium text-foreground truncate hover:text-lumera-primary transition-colors">
                          <Link href={`/products/${item.product.slug}`}>
                            {item.product.name}
                          </Link>
                        </h3>

                        <div className="mt-1 flex items-center gap-2 text-xs text-lumera-text-muted">
                          <span>Unit Price: ${item.unit_price}</span>
                          {item.product.discount_price && (
                            <Badge variant="accent" className="text-[10px] py-0 px-1.5">
                              Sale
                            </Badge>
                          )}
                        </div>

                        {/* Availability badge */}
                        <div className="mt-2">
                          {item.availability_status === "available" ? (
                            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              In Stock
                            </span>
                          ) : item.availability_status === "insufficient_stock" ? (
                            <span className="text-[11px] font-medium text-amber-600">
                              Only {item.product.stock_quantity} remaining
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-rose-600">
                              Currently Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-border rounded-full bg-background p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleQtyChange(
                              item.product.public_id,
                              item.quantity,
                              -1,
                              maxStock
                            )
                          }
                          disabled={item.quantity <= 1 || isItemUpdating || isCartActionLoading}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQtyChange(
                              item.product.public_id,
                              item.quantity,
                              1,
                              maxStock
                            )
                          }
                          disabled={
                            item.quantity >= 20 ||
                            item.quantity >= maxStock ||
                            isItemUpdating ||
                            isCartActionLoading
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="font-serif text-base sm:text-lg font-semibold text-foreground">
                          ${item.line_total}
                        </span>
                        <div className="text-[10px] text-lumera-text-muted">
                          {cart?.currency}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(item.product.public_id)}
                        disabled={isItemUpdating || isCartActionLoading}
                        className="p-1.5 text-lumera-text-muted hover:text-rose-600 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="text-xs text-lumera-primary hover:underline inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue browsing catalog</span>
              </Link>
            </div>
          </div>

          {/* Authoritative Order Summary Column */}
          <div className="lg:col-span-4">
            <Card className="p-6 sm:p-8 bg-card border-border shadow-sm sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <dl className="space-y-4 text-sm">
                <div className="flex justify-between text-lumera-text-muted">
                  <dt>Items ({cart?.item_count || 0})</dt>
                  <dd className="font-mono text-foreground">${cart?.subtotal || "0.00"}</dd>
                </div>

                <div className="flex justify-between text-lumera-text-muted">
                  <dt>Shipping</dt>
                  <dd className="text-xs text-lumera-text-muted italic">
                    Calculated at checkout
                  </dd>
                </div>

                <div className="flex justify-between text-lumera-text-muted">
                  <dt>Taxes</dt>
                  <dd className="text-xs text-lumera-text-muted italic">
                    Calculated at checkout
                  </dd>
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-baseline">
                  <dt className="font-serif text-lg font-semibold text-foreground">
                    Estimated Total
                  </dt>
                  <dd className="font-serif text-2xl font-bold text-foreground">
                    ${cart?.total || "0.00"}
                  </dd>
                </div>
              </dl>

              {/* Checkout Button: Intentionally marked not implemented per Step 5 boundaries */}
              <div className="mt-8 space-y-3">
                <Button
                  className="w-full py-3.5 text-sm font-semibold rounded-full justify-center gap-2 opacity-90 cursor-not-allowed"
                  disabled
                  title="Checkout will be activated in Step 6"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-center text-[11px] text-lumera-text-muted">
                  🔒 Checkout & Order Creation will be implemented in Step 6.
                </p>
              </div>

              {/* Security badges */}
              <div className="mt-8 pt-6 border-t border-border/60 flex flex-col gap-2.5 text-xs text-lumera-text-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authoritative server pricing & verified stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-lumera-accent" />
                  <span>Complimentary returns & conscious packaging</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
