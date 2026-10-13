"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-context";
import { api, ApiError } from "@/lib/api/client";
import { OrderDetail } from "@/types/order";
import { PaymentStatusResponse } from "@/types/payment";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  Truck,
  ArrowRight,
  Clock,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  RotateCw,
  ExternalLink,
} from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const orderId = typeof params?.id === "string" ? params.id : "";
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initiatingPayment, setInitiatingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderAndPayment = useCallback(async () => {
    if (!orderId) return;
    try {
      const [orderData, payData] = await Promise.all([
        api.getCustomerOrder(orderId),
        api.getPaymentStatus(orderId).catch(() => null),
      ]);
      setOrder(orderData);
      setPaymentStatus(payData);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load order confirmation details.");
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (orderId) {
      fetchOrderAndPayment();
    }
  }, [orderId, isAuthenticated, authLoading, router, fetchOrderAndPayment]);

  const handleInitiatePayment = async () => {
    if (!order) return;
    setInitiatingPayment(true);
    setPaymentError(null);

    try {
      const res = await api.initiatePayment(order.public_id, "sslcommerz");
      if (res.redirect_url) {
        window.location.href = res.redirect_url;
      } else {
        setPaymentError("Gateway did not return a valid redirect URL.");
        setInitiatingPayment(false);
      }
    } catch (err: unknown) {
      setInitiatingPayment(false);
      if (err instanceof ApiError) {
        setPaymentError(err.message);
      } else {
        setPaymentError("Failed to initiate payment. Please try again.");
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 animate-pulse space-y-6">
        <div className="h-12 bg-surface-muted rounded w-64 mx-auto" />
        <div className="h-64 bg-surface-muted rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <Alert variant="danger" title="Unable to Load Order">
          {error || "Order not found or access denied."}
        </Alert>
        <div className="mt-6">
          <Link href="/account/orders">
            <Button variant="secondary">View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.payment_status === "paid" || paymentStatus?.status === "paid";
  const isFailed = order.payment_status === "failed" || paymentStatus?.status === "failed";
  const isProcessing = paymentStatus?.status === "processing";

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div
          className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto shadow-sm ${
            isPaid
              ? "bg-emerald-100 text-emerald-600"
              : isFailed
              ? "bg-rose-100 text-rose-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {isPaid ? (
            <CheckCircle2 className="w-8 h-8" />
          ) : isFailed ? (
            <AlertTriangle className="w-8 h-8" />
          ) : (
            <Clock className="w-8 h-8" />
          )}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
          {isPaid
            ? "Payment Confirmed!"
            : isFailed
            ? "Payment Required"
            : "Order Placed — Payment Pending"}
        </h1>
        <p className="text-xs sm:text-sm text-lumera-text-muted max-w-md mx-auto">
          {isPaid
            ? "Thank you! Your payment has been authoritatively verified by Penguin Mart servers."
            : "Your order snapshot has been recorded. Please complete payment using the secure gateway below."}
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="primary">Order #{order.order_number}</Badge>
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Order: {order.status}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              isPaid
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : isFailed
                ? "bg-rose-50 text-rose-800 border border-rose-200"
                : "bg-sky-50 text-sky-800 border border-sky-200"
            }`}
          >
            Payment: {paymentStatus?.status || order.payment_status}
          </span>
        </div>
      </div>

      {/* Authoritative Payment Execution Card */}
      <Card className="p-6 bg-card border-border shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-lumera-primary" />
            <span>Financial Settlement</span>
          </h2>
          <span className="text-xs font-mono font-medium text-lumera-text-muted">
            Due: ${order.total} {order.currency}
          </span>
        </div>

        {paymentError && (
          <div className="mt-4">
            <Alert variant="danger" title="Payment Error">
              {paymentError}
            </Alert>
          </div>
        )}

        {isPaid ? (
          <div className="mt-4 bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment Verified & Completed</span>
            </div>
            <p className="text-emerald-700">
              Payment was verified directly against the gateway verification server.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-emerald-900 border-t border-emerald-200/50">
              {paymentStatus?.provider_transaction_id && (
                <div>
                  <span className="text-emerald-600 block text-[11px]">Transaction ID:</span>
                  <span className="font-mono font-medium">{paymentStatus.provider_transaction_id}</span>
                </div>
              )}
              {paymentStatus?.paid_at && (
                <div>
                  <span className="text-emerald-600 block text-[11px]">Paid At:</span>
                  <span>{new Date(paymentStatus.paid_at).toLocaleString("en-US")}</span>
                </div>
              )}
              {paymentStatus?.gateway && (
                <div>
                  <span className="text-emerald-600 block text-[11px]">Gateway:</span>
                  <span className="uppercase">{paymentStatus.gateway}</span>
                </div>
              )}
              {paymentStatus?.method && (
                <div>
                  <span className="text-emerald-600 block text-[11px]">Method:</span>
                  <span>{paymentStatus.method}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="bg-surface-muted/60 rounded-lg p-4 text-xs space-y-1.5">
              <div className="flex justify-between font-medium text-foreground">
                <span>Selected Gateway:</span>
                <span className="font-semibold text-lumera-primary">SSLCommerz (Bangladesh)</span>
              </div>
              <p className="text-lumera-text-muted text-[11px]">
                Supports Visa, Mastercard, Amex, bKash, Nagad, Rocket, and Internet Banking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                onClick={handleInitiatePayment}
                disabled={initiatingPayment}
                className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
              >
                {initiatingPayment ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Connecting to Gateway...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>
                      {isFailed ? "Retry Payment" : `Pay ${order.currency} $${order.total}`}
                    </span>
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fetchOrderAndPayment()}
                className="w-full sm:w-auto gap-1.5 text-xs"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Check Verification Status</span>
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Ordered Items Snapshot Card */}
      <Card className="p-6 bg-card border-border">
        <h2 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-lumera-primary" />
          <span>Purchased Items Snapshot</span>
        </h2>

        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded bg-surface-muted overflow-hidden shrink-0 border border-border/50">
                  {item.product_image ? (
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
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
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-lumera-text-muted">
                    SKU: {item.product_sku} &bull; Qty: {item.quantity} &times; ${item.unit_price}
                  </p>
                </div>
              </div>
              <div className="text-sm font-mono font-semibold text-foreground shrink-0">
                ${item.line_total}
              </div>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="mt-6 pt-4 border-t border-border space-y-2 text-xs">
          <div className="flex justify-between text-lumera-text-muted">
            <span>Subtotal</span>
            <span className="font-mono text-foreground">${order.subtotal}</span>
          </div>
          <div className="flex justify-between text-lumera-text-muted">
            <span>Shipping</span>
            <span className="font-mono text-foreground">${order.shipping_cost}</span>
          </div>
          {order.discount_total !== "0.00" && (
            <div className="flex justify-between text-emerald-600">
              <span>Discounts</span>
              <span className="font-mono">-${order.discount_total}</span>
            </div>
          )}
          <div className="pt-2 border-t border-border flex justify-between items-baseline font-semibold text-sm">
            <span className="font-serif text-base text-foreground">Total Paid / Due</span>
            <span className="font-serif text-xl text-foreground">${order.total}</span>
          </div>
        </div>
      </Card>

      {/* Delivery & Shipping Information Card */}
      <Card className="p-6 bg-card border-border">
        <h2 className="font-serif text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-lumera-primary" />
          <span>Delivery Details</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-lumera-text-muted block">Recipient</span>
            <span className="font-medium text-foreground text-sm">
              {order.shipping_address.full_name}
            </span>
            <span className="text-lumera-text-muted block mt-0.5">
              {order.shipping_address.phone}
            </span>
          </div>
          <div>
            <span className="text-lumera-text-muted block">Shipping Address</span>
            <p className="text-foreground leading-relaxed">
              {order.shipping_address.address}
              {order.shipping_address.address_line2
                ? `, ${order.shipping_address.address_line2}`
                : ""}
              <br />
              {order.shipping_address.area ? `${order.shipping_address.area}, ` : ""}
              {order.shipping_address.city}
              {order.shipping_address.postal_code
                ? ` - ${order.shipping_address.postal_code}`
                : ""}
              <br />
              {order.shipping_address.country}
            </p>
          </div>
        </div>
        {order.customer_notes && (
          <div className="mt-4 pt-3 border-t border-border text-xs">
            <span className="text-lumera-text-muted block">Delivery Instructions:</span>
            <p className="italic text-foreground mt-0.5">{order.customer_notes}</p>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link href="/products" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto gap-2">
            <span>Continue Shopping</span>
          </Button>
        </Link>
        <Link href="/account/orders" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full sm:w-auto gap-2">
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
