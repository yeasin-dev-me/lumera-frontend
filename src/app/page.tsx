"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api/client";
import { Category, ProductListItem } from "@/types/catalog";
import { StorefrontHomeContent, StorefrontConfig } from "@/types/content";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/tracking";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Megaphone,
  Truck,
  ShieldCheck,
  Banknote,
  Zap,
  Star,
  Leaf,
  HeartHandshake,
  Clock,
  PhoneCall,
  Check,
} from "lucide-react";

import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_HOME_CONTENT,
  MOCK_CONFIG,
} from "@/lib/mock-data";

export default function StorefrontHomePage() {
  const [backendConfig, setBackendConfig] = useState<StorefrontConfig | null>(null);
  const [homeContent, setHomeContent] = useState<StorefrontHomeContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [config, content, cats, prods] = await Promise.all([
        api.getConfig().catch(() => MOCK_CONFIG),
        api.getHomeContent().catch(() => MOCK_HOME_CONTENT),
        api.getCategories().catch(() => [] as Category[]),
        api.getProducts({ page_size: 8 }).catch(() => ({
          count: 0,
          results: [] as ProductListItem[],
          next: null,
          previous: null,
        })),
      ]);
      setBackendConfig(config || MOCK_CONFIG);
      setHomeContent(content || MOCK_HOME_CONTENT);
      setCategories(cats && cats.length > 0 ? cats : MOCK_CATEGORIES);
      setProducts(
        prods && prods.results && prods.results.length > 0
          ? prods.results
          : (MOCK_PRODUCTS as ProductListItem[])
      );
    } catch {
      setBackendConfig(MOCK_CONFIG);
      setHomeContent(MOCK_HOME_CONTENT);
      setCategories(MOCK_CATEGORIES);
      setProducts(MOCK_PRODUCTS as ProductListItem[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    track("page_view", { page: "home" });
  }, []);

  const announcement =
    homeContent?.announcement?.body ||
    homeContent?.announcement?.title ||
    backendConfig?.announcement_text ||
    "⚡ Nationwide Delivery across Bangladesh • Cash on Delivery (ক্যাশ অন ডেলিভারি) Available • No Account Needed to Order";

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category?.slug === selectedCategory);

  return (
    <div className="space-y-12 sm:space-y-20 py-2 sm:py-6">
      {/* 1. Dynamic Top Announcement Ribbon */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-50 via-lumera-cream to-amber-50 dark:from-emerald-950/40 dark:via-background dark:to-amber-950/40 border border-emerald-200/70 dark:border-emerald-800/60 px-4 py-2 flex items-center justify-center gap-2 text-xs text-lumera-text shadow-sm text-center">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium truncate">{announcement}</span>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 font-semibold text-lumera-primary hover:underline shrink-0 ml-1.5"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. Flagship Hero Section */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-surface via-card to-lumera-cream/30 border border-border/80 p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lumera-primary/10 border border-lumera-primary/20 text-lumera-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Penguin Mart • Bangladesh&apos;s Curated Store</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
              Curated Luxury & <br />
              <span className="bg-gradient-to-r from-lumera-primary via-emerald-800 to-lumera-accent bg-clip-text text-transparent">
                Pure Botanical Care.
              </span>
            </h1>

            <p className="text-lumera-text-muted text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
              Thoughtfully crafted formulas designed to nurture and strengthen your skin barrier.
              Experience seamless shopping with <strong>Cash on Delivery</strong> across all 64 districts—<strong>no account required</strong> to confirm your order.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-lumera-primary text-white text-sm sm:text-base font-semibold hover:bg-lumera-primary-hover shadow-lg hover:shadow-xl transition-all active:scale-95 text-center group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-border bg-card/80 hover:bg-muted text-foreground text-sm sm:text-base font-semibold shadow-sm transition-all active:scale-95 text-center"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Fast Order (অর্ডার করুন)</span>
              </Link>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t border-border/60 text-xs text-lumera-text-muted">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">24-48h Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">100% Authentic</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-tr from-lumera-cream via-surface to-emerald-50 border border-border/80 shadow-lifted">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85"
                alt="Penguin Mart Botanical Formulations"
                fill
                priority
                className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Review Badge Overlay */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-surface/90 backdrop-blur-md border border-border/60 shadow-md flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                    <span>4.9 / 5.0</span>
                    <span className="text-amber-500">★★★★★</span>
                  </div>
                  <span className="text-[10px] text-lumera-text-muted">1,400+ Verified Orders</span>
                </div>
              </div>

              {/* Floating Fast Order Badge Overlay */}
              <div className="absolute bottom-4 right-4 left-4 sm:left-auto p-3.5 rounded-2xl bg-surface/95 backdrop-blur-md border border-border/80 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">
                    No Sign In Required
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium truncate">
                    Instant confirmation & COD home delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Trust Pillars Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:border-lumera-primary/40 hover:shadow-md transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground">
              Nationwide Delivery
            </h3>
            <p className="text-xs text-lumera-text-muted leading-relaxed">
              Dhaka in 24-48 hrs, and fast shipping to all 64 districts in Bangladesh.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:border-lumera-primary/40 hover:shadow-md transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-1">
              <Banknote className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground">
              Cash on Delivery
            </h3>
            <p className="text-xs text-lumera-text-muted leading-relaxed">
              ক্যাশ অন ডেলিভারি: Inspect your package and pay cash right at your doorstep.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:border-lumera-primary/40 hover:shadow-md transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-1">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground">
              Instant Guest Checkout
            </h3>
            <p className="text-xs text-lumera-text-muted leading-relaxed">
              No account, passwords, or registration required. Order in 30 seconds.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:border-lumera-primary/40 hover:shadow-md transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground">
              100% Authentic Quality
            </h3>
            <p className="text-xs text-lumera-text-muted leading-relaxed">
              Original botanical formulations with clinically verified natural active ingredients.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Shop by Category (Interactive Grid) */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-lumera-primary uppercase tracking-wider mb-1">
                <Leaf className="w-3.5 h-3.5" />
                <span>Targeted Formulations</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Shop by Botanical Category
              </h2>
              <p className="text-xs sm:text-sm text-lumera-text-muted mt-1">
                Choose clean solutions customized for your exact skin goals
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-lumera-primary flex items-center gap-1.5 hover:underline shrink-0"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative flex flex-col items-center p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:border-lumera-primary/50 hover:shadow-lg transition-all text-center active:scale-95"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-lumera-cream mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lumera-primary font-serif font-bold text-xl">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-xs sm:text-sm font-semibold text-foreground group-hover:text-lumera-primary transition-colors line-clamp-1 w-full">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-lumera-text-muted mt-0.5">Explore →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. Featured & Trending Formulations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-lumera-primary uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Featured Formulations
            </h2>
            <p className="text-xs sm:text-sm text-lumera-text-muted mt-1">
              Our highest rated, skin-rebalancing botanical products
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === "all"
                  ? "bg-lumera-primary text-white shadow-sm"
                  : "bg-surface-muted text-lumera-text-muted hover:text-foreground"
              }`}
            >
              All Formulations
            </button>
            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  selectedCategory === cat.slug
                    ? "bg-lumera-primary text-white shadow-sm"
                    : "bg-surface-muted text-lumera-text-muted hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Catalog Link */}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border bg-card hover:bg-muted font-semibold text-xs sm:text-sm text-foreground shadow-sm hover:shadow transition-all active:scale-95"
          >
            <span>View Full Catalog ({products.length}+ Items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. Editorial Feature: The Penguin Mart Difference */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-card via-surface to-lumera-cream/40 border border-border/80 p-6 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-lumera-accent font-semibold">
                Ethical & Pure Formulation
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-tight">
                Clinically Validated Actives. <br />
                Zero Harsh Synthetics.
              </h2>
              <p className="text-xs sm:text-sm text-lumera-text-muted leading-relaxed">
                At Penguin Mart, every bottle contains ethically harvested bio-ferments, natural ceramides,
                and pure botanical oils formulated to soothe, fortify, and illuminate your complexion.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Dermatologist Approved</h4>
                    <p className="text-[11px] text-lumera-text-muted">Safe for sensitive and reactive skin barriers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">100% Genuine Guarantee</h4>
                    <p className="text-[11px] text-lumera-text-muted">Authentic formulations stored in climate-controlled conditions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">7-Day Free Replacement Policy</h4>
                    <p className="text-[11px] text-lumera-text-muted">Complete peace of mind with every order.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] sm:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1608248597359-0010f37f3747?auto=format&fit=crop&w=1000&q=85"
                  alt="Pure Botanical Skincare Formulation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Social Proof & Bangladeshi Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-xs font-semibold text-lumera-primary uppercase tracking-wider">
            Verified Experiences
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Loved by Customers Across Bangladesh
          </h2>
          <p className="text-xs sm:text-sm text-lumera-text-muted">
            Hear from shoppers who ordered directly with Cash on Delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
            <div className="flex text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
              &ldquo;I placed an order with Cash on Delivery to Dhanmondi without having to sign in or create an account. The parcel arrived the very next day. The mist is incredible!&rdquo;
            </p>
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-foreground block">Tasnim Rahman</span>
                <span className="text-[11px] text-lumera-text-muted">Dhanmondi, Dhaka</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
            <div className="flex text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
              &ldquo;The fastest checkout experience I have used in BD. Selected COD, entered my phone and address, and confirmed in one click. 100% genuine products.&rdquo;
            </p>
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-foreground block">Farhan Ahmed</span>
                <span className="text-[11px] text-lumera-text-muted">GEC Circle, Chittagong</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
            <div className="flex text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
              &ldquo;The Bakuchiol Night Elixir is amazing for skin texture. Authentic formulation and careful doorstep packaging. Penguin Mart is now my go-to store.&rdquo;
            </p>
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-foreground block">Nusrat Jahan</span>
                <span className="text-[11px] text-lumera-text-muted">Zindabazar, Sylhet</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. High-Converting Fast Order Call-to-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-lumera-primary via-emerald-900 to-lumera-primary text-white p-8 sm:p-14 lg:p-16 text-center space-y-6 shadow-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Ready for Luminous, Healthy Skin?</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto leading-tight">
            Confirm Your Order in Seconds with Cash on Delivery.
          </h2>

          <p className="text-xs sm:text-base text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            No registration or account required. Experience authentic botanical luxury delivered straight to your doorstep across Bangladesh.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-lumera-primary hover:bg-emerald-50 text-sm sm:text-base font-bold shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Browse Catalog (সব প্রোডাক্ট দেখুন)</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
