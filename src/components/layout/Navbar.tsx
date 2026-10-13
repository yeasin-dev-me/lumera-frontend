"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import {
  User as UserIcon,
  LogOut,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Package,
  MapPin,
  RotateCcw,
  Bell,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cart?.item_count || 0;
  const wishlistCount = wishlist?.item_count || 0;

  // Automatically close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Keyboard shortcut '/' opens search overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden border border-border shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/penguin-mart-logo.jpg"
                alt="Penguin Mart"
                fill
                sizes="44px"
                priority
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-lumera-text leading-tight group-hover:text-lumera-primary transition-colors">
                PENGUIN MART
              </span>
              <span className="text-[9px] uppercase tracking-widest text-lumera-text-muted font-medium -mt-0.5 hidden xs:inline sm:inline">
                Skin Care &amp; Beauty
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-lumera-text-muted">
            <Link
              href="/"
              className={`hover:text-lumera-primary transition-colors ${
                pathname === "/" ? "text-lumera-primary font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`hover:text-lumera-primary transition-colors ${
                pathname.startsWith("/products") ? "text-lumera-primary font-semibold" : ""
              }`}
            >
              Catalog
            </Link>

            {/* Desktop Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-surface-muted/60 hover:bg-surface-muted text-lumera-text-muted hover:text-lumera-text text-xs transition-all shadow-sm"
              title="Search products (Press /)"
            >
              <Search className="h-3.5 w-3.5 text-lumera-primary" />
              <span className="hidden lg:inline">Search products...</span>
              <span className="lg:hidden">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-background border border-border rounded text-lumera-text-muted">
                /
              </kbd>
            </button>

            <Link
              href="/wishlist"
              className="relative flex items-center gap-1.5 hover:text-lumera-primary transition-colors"
              title="Wishlist"
            >
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-lumera-accent rounded-full">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 hover:text-lumera-primary transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-lumera-primary rounded-full">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <span className="text-border">|</span>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 text-lumera-text hover:text-lumera-primary transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{user.first_name || user.email.split("@")[0]}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1 text-xs text-lumera-text-muted hover:text-rose-600 transition-colors"
                  title="Log out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-lumera-text hover:text-lumera-primary transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-full bg-lumera-primary text-white text-xs font-semibold hover:bg-lumera-primary-hover transition-colors shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Right Controls: Search + Wishlist + Cart + Hamburger Menu */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full text-lumera-text-muted hover:text-lumera-primary transition-colors active:scale-95"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-full text-lumera-text-muted hover:text-lumera-primary transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-lumera-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-full text-lumera-text-muted hover:text-lumera-primary transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-lumera-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-lumera-text hover:bg-muted transition-colors active:scale-95"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Mobile Navigation Drawer */}
      <aside
        className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-background border-l border-border shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile Navigation Drawer"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-surface-muted/40">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-border shadow-sm shrink-0">
                <Image
                  src="/penguin-mart-logo.jpg"
                  alt="Penguin Mart"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base font-bold tracking-tight text-lumera-text leading-none">
                  PENGUIN MART
                </span>
                <span className="text-[9px] uppercase tracking-wider text-lumera-text-muted font-medium mt-0.5">
                  Skin Care &amp; Beauty
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full text-lumera-text-muted hover:text-lumera-text hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Account Quick Banner */}
          <div className="p-4 bg-muted/30 border-b border-border">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-lumera-text">
                      {user.first_name ? `${user.first_name} ${user.last_name || ""}` : "Customer"}
                    </span>
                  </div>
                  <p className="text-[11px] text-lumera-text-muted truncate mt-0.5">{user.email}</p>
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-lumera-primary/10 text-lumera-primary text-xs font-semibold hover:bg-lumera-primary/20 transition-colors"
                >
                  Account
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-lumera-text-muted">
                  Sign in for wholesale pricing, faster checkout, and order tracking.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-lumera-text hover:bg-muted text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-3 py-2 rounded-xl bg-lumera-primary text-white text-xs font-semibold hover:bg-lumera-primary-hover text-center shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Navigation Links */}
          <div className="p-4 space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-lumera-text-muted px-3 block mb-1">
              Explore
            </span>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-lumera-primary text-white font-semibold"
                  : "text-lumera-text hover:bg-muted"
              }`}
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname.startsWith("/products")
                  ? "bg-lumera-primary text-white font-semibold"
                  : "text-lumera-text hover:bg-muted"
              }`}
            >
              <span>Product Catalog</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === "/wishlist"
                  ? "bg-lumera-primary text-white font-semibold"
                  : "text-lumera-text hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>My Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-lumera-accent text-white text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === "/cart"
                  ? "bg-lumera-primary text-white font-semibold"
                  : "text-lumera-text hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Shopping Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-lumera-primary text-white text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Account Sub-sections (for logged-in customers) */}
          {isAuthenticated && (
            <div className="p-4 border-t border-border space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-lumera-text-muted px-3 block mb-1">
                Account & Orders
              </span>

              <Link
                href="/account/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-lumera-text hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-lumera-primary" />
                  <span>My Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>

              <Link
                href="/account/addresses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-lumera-text hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-lumera-primary" />
                  <span>Saved Addresses</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>

              <Link
                href="/account/returns"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-lumera-text hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-lumera-primary" />
                  <span>Returns & Refunds</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>

              <Link
                href="/account/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-lumera-text hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-lumera-primary" />
                  <span>Notifications History</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>

              <Link
                href="/account/communication-preferences"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-lumera-text hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-lumera-primary" />
                  <span>Communication Preferences</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            </div>
          )}

          {/* Drawer Footer */}
          <div className="mt-auto p-4 border-t border-border bg-surface-muted/30">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <p className="text-[11px] text-center text-lumera-text-muted">
                Penguin Mart · Skin Care &amp; Beauty
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Quick Search Overlay for Mobile & Desktop */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
