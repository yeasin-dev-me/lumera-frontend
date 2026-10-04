"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";
import { Cart, Wishlist } from "@/types/cart";

interface CartContextType {
  cart: Cart | null;
  wishlist: Wishlist | null;
  isLoading: boolean;
  isCartActionLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartActionLoading, setIsCartActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      const data = await api.getCart();
      setCart(data);
    } catch {
      // Ignore initial background fetch errors if guest
    }
  }, [isAuthenticated]);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(null);
      return;
    }
    try {
      const data = await api.getWishlist();
      setWishlist(data);
    } catch {
      // Ignore background fetch errors
    }
  }, [isAuthenticated]);

  // Load cart and wishlist when authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      setIsLoading(true);
      Promise.all([refreshCart(), refreshWishlist()]).finally(() => {
        setIsLoading(false);
      });
    } else if (!authLoading && !isAuthenticated) {
      setCart(null);
      setWishlist(null);
    }
  }, [authLoading, isAuthenticated, refreshCart, refreshWishlist]);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1): Promise<boolean> => {
      if (!isAuthenticated) {
        router.push("/login?redirect=cart");
        return false;
      }
      setIsCartActionLoading(true);
      setError(null);
      try {
        const updatedCart = await api.addToCart(productId, quantity);
        setCart(updatedCart);
        return true;
      } catch (err: unknown) {
        const message = err instanceof ApiError ? err.message : "Failed to add product to cart.";
        setError(message);
        throw err;
      } finally {
        setIsCartActionLoading(false);
      }
    },
    [isAuthenticated, router]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!isAuthenticated) return;
      setIsCartActionLoading(true);
      setError(null);
      try {
        const updatedCart = await api.updateCartItem(productId, quantity);
        setCart(updatedCart);
      } catch (err: unknown) {
        const message = err instanceof ApiError ? err.message : "Failed to update item quantity.";
        setError(message);
        throw err;
      } finally {
        setIsCartActionLoading(false);
      }
    },
    [isAuthenticated]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) return;
      setIsCartActionLoading(true);
      setError(null);
      try {
        await api.removeCartItem(productId);
        await refreshCart();
      } catch (err: unknown) {
        const message = err instanceof ApiError ? err.message : "Failed to remove item from cart.";
        setError(message);
        throw err;
      } finally {
        setIsCartActionLoading(false);
      }
    },
    [isAuthenticated, refreshCart]
  );

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsCartActionLoading(true);
    setError(null);
    try {
      await api.clearCart();
      setCart({
        items: [],
        item_count: 0,
        subtotal: "0.00",
        total: "0.00",
        currency: "USD",
        has_unavailable_items: false,
        updated_at: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Failed to clear cart.";
      setError(message);
      throw err;
    } finally {
      setIsCartActionLoading(false);
    }
  }, [isAuthenticated]);

  const toggleWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated) {
        router.push("/login?redirect=wishlist");
        return false;
      }
      setError(null);
      const isAlready = wishlist?.items.some((i) => i.product.public_id === productId);
      try {
        if (isAlready) {
          await api.removeFromWishlist(productId);
          await refreshWishlist();
          return false;
        } else {
          const updated = await api.addToWishlist(productId);
          setWishlist(updated);
          return true;
        }
      } catch (err: unknown) {
        const message = err instanceof ApiError ? err.message : "Failed to update wishlist.";
        setError(message);
        throw err;
      }
    },
    [isAuthenticated, router, wishlist, refreshWishlist]
  );

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return Boolean(wishlist?.items.some((i) => i.product.public_id === productId));
    },
    [wishlist]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isLoading,
        isCartActionLoading,
        error,
        refreshCart,
        refreshWishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
