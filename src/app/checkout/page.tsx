"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import { api, ApiError } from "@/lib/api/client";
import { CheckoutPreview, ShippingAddressInput } from "@/types/order";
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
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { refreshCart } = useCart();

  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Shipping form state
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
  const [notes, setNotes] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 1. Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  // 2. Fetch authoritative checkout preview
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    setLoading(true);
    setErrorMessage(null);

    api
      .getCheckoutPreview()
      .then((data) => {
        if (!isMounted) return;
        setPreview(data);
        // Pre-fill user data if available
        setFormData((prev) => ({
          ...prev,
          full_name: prev.full_name || data.customer.full_name || "",
          phone: prev.phone || data.customer.phone || "",
        }));
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("Failed to load checkout details. Please try again.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

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
      errors.phone = "Valid phone number is required (minimum 7 digits).";
    }
    if (!formData.address.trim() || formData.address.trim().length < 3) {
      errors.address = "Street address is required.";
    }
    if (!formData.city.trim() || formData.city.trim().length < 2) {
      errors.city = "City is required.";
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

    if (!preview || !preview.is_ready_for_checkout) {
      setErrorMessage("Your cart cannot be checked out in its current state.");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await api.createOrder({
        shipping_address: formData,
        customer_notes: notes.trim() || undefined,
      });

      // Synchronize cart state so navbar badge and context update immediately
      await refreshCart();

      // Redirect to confirmation page
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

  if (authLoading || (loading && !preview)) {
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

  const items = preview?.cart.items || [];
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
          You need items in your cart to proceed with checkout. Browse our collection of
          premium formulations.
        </p>
        <Link href="/products">
          <Button className="rounded-full px-8 py-3">Explore Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-lumera-primary hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Cart</span>
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground tracking-tight mt-2">
          Checkout
        </h1>
        <p className="text-xs text-lumera-text-muted mt-1">
          Review your order details and specify your delivery address.
        </p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-8">
          <Alert variant="danger" title="Checkout Conflict">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery & Shipping Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Profile Contact */}
          <Card className="p-6 bg-card border-border">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
              1. Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-lumera-text-muted block">Account Email</span>
                <span className="font-medium text-foreground">{user?.email}</span>
              </div>
              <div>
                <span className="text-xs text-lumera-text-muted block">Account ID</span>
                <span className="font-mono text-xs text-lumera-text-muted">
                  {user?.id ? `${user.id.slice(0, 8)}...` : "Authenticated"}
                </span>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                2. Shipping Address
              </h2>
              <span className="text-[11px] text-lumera-text-muted bg-surface-muted px-2.5 py-1 rounded-full">
                Snapshotted at Purchase
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkout_full_name" className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5">
                    Full Recipient Name *
                  </label>
                  <input
                    id="checkout_full_name"
                    type="text"
                    autoComplete="name"
                    value={formData.full_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("full_name", e.target.value)}
                    placeholder="e.g. Jane Doe"
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
                  <label htmlFor="checkout_phone" className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    id="checkout_phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                    placeholder="e.g. +880 1712-345678"
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

              <div>
                <label htmlFor="checkout_address" className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5">
                  Street Address / House / Road *
                </label>
                <input
                  id="checkout_address"
                  type="text"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("address", e.target.value)}
                  placeholder="e.g. House 42, Road 11, Block D"
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

              <div>
                <label htmlFor="checkout_address_line2" className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5">
                  Apartment, Suite, Floor (Optional)
                </label>
                <input
                  id="checkout_address_line2"
                  type="text"
                  autoComplete="address-line2"
                  value={formData.address_line2 || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("address_line2", e.target.value)}
                  placeholder="e.g. Apt 4B, 3rd Floor"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 min-h-[46px] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="checkout_city" className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5">
                    City *
                  </label>
                  <input
                    id="checkout_city"
                    type="text"
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("city", e.target.value)}
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
                  <label htmlFor="checkout_area" className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5">
                    Area / Thana
                  </label>
                  <input
                    id="checkout_area"
                    type="text"
                    value={formData.area || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("area", e.target.value)}
                    placeholder="e.g. Banani"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 min-h-[46px] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="checkout_postal_code" className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-1.5">
                    Postal Code
                  </label>
                  <input
                    id="checkout_postal_code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={formData.postal_code || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("postal_code", e.target.value)}
                    placeholder="e.g. 1213"
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
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  id="checkout_notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, gate code is 1234"
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-input bg-surface px-3 py-2 text-base sm:text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-lumera-primary"
                />
              </div>
            </div>
          </Card>

          {/* Payment Foundation Notice */}
          <Card className="p-6 bg-surface-muted/40 border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-surface-muted text-lumera-primary mt-0.5">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <h3 className="font-semibold text-foreground">
                  Payment Status: Pending Payment (Step 6 Foundation)
                </h3>
                <p className="text-lumera-text-muted leading-relaxed">
                  Per Step 6 scope, your order will be recorded in a verified pending-payment
                  status. Actual online payment gateways (bKash, Nagad, Cards) will be activated
                  in the upcoming Step 7 milestone.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Authoritative Order Summary */}
        <div className="lg:col-span-5">
          <Card className="p-6 sm:p-8 bg-card border-border sticky top-24 space-y-6">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Order Summary
            </h2>

            {/* Item list */}
            <div className="divide-y divide-border/60 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.public_id} className="py-3 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded bg-surface-muted overflow-hidden shrink-0 border border-border/50">
                    {item.product.primary_image ? (
                      <Image
                        src={item.product.primary_image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lumera-text-muted">
                        <ShoppingBag className="w-5 h-5 opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-lumera-text-muted">
                      Qty: {item.quantity} × ${item.unit_price}
                    </p>
                  </div>
                  <div className="text-xs font-mono font-semibold text-foreground">
                    ${item.line_total}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <dl className="space-y-3 pt-4 border-t border-border text-xs">
              <div className="flex justify-between text-lumera-text-muted">
                <dt>Subtotal ({preview?.cart.item_count || 0} items)</dt>
                <dd className="font-mono text-foreground">${preview?.subtotal}</dd>
              </div>
              <div className="flex justify-between text-lumera-text-muted">
                <dt className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Standard Shipping</span>
                </dt>
                <dd className="font-mono text-foreground">${preview?.shipping_cost}</dd>
              </div>
              {preview?.discount_total && preview.discount_total !== "0.00" && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <dt>Discounts</dt>
                  <dd className="font-mono">-${preview.discount_total}</dd>
                </div>
              )}
              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <dt className="font-serif text-base font-semibold text-foreground">
                  Order Total
                </dt>
                <dd className="font-serif text-2xl font-bold text-foreground">
                  ${preview?.total}
                </dd>
              </div>
            </dl>

            {/* Place Order CTA */}
            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting || !preview?.is_ready_for_checkout}
                className="w-full py-4 rounded-full justify-center text-sm font-semibold tracking-wide"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-lumera-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-lumera-primary" />
                <span>Backend-authoritative prices & transactional stock deduction</span>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
