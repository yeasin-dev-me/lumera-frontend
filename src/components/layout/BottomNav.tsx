"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";

export function BottomNav() {
  const pathname = usePathname();
  const { cart, wishlist } = useCart();
  const { isAuthenticated } = useAuth();

  const cartCount = cart?.item_count || 0;
  const wishlistCount = wishlist?.item_count || 0;

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Shop",
      href: "/products",
      icon: Compass,
      isActive: pathname.startsWith("/products"),
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      isActive: pathname === "/wishlist",
      badge: wishlistCount,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingBag,
      isActive: pathname === "/cart",
      badge: cartCount,
    },
    {
      label: "Account",
      href: isAuthenticated ? "/account" : "/login",
      icon: User,
      isActive: pathname.startsWith("/account") || pathname === "/login" || pathname === "/register",
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-area-bottom"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 relative min-h-[48px] rounded-lg transition-colors active:scale-95 ${
                item.isActive
                  ? "text-lumera-primary font-semibold"
                  : "text-lumera-text-muted hover:text-lumera-primary"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    item.isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.8]"
                  }`}
                />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-lumera-primary text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
                    {item.badge! > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 transition-all ${
                  item.isActive ? "font-semibold" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
