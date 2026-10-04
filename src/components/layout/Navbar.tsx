"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Sparkles, User as UserIcon, LogOut } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="h-8 w-8 rounded-full bg-lumera-primary text-white flex items-center justify-center font-serif font-bold text-lg group-hover:bg-lumera-primary-hover transition-colors">
            L
          </span>
          <span className="font-serif text-2xl font-semibold tracking-wider text-lumera-text">
            LUMERA
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-lumera-text-muted">
          <Link href="/" className="hover:text-lumera-primary transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-lumera-primary transition-colors">
            Catalog
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-lumera-accent font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Storefront</span>
          </div>

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
                className="px-3 py-1.5 rounded-full bg-lumera-primary text-white text-xs font-semibold hover:bg-lumera-primary-hover transition-colors"
              >
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
