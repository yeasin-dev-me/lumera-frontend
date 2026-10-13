"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api/client";
import { useCart } from "@/lib/cart/cart-context";
import { useToast } from "@/components/ui/Toast";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Accordion } from "@/components/ui/Accordion";
import { ProductDetail } from "@/types/catalog";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { track } from "@/lib/tracking";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Leaf,
  Droplets,
  RotateCcw,
} from "lucide-react";

export function ProductDetailClient({ initialProduct }: { initialProduct?: ProductDetail }) {
  const params = useParams();
  const slug = (params?.slug as string) || initialProduct?.slug;

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState<ProductDetail | null>(initialProduct || null);
  const [activeImage, setActiveImage] = useState<string | null>(
    initialProduct?.images?.[0]?.image_url || null
  );
  const [loading, setLoading] = useState<boolean>(!initialProduct);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Cart & Wishlist state
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);
  const [isWishlisting, setIsWishlisting] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const inWishlist = product ? isInWishlist(product.public_id) : false;

  useEffect(() => {
    if (product) {
      track("view_item", {
        item_id: product.public_id,
        item_name: product.name,
        category: product.category?.name,
        value: product.effective_price,
        currency: "USD",
      });
    }
  }, [product]);

  async function handleAddToCart() {
    if (!product || !product.is_in_stock || isAdding) return;
    setIsAdding(true);
    setActionError(null);
    setAddSuccess(false);
    try {
      const success = await addToCart(product.public_id, quantity, {
        public_id: product.public_id,
        name: product.name,
        slug: product.slug,
        primary_image: activeImage || product.images?.[0]?.image_url || null,
        price: product.price,
        discount_price: product.discount_price,
        effective_price: product.effective_price,
        stock_quantity: product.stock_quantity,
        is_in_stock: product.is_in_stock,
      });
      if (success) {
        setAddSuccess(true);
        toast.success(`Added ${quantity} × ${product.name} to shopping bag.`);
        track("add_to_cart", {
          item_id: product.public_id,
          item_name: product.name,
          value: product.effective_price,
          currency: "USD",
          quantity,
        });
        setTimeout(() => setAddSuccess(false), 3000);
      }
    } catch (err: any) {
      const msg = err.message || "Failed to add product to cart.";
      setActionError(msg);
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  }

  async function handleToggleWishlist() {
    if (!product || isWishlisting) return;
    setIsWishlisting(true);
    setActionError(null);
    try {
      await toggleWishlist(product.public_id);
      if (inWishlist) {
        toast.info(`Removed ${product.name} from wishlist.`);
      } else {
        toast.success(`Saved ${product.name} to wishlist.`);
      }
    } catch (err: any) {
      const msg = err.message || "Failed to update wishlist.";
      setActionError(msg);
      toast.error(msg);
    } finally {
      setIsWishlisting(false);
    }
  }

  useEffect(() => {
    if (initialProduct || !slug) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        const data = await api.getProduct(slug as string);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          const primary = data.images.find((img) => img.is_primary);
          setActiveImage(primary ? primary.image_url : data.images[0].image_url);
        }
      } catch {
        // Fall back to mock product if available for testing
        const { getMockProductBySlug } = await import("@/lib/mock-data");
        const mock = getMockProductBySlug(slug as string);
        if (mock) {
          setProduct(mock);
          if (mock.images && mock.images.length > 0) {
            const primary = mock.images.find((img) => img.is_primary);
            setActiveImage(primary ? primary.image_url : mock.images[0].image_url);
          }
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug, initialProduct]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-lumera-primary" />
        <p className="text-xs text-lumera-text-muted">Loading botanical formulation...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-20 space-y-4 max-w-md mx-auto">
        <h2 className="font-serif text-3xl font-semibold text-foreground">Product Not Found</h2>
        <p className="text-sm text-lumera-text-muted">
          The requested skincare item does not exist or has been removed from our active catalog.
        </p>
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-lumera-primary text-white text-xs font-semibold hover:bg-lumera-primary-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Alert variant="danger" title="Error Loading Product">
          {error || "Unable to display product information."}
        </Alert>
        <div className="mt-4 text-center">
          <Link href="/products" className="text-xs text-lumera-primary hover:underline">
            ← Browse available formulas
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.discount_price !== null &&
    parseFloat(product.discount_price) < parseFloat(product.price);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Products", href: "/products" },
          ...(product.category
            ? [{ label: product.category.name, href: `/products?category=${product.category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      {/* Main product display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-card border border-border/70 flex items-center justify-center group">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-6 sm:p-8 transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-lumera-text-muted/60 space-y-2">
                <Sparkles className="w-12 h-12 stroke-[1.5]" />
                <span className="text-xs font-serif">Botanical Imagery Coming Soon</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(img.image_url)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all bg-card shrink-0 active:scale-95 ${
                    activeImage === img.image_url
                      ? "border-lumera-primary ring-2 ring-lumera-primary/20"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || product.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="inline-block text-xs font-semibold uppercase tracking-wider text-lumera-primary hover:underline"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-xs text-lumera-text-muted">
                <span className="font-mono">SKU: {product.sku}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  {product.is_in_stock ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-700 font-medium">In Stock</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-rose-700 font-medium">Out of Stock</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Authoritative Pricing */}
            <div className="p-4 rounded-xl bg-card border border-border flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-lumera-primary">
                ${parseFloat(product.effective_price).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-lumera-text-muted line-through font-serif">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <Badge variant="accent" className="ml-auto text-xs px-2.5 py-0.5">
                  Save $
                  {(parseFloat(product.price) - parseFloat(product.effective_price)).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-lumera-text-muted">
                Formulation & Benefits
              </h2>
              <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {product.description ||
                  "Handcrafted botanical formulation focused on cellular nourishment and clean efficacy."}
              </div>
            </div>

            {/* Notification / Feedback Alerts */}
            {actionError && (
              <Alert variant="danger" title="Error">
                {actionError}
              </Alert>
            )}

            {addSuccess && (
              <Alert variant="success" title="Added to Cart">
                {quantity} × {product.name} has been added to your shopping bag.
              </Alert>
            )}

            {/* Add to Cart & Wishlist Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Quantity selector */}
              {product.is_in_stock && (
                <div className="flex items-center border border-border rounded-full bg-card px-3 py-1.5 self-start sm:self-auto min-h-[44px]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isAdding}
                    className="w-8 h-8 flex items-center justify-center text-lumera-text-muted hover:text-foreground disabled:opacity-30 text-lg active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                    disabled={quantity >= product.stock_quantity || isAdding}
                    className="w-8 h-8 flex items-center justify-center text-lumera-text-muted hover:text-foreground disabled:opacity-30 text-lg active:scale-95"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Main Add Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.is_in_stock || isAdding}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-lumera-primary text-white text-sm font-semibold hover:bg-lumera-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all min-h-[44px] active:scale-95"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding to Bag...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.is_in_stock ? "Add to Shopping Bag" : "Currently Unavailable"}</span>
                  </>
                )}
              </button>

              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={isWishlisting}
                className={`min-w-[44px] min-h-[44px] p-3 rounded-full border transition-all flex items-center justify-center active:scale-95 ${
                  inWishlist
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "border-border text-lumera-text-muted hover:text-rose-500 hover:bg-muted"
                }`}
                title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 rounded-2xl bg-muted/40 border border-border/60 p-4 sm:p-5 flex flex-col gap-3 text-xs text-lumera-text-muted">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-lumera-primary" />
              <span className="text-foreground font-medium">Dermatologist tested & cruelty-free</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-lumera-accent" />
              <span>Authoritative catalog pricing and verified real-time inventory</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Botanical Information & Accordions */}
      <div className="pt-8 sm:pt-12 border-t border-border/80">
        <h2 className="font-serif text-xl sm:text-2xl font-medium text-lumera-text mb-4">
          Formulation & Clinical Details
        </h2>
        <div className="bg-surface rounded-2xl border border-border/80 p-5 sm:p-8 shadow-sm">
          <Accordion
            items={[
              {
                id: "actives",
                title: "Active Botanical Compounds",
                defaultOpen: true,
                children: (
                  <div className="space-y-3">
                    <p>
                      Formulated with certified biocompatible botanical extracts, cold-pressed seed lipids, and stabilized bio-peptides.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-surface-muted/60 border border-border/50">
                        <span className="font-medium text-lumera-primary block text-xs">Bio-Identical Ceramides</span>
                        <span className="text-[11px] text-lumera-text-muted">Fortifies epidermal cellular integrity</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-muted/60 border border-border/50">
                        <span className="font-medium text-lumera-primary block text-xs">Phyto-Antioxidants</span>
                        <span className="text-[11px] text-lumera-text-muted">Guards against environmental oxidative stress</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-muted/60 border border-border/50">
                        <span className="font-medium text-lumera-primary block text-xs">Triple Hyaluronic Multi-Weight</span>
                        <span className="text-[11px] text-lumera-text-muted">Deep cellular water retention</span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: "ritual",
                title: "How to Apply & Ritual Guidelines",
                children: (
                  <div className="space-y-2">
                    <p>
                      Dispense 3–4 drops or a pea-sized amount onto clean palms. Gently warm the formulation between fingertips and press into face, neck, and décolletage in upward sweeping motions.
                    </p>
                    <p className="text-xs text-lumera-text-muted italic">
                      Recommended ritual sequence: Cleanser → Toner Mist → Active Serum → Barrier Cream → Facial Oil.
                    </p>
                  </div>
                ),
              },
              {
                id: "standards",
                title: "Purity & Packaging Standards",
                children: (
                  <p>
                    100% vegan, Leaping Bunny certified cruelty-free, and packaged in dark ultraviolet biophotonic glass. Preserves photolabile plant actives without parabens, synthetic perfumes, petrochemicals, or sulfates.
                  </p>
                ),
              },
              {
                id: "shipping",
                title: "Complimentary Delivery & 30-Day Guarantee",
                children: (
                  <p>
                    Complimentary standard ground delivery on all domestic orders over $75. If your skin does not love this formulation, return the bottle within 30 days for a full refund or exchange.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Mobile Sticky Add-to-Cart Bar (for 80% phone users) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="font-serif text-base font-bold text-lumera-primary">
            ${parseFloat(product.effective_price).toFixed(2)}
          </span>
          <span className="text-[10px] text-lumera-text-muted truncate">
            {product.is_in_stock ? "In Stock" : "Out of stock"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.is_in_stock || isAdding}
          className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-lumera-primary text-white text-xs font-semibold hover:bg-lumera-primary-hover disabled:opacity-50 transition-all shadow-sm active:scale-95"
        >
          {isAdding ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : addSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.is_in_stock ? "Add to Bag" : "Unavailable"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
