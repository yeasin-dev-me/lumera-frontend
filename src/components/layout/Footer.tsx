"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, CheckCircle2, ShieldCheck, Leaf, Sparkles, ArrowRight } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border bg-surface-muted/60 text-lumera-text text-sm transition-colors mb-16 md:mb-0">
      {/* Newsletter Section */}
      <div className="border-b border-border/80 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-lumera-primary">
              The Penguin Mart Journal
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-lumera-text">
              Thoughtful rituals, delivered to your inbox.
            </h3>
            <p className="text-xs sm:text-sm text-lumera-text-muted max-w-md mx-auto">
              Subscribe to receive curated skincare guides, exclusive member launches, and seasonal Penguin Mart drops.
            </p>

            {subscribed ? (
              <div className="pt-2 flex items-center justify-center gap-2 text-emerald-700 text-sm font-medium animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you for subscribing to Penguin Mart Journal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-lumera-text-muted" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full h-11 pl-10 pr-4 rounded-full border border-border bg-background text-sm text-lumera-text placeholder:text-lumera-text-muted/70 focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-full bg-lumera-primary text-white text-xs font-semibold hover:bg-lumera-primary-hover transition-colors shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info (Full width on mobile 2-col layout) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border border-border shadow-sm shrink-0">
                <Image
                  src="/penguin-mart-logo.jpg"
                  alt="Penguin Mart"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-lumera-text leading-tight">
                  PENGUIN MART
                </span>
                <span className="text-[10px] uppercase tracking-wider text-lumera-text-muted font-medium">
                  Skin Care &amp; Beauty
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-lumera-text-muted leading-relaxed max-w-sm">
              Your trusted destination for clean, thoughtful skincare &amp; beauty essentials. Crafted with nourishing botanicals, cold-pressed seed oils, and clinically tested bio-actives.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs text-lumera-text-muted font-medium">
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-lumera-primary" /> Cruelty-Free
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-lumera-primary" /> Clean Tested
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-lumera-primary" /> Bio-Active
              </span>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-lumera-text font-sans">
              Collection
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-lumera-text-muted">
              <li>
                <Link href="/products" className="hover:text-lumera-primary transition-colors">
                  All Formulations
                </Link>
              </li>
              <li>
                <Link href="/products?category=cleansers-toners" className="hover:text-lumera-primary transition-colors">
                  Cleansers & Toners
                </Link>
              </li>
              <li>
                <Link href="/products?category=serums-elixirs" className="hover:text-lumera-primary transition-colors">
                  Active Serums
                </Link>
              </li>
              <li>
                <Link href="/products?category=moisturizers-creams" className="hover:text-lumera-primary transition-colors">
                  Barrier Creams
                </Link>
              </li>
              <li>
                <Link href="/products?category=facial-oils-essences" className="hover:text-lumera-primary transition-colors">
                  Botanical Oils
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Client Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-lumera-text font-sans">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-lumera-text-muted">
              <li>
                <Link href="/contact" className="hover:text-lumera-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-lumera-primary transition-colors">
                  FAQs & Support
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-lumera-primary transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-lumera-primary transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/account/returns" className="hover:text-lumera-primary transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The House */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-lumera-text font-sans">
              The House
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-lumera-text-muted">
              <li>
                <Link href="/about" className="hover:text-lumera-primary transition-colors">
                  About Penguin Mart
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-lumera-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-lumera-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-lumera-primary transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-lumera-text-muted">
          <p>© {new Date().getFullYear()} Penguin Mart Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-lumera-text transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-lumera-text transition-colors">
              Terms
            </Link>
            <Link href="/shipping" className="hover:text-lumera-text transition-colors">
              Shipping
            </Link>
            <Link href="/contact" className="hover:text-lumera-text transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
