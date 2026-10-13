"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";
import { Cart, CartItem, CartProduct, Wishlist } from "@/types/cart";

const GUEST_CART_KEY = "penguin_guest_cart";

interface GuestCartRecord {
  product: CartProduct;
  quantity: number;
}

function calculateGuestCart(items: GuestCartRecord[]): Cart {
  let subtotal = 0;
  let count = 0;

  const cartItems: CartItem[] = items.map((it) => {
    const unitPriceNum = parseFloat(it.product.effective_price || it.product.price || "0");
    const lineTotalNum = unitPriceNum * it.quantity;
    subtotal += lineTotalNum;
    count += it.quantity;

    return {
      product: it.product,
      quantity: it.quantity,
      unit_price: unitPriceNum.toFixed(2),
      line_total: lineTotalNum.toFixed(2),
      availability_status: "available",
      is_purchasable: it.product.is_in_stock,
      added_at: new Date().toISOString(),
    };
  });

  return {
    items: cartItems,
    item_count: count,
    subtotal: subtotal.toFixed(2),
    total: subtotal.toFixed(2),
    currency: "USD",
    has_unavailable_items: false,
    updated_at: new Date().toISOString(),
  };
}

function loadGuestCart(): GuestCartRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: GuestCartRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota or security errors
  }
}

interface CartContextType {
  cart: Cart | null;
  wishlist: Wishlist | null;
  isLoading: boolean;
  isCartActionLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, productDetails?: CartProduct) => Promise<boolean>;
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
      const guestItems = loadGuestCart();
      setCart(calculateGuestCart(guestItems));
      return;
    }
    try {
      const data = await api.getCart();
      setCart(data);
    } catch {
      // Ignore background fetch errors
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

  // Load cart and wishlist
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      setIsLoading(true);
      // Migrate guest cart if exists
      const guestItems = loadGuestCart();
      const syncPromises = guestItems.map((item) =>
        api.addToCart(item.product.public_id, item.quantity).catch(() => null)
      );

      Promise.all(syncPromises).then(() => {
        try {
          localStorage.removeItem(GUEST_CART_KEY);
        } catch {}
        Promise.all([refreshCart(), refreshWishlist()]).finally(() => {
          setIsLoading(false);
        });
      });
    } else {
      // Guest mode: load guest cart from localStorage
      const guestItems = loadGuestCart();
      setCart(calculateGuestCart(guestItems));
      setWishlist(null);
    }
  }, [authLoading, isAuthenticated, refreshCart, refreshWishlist]);

  const addToCart = useCallback(
    async (
      productId: string,
      quantity: number = 1,
      productDetails?: CartProduct
    ): Promise<boolean> => {
      setIsCartActionLoading(true);
      setError(null);

      try {
        if (isAuthenticated) {
          const updatedCart = await api.addToCart(productId, quantity);
          setCart(updatedCart);
          return true;
        }

        // Guest Checkout flow (BR-11a)
        const guestItems = loadGuestCart();
        const existingIndex = guestItems.findIndex(
          (i) => i.product.public_id === productId
        );

        if (existingIndex > -1) {
          const newQty = Math.min(20, guestItems[existingIndex].quantity + quantity);
          guestItems[existingIndex].quantity = newQty;
        } else {
          let resolvedProduct = productDetails;
          if (!resolvedProduct) {
            try {
              const fetched = await api.getProduct(productId);
              resolvedProduct = {
                public_id: fetched.public_id,
                name: fetched.name,
                slug: fetched.slug,
                primary_image: fetched.images?.[0]?.image_url || null,
                price: fetched.price,
                discount_price: fetched.discount_price,
                effective_price: fetched.effective_price,
                stock_quantity: fetched.stock_quantity,
                is_in_stock: fetched.is_in_stock,
              };
            } catch {
              resolvedProduct = {
                public_id: productId,
                name: "Product",
                slug: productId,
                primary_image: null,
                price: "0.00",
                discount_price: null,
                effective_price: "0.00",
                stock_quantity: 10,
                is_in_stock: true,
              };
            }
          }
          guestItems.push({
            product: resolvedProduct,
            quantity: Math.min(20, Math.max(1, quantity)),
          });
        }

        saveGuestCart(guestItems);
        setCart(calculateGuestCart(guestItems));
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof ApiError ? err.message : "Failed to add product to cart.";
        setError(message);
        throw err;
      } finally {
        setIsCartActionLoading(false);
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      setIsCartActionLoading(true);
      setError(null);

      try {
        if (isAuthenticated) {
          const updatedCart = await api.updateCartItem(productId, quantity);
          setCart(updatedCart);
          return;
        }

        // Guest update
        let guestItems = loadGuestCart();
        if (quantity <= 0) {
          guestItems = guestItems.filter((i) => i.product.public_id !== productId);
        } else {
          const target = guestItems.find((i) => i.product.public_id === productId);
          if (target) {
            target.quantity = Math.min(20, quantity);
          }
        }
        saveGuestCart(guestItems);
        setCart(calculateGuestCart(guestItems));
      } catch (err: unknown) {
        const message =
          err instanceof ApiError ? err.message : "Failed to update item quantity.";
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
      setIsCartActionLoading(true);
      setError(null);

      try {
        if (isAuthenticated) {
          await api.removeCartItem(productId);
          await refreshCart();
          return;
        }

        const guestItems = loadGuestCart().filter(
          (i) => i.product.public_id !== productId
        );
        saveGuestCart(guestItems);
        setCart(calculateGuestCart(guestItems));
      } catch (err: unknown) {
        const message =
          err instanceof ApiError ? err.message : "Failed to remove item from cart.";
        setError(message);
        throw err;
      } finally {
        setIsCartActionLoading(false);
      }
    },
    [isAuthenticated, refreshCart]
  );

  const clearCart = useCallback(async () => {
    setIsCartActionLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        await api.clearCart();
      } else {
        try {
          localStorage.removeItem(GUEST_CART_KEY);
        } catch {}
      }

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
      const message =
        err instanceof ApiError ? err.message : "Failed to clear cart.";
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
        const message =
          err instanceof ApiError ? err.message : "Failed to update wishlist.";
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
