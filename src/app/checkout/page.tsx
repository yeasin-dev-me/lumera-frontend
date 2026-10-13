"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import { api, ApiError } from "@/lib/api/client";
import { CheckoutPreview, OrderCreateInput, ShippingAddressInput } from "@/types/order";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Clock,
  Banknote,
  CheckCircle2,
  Sparkles,
  UserCheck,
  LogIn,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, refreshCart, clearCart } = useCart();

  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ShippingAddressInput>({
    full_name: "",
    phone: "",
    address: "",
    address_line2: "",
    city: "Dhaka",
    area: "",
    postal_code: "",
    country: "Bangladesh",
  });
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [deliveryZone, setDeliveryZone] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch or construct preview (Support both Guest and Authenticated users)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMessage(null);

    if (isAuthenticated) {
      api
        .getCheckoutPreview()
        .then((data) => {
          if (!isMounted) return;
          setPreview(data);
          setFormData((prev) => ({
            ...prev,
            full_name: prev.full_name || data.customer.full_name || "",
            phone: prev.phone || data.customer.phone || "",
          }));
        })
        .catch((err: unknown) => {
          if (!isMounted) return;
          // If server cart preview fails, fall back to current cart context
          if (cart) {
            setPreview({
              cart: cart,
              subtotal: cart.subtotal,
              shipping_cost: "0.00",
              discount_total: "0.00",
              total: cart.total,
              currency: cart.currency,
              is_ready_for_checkout: cart.items.length > 0 && !cart.has_unavailable_items,
              customer: {
                email: user?.email || "",
                full_name: "",
                phone: "",
              },
            });
          } else {
            setErrorMessage("Failed to load checkout details.");
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      // Guest Checkout (BR-11a) - Authoritative fallback to local cart
      if (cart) {
        setPreview({
          cart: cart,
          subtotal: cart.subtotal,
          shipping_cost: "0.00",
          discount_total: "0.00",
          total: cart.total,
          currency: cart.currency,
          is_ready_for_checkout: cart.items.length > 0 && !cart.has_unavailable_items,
          customer: {
            email: "",
            full_name: "",
            phone: "",
          },
        });
      }
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, cart]);

  const handleInputChange = (field: keyof ShippingAddressInput, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.full_name.trim() || formData.full_name.trim().length < 2) {
      errors.full_name = "Full name is required (minimum 2 characters).";
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errors.phone = "Valid phone number is required (e.g. 017XXXXXXXX).";
    }
    if (!formData.address.trim() || formData.address.trim().length < 3) {
      errors.address = "Detailed street address is required for delivery.";
    }
    if (!formData.city.trim() || formData.city.trim().length < 2) {
      errors.city = "City / District is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    const currentItems = preview?.cart.items || cart?.items || [];
    if (currentItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before placing an order.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload: OrderCreateInput = {
        shipping_address: formData,
        customer_notes: notes.trim() || undefined,
        payment_method: paymentMethod,
        guest_email: guestEmail.trim() || undefined,
      };

      // If guest (or direct checkout), provide items payload directly
      if (!isAuthenticated) {
        orderPayload.items = currentItems.map((it) => ({
          product_id: it.product.public_id,
          quantity: it.quantity,
        }));
      }

      const order = await api.createOrder(orderPayload);

      // Clear or refresh cart
      if (!isAuthenticated) {
        await clearCart();
      } else {
        await refreshCart();
      }

      // Redirect immediately to order receipt confirmation
      router.push(`/checkout/confirmation/${order.public_id}`);
    } catch (err: unknown) {
      setIsSubmitting(false);
      if (err instanceof ApiError) {
        if (err.code === "insufficient_stock") {
          setErrorMessage(
            "Some items in your cart exceed available stock. Please review your cart before placing the order."
          );
        } else if (err.code === "product_unavailable") {
          setErrorMessage(
            "One or more products in your cart are no longer available. Please update your cart."
          );
        } else {
          setErrorMessage(err.message || "Failed to place order.");
        }
      } else {
        setErrorMessage("An unexpected error occurred while placing your order.");
      }
    }
  };

  if (authLoading || (loading && !preview && !cart)) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-muted rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-96 bg-surface-muted rounded-xl" />
            <div className="lg:col-span-5 h-96 bg-surface-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const items = preview?.cart.items || cart?.items || [];
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="h-16 w-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4 text-lumera-text-muted">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-lumera-text-muted mb-8 max-w-md mx-auto">
          You need items in your cart to proceed with order confirmation. Explore Penguin Mart catalog.
        </p>
        <Link href="/products">
          <Button className="rounded-full px-8 py-3">Explore Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-lumera-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Cart</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
              <span>Order Confirmation Form</span>
              <span className="text-sm font-sans font-normal text-lumera-text-muted bg-surface-muted px-2.5 py-0.5 rounded-full border border-border">
                অর্ডার কনফার্মেশন
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-lumera-text-muted mt-1">
              Confirm your delivery address & payment preference. Anyone can order directly without login.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No Account Required (Guest Order)</span>
            </div>
          )}
        </div>
      </div>

      {/* Guest Sign-in Option Banner */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 rounded-xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-lumera-primary shrink-0" />
            <span className="text-lumera-text">
              Ordering as a guest is fast & easy! Want to earn reward points and view order history?
            </span>
          </div>
          <Link
            href="/login?redirect=/checkout"
            className="inline-flex items-center gap-1.5 font-semibold text-lumera-primary hover:underline shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In (Optional)</span>
          </Link>
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-6">
          <Alert variant="danger" title="Order Processing Notice">
            <div className="flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Confirmation Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Contact Section */}
          <Card className="p-5 sm:p-6 bg-card border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-lumera-primary/10 text-lumera-primary flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>Customer & Contact Information</span>
              </h2>
              {isAuthenticated && (
                <span className="text-[11px] bg-lumera-primary/10 text-lumera-primary px-2.5 py-0.5 rounded-full font-medium">
                  Logged In
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkout_full_name"
                    className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5"
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="checkout_full_name"
                    type="text"
                    autoComplete="name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    placeholder="e.g. Yeasin Arafat"
                    disabled={isSubmitting}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.full_name ? "border-rose-500" : "border-border"
                    } bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 min-h-[46px] transition-all`}
                  />
                  {formErrors.full_name && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.full_name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout_phone"
                    className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5"
                  >
                    Mobile Phone Number *
                  </label>
                  <input
                    id="checkout_phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="e.g. 01712345678"
                    disabled={isSubmitting}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.phone ? "border-rose-500" : "border-border"
                    } bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 min-h-[46px] transition-all`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {!isAuthenticated && (
                <div>
                  <label
                    htmlFor="checkout_guest_email"
                    className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5"
                  >
                    Email Address (Optional)
                  </label>
                  <input
                    id="checkout_guest_email"
                    type="email"
                    autoComplete="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="e.g. customer@example.com (For order invoice receipt)"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 min-h-[46px] transition-all"
                  />
                  <p className="text-[11px] text-lumera-text-muted mt-1">
                    Optional: We will send order confirmation details and delivery receipt here.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Delivery Address Section */}
          <Card className="p-5 sm:p-6 bg-card border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-lumera-primary/10 text-lumera-primary flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>Delivery Address (ডেলিভারি ঠিকানা)</span>
              </h2>
              <span className="text-[11px] text-lumera-text-muted bg-surface-muted px-2.5 py-0.5 rounded-full">
                Home Delivery
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="checkout_address"
                  className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5"
                >
                  Full Street Address / House / Road *
                </label>
                <input
                  id="checkout_address"
                  type="text"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="e.g. House 42, Road 11, Block D, Banani"
                  disabled={isSubmitting}
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    formErrors.address ? "border-rose-500" : "border-border"
                  } bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 min-h-[46px] transition-all`}
                />
                {formErrors.address && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkout_city"
                    className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5"
                  >
                    City / District *
                  </label>
                  <input
                    id="checkout_city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Dhaka"
                    disabled={isSubmitting}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.city ? "border-rose-500" : "border-border"
                    } bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 min-h-[46px] transition-all`}
                  />
                  {formErrors.city && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout_area"
                    className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5"
                  >
                    Area / Thana (Optional)
                  </label>
                  <input
                    id="checkout_area"
                    type="text"
                    value={formData.area || ""}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="e.g. Mirpur, Gulshan, Dhanmondi"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 min-h-[46px] transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout_notes"
                  className="block text-xs font-medium text-foreground mb-1"
                >
                  Delivery Notes / Special Instructions (Optional)
                </label>
                <textarea
                  id="checkout_notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please deliver after 3:00 PM, or call before arrival"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-sm text-foreground shadow-sm focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 transition-all"
                />
              </div>
            </div>
          </Card>

          {/* Payment Method Selection */}
          <Card className="p-5 sm:p-6 bg-card border-border shadow-sm">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-lumera-primary/10 text-lumera-primary flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Payment Method (পেমেন্ট পদ্ধতি)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash on Delivery */}
              <label
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-lumera-primary bg-lumera-primary/5 ring-1 ring-lumera-primary"
                    : "border-border hover:border-border/80 bg-background"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 font-semibold text-sm text-foreground">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span>Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-lumera-primary w-4 h-4"
                  />
                </div>
                <p className="text-xs text-lumera-text-muted leading-relaxed">
                  Pay with cash when the parcel is delivered to your address. (ক্যাশ অন ডেলিভারি)
                </p>
                <span className="mt-3 inline-block self-start text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                  Most Popular
                </span>
              </label>

              {/* Online Payment */}
              <label
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "online"
                    ? "border-lumera-primary bg-lumera-primary/5 ring-1 ring-lumera-primary"
                    : "border-border hover:border-border/80 bg-background"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 font-semibold text-sm text-foreground">
                    <CreditCard className="w-5 h-5 text-lumera-primary" />
                    <span>Online Payment</span>
                  </div>
                  <input
                    type="radio"
                    name="payment_method"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="accent-lumera-primary w-4 h-4"
                  />
                </div>
                <p className="text-xs text-lumera-text-muted leading-relaxed">
                  bKash, Nagad, Rocket, Visa, Mastercard via SSLCommerz gateway.
                </p>
                <span className="mt-3 inline-block self-start text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200">
                  Instant & Secure
                </span>
              </label>
            </div>
          </Card>
        </div>

        {/* Right Column: Order Summary & Confirm Action */}
        <div className="lg:col-span-5">
          <Card className="p-5 sm:p-6 bg-card border-border shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Order Summary
              </h2>
              <span className="text-xs font-mono text-lumera-text-muted">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Line items list */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.product.public_id} className="flex items-center gap-3 py-1">
                  <div className="relative w-12 h-12 rounded-lg bg-surface-muted overflow-hidden shrink-0 border border-border/60">
                    {it.product.primary_image ? (
                      <Image
                        src={it.product.primary_image}
                        alt={it.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lumera-text-muted">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {it.product.name}
                    </p>
                    <p className="text-[11px] text-lumera-text-muted">
                      Qty: {it.quantity} × ${it.unit_price}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      ${it.line_total}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <dl className="space-y-3 pt-4 border-t border-border text-xs">
              <div className="flex justify-between text-lumera-text-muted">
                <dt>Subtotal</dt>
                <dd className="font-mono font-medium text-foreground">
                  ${preview?.subtotal || cart?.subtotal || "0.00"}
                </dd>
              </div>

              <div className="flex justify-between text-lumera-text-muted">
                <dt>Delivery Fee</dt>
                <dd className="font-mono text-emerald-600 font-medium">
                  Free Delivery
                </dd>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <dt className="font-serif text-base font-semibold text-foreground">
                  Total Payable
                </dt>
                <dd className="font-serif text-2xl font-bold text-foreground">
                  ${preview?.total || cart?.total || "0.00"}
                </dd>
              </div>
            </dl>

            {/* Confirm Order CTA Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || isEmpty}
                className="w-full py-4 text-base font-semibold rounded-full justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all bg-lumera-primary text-white"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>Confirming Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm Order Now (অর্ডার নিশ্চিত করুন)</span>
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-lumera-text-muted mt-2">
                🔒 By placing this order, you confirm delivery details and accept our terms.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-border/60 space-y-2 text-[11px] text-lumera-text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Verified Authentic Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-lumera-primary shrink-0" />
                <span>Fast Doorstep Delivery Across Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lumera-accent shrink-0" />
                <span>Cash on Delivery & Secure Payments</span>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
