"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-context";
import { api, ApiError } from "@/lib/api/client";
import { OrderDetail } from "@/types/order";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  Clock,
  Check,
  XCircle,
  Copy,
  History,
} from "lucide-react";

const LIFECYCLE_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Payment Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const orderId = typeof params?.id === "string" ? params.id : "";
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initiatingPayment, setInitiatingPayment] = useState<boolean>(false);
  const [cancellingOrder, setCancellingOrder] = useState<boolean>(false);
  const [copiedTracking, setCopiedTracking] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = React.useCallback(() => {
    if (!orderId) return;
    setLoading(true);
    api
      .getCustomerOrder(orderId)
      .then((data) => {
        setOrder(data);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load order details.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, authLoading, router, fetchOrder]);

  const handlePayNow = async () => {
    if (!order) return;
    setInitiatingPayment(true);
    setPaymentError(null);

    try {
      const res = await api.initiatePayment(order.public_id, "sslcommerz");
      if (res.redirect_url) {
        window.location.href = res.redirect_url;
      } else {
        setPaymentError("Gateway did not return a valid payment URL.");
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

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm("Are you sure you want to cancel this order? This will release reserved inventory.")) {
      return;
    }
    setCancellingOrder(true);
    setActionError(null);

    try {
      const updated = await api.cancelCustomerOrder(order.public_id, "Cancelled by customer");
      setOrder(updated);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setActionError(err.message);
      } else {
        setActionError("Failed to cancel order.");
      }
    } finally {
      setCancellingOrder(false);
    }
  };

  const copyTrackingNumber = (trk: string) => {
    navigator.clipboard.writeText(trk);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-4">
        <div className="h-6 bg-surface-muted rounded w-32" />
        <div className="h-64 bg-surface-muted rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <Alert variant="danger" title="Error">
          {error || "Order not found."}
        </Alert>
        <div className="mt-6">
          <Link href="/account/orders">
            <Button variant="secondary">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPayable =
    order.payment_status !== "paid" && order.status !== "cancelled";
  const isPaid = order.payment_status === "paid";
  const canCustomerCancel =
    order.status === "pending" && order.payment_status === "pending";

  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      default:
        return -1;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-xs text-lumera-primary hover:underline mb-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Orders List</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
              Order #{order.order_number}
            </h1>
            <Badge variant={isCancelled ? "danger" : "primary"}>
              {order.status}
            </Badge>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isPaid
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : order.payment_status === "failed"
                  ? "bg-rose-50 text-rose-800 border border-rose-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              Payment: {order.payment_status}
            </span>
          </div>
          <p className="text-xs text-lumera-text-muted">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {canCustomerCancel && (
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancelOrder}
              disabled={cancellingOrder}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{cancellingOrder ? "Cancelling..." : "Cancel Order"}</span>
            </Button>
          </div>
        )}
      </div>

      {actionError && (
        <Alert variant="danger" title="Action Error">
          {actionError}
        </Alert>
      )}

      {/* Order Progression Stepper */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-lumera-text-muted mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-lumera-primary" />
          <span>Order Status Progression</span>
        </h2>

        {isCancelled ? (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center gap-3 text-rose-900">
            <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-rose-800">This order has been cancelled.</p>
              <p className="text-rose-700/90 text-[11px] mt-0.5">
                Reserved inventory was restored. Please contact support if you need assistance.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative pt-2 pb-1">
            <div className="flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-border z-0" />
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-lumera-primary transition-all duration-300 z-0"
                style={{
                  width: `${(Math.max(0, currentStepIdx) / (LIFECYCLE_STEPS.length - 1)) * 100}%`,
                }}
              />

              {LIFECYCLE_STEPS.map((step, idx) => {
                const isCompleted = currentStepIdx > idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center relative z-10 text-center"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                        isCompleted
                          ? "bg-lumera-primary text-white border-lumera-primary"
                          : isCurrent
                          ? "bg-surface-elevated text-lumera-primary border-lumera-primary ring-4 ring-lumera-primary/10"
                          : "bg-surface-elevated text-lumera-text-muted border-border"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-2 font-medium max-w-[70px] leading-tight ${
                        isCurrent
                          ? "text-foreground font-semibold"
                          : isCompleted
                          ? "text-foreground"
                          : "text-lumera-text-muted"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Fulfillment & Courier Tracking Card */}
      {(order.courier || order.tracking_number || order.status === "shipped" || order.status === "delivered") && (
        <Card className="p-6 bg-card border-border">
          <h2 className="font-serif text-base font-semibold text-foreground mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-lumera-primary" />
              <span>Courier & Tracking</span>
            </span>
            <Badge variant="primary">
              {order.status === "delivered" ? "Delivered" : "In Transit"}
            </Badge>
          </h2>

          <div className="bg-surface-muted/60 rounded-lg p-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-lumera-text-muted block">Courier Service</span>
                <span className="font-semibold text-foreground text-sm">
                  {order.courier || "Assigned Courier"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-lumera-text-muted block">Tracking Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-medium text-foreground bg-surface-elevated px-2 py-0.5 rounded border border-border">
                    {order.tracking_number || "Pending Assignment"}
                  </span>
                  {order.tracking_number && (
                    <button
                      type="button"
                      onClick={() => copyTrackingNumber(order.tracking_number!)}
                      className="text-lumera-primary hover:text-lumera-primary/80 transition-colors p-1"
                      title="Copy Tracking Number"
                    >
                      {copiedTracking ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {order.tracking_url && (
              <div className="pt-2 border-t border-border">
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-lumera-primary hover:underline font-medium"
                >
                  <span>Track Package on Courier Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-[11px] text-lumera-text-muted pt-1">
              {order.shipped_at && (
                <span>Shipped on: {new Date(order.shipped_at).toLocaleString("en-US")}</span>
              )}
              {order.delivered_at && (
                <span className="text-emerald-700 font-medium">
                  Delivered on: {new Date(order.delivered_at).toLocaleString("en-US")}
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Authoritative Payment Settlement Card */}
      <Card className="p-6 bg-card border-border">
        <h2 className="font-serif text-base font-semibold text-foreground mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-lumera-primary" />
            <span>Payment Details</span>
          </span>
          <span className="text-xs font-mono font-medium text-lumera-text-muted">
            ${order.total} {order.currency}
          </span>
        </h2>

        {paymentError && (
          <div className="mb-4">
            <Alert variant="danger" title="Payment Error">
              {paymentError}
            </Alert>
          </div>
        )}

        {isPaid ? (
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-3 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Payment Verified & Complete</span>
            </div>
            {order.payment?.provider_transaction_id && (
              <p className="text-[11px] font-mono">
                Transaction ID: {order.payment.provider_transaction_id}
              </p>
            )}
            {order.payment?.paid_at && (
              <p className="text-[11px]">
                Paid at: {new Date(order.payment.paid_at).toLocaleString("en-US")}
              </p>
            )}
          </div>
        ) : isPayable ? (
          <div className="bg-surface-muted/60 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Payment is currently pending for this order.</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handlePayNow}
                disabled={initiatingPayment}
                className="w-full sm:w-auto gap-2"
              >
                {initiatingPayment ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting to Gateway...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Pay Now (${order.total})</span>
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchOrder}
                className="w-full sm:w-auto gap-1 text-xs"
              >
                <RotateCw className="w-3 h-3" />
                <span>Refresh Status</span>
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-lumera-text-muted">
            Order is cancelled and no longer payable.
          </p>
        )}
      </Card>

      {/* Items Snapshot Card */}
      <Card className="p-6 bg-card border-border">
        <h2 className="font-serif text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-lumera-primary" />
          <span>Items Ordered ({order.items.length})</span>
        </h2>

        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
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
                  <p className="text-xs font-medium text-foreground truncate">
                    {item.product_name}
                  </p>
                  <p className="text-[11px] text-lumera-text-muted">
                    SKU: {item.product_sku} &bull; Qty: {item.quantity} &times; ${item.unit_price}
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono font-semibold text-foreground">
                ${item.line_total}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs">
          <div className="flex justify-between text-lumera-text-muted">
            <span>Subtotal</span>
            <span className="font-mono text-foreground">${order.subtotal}</span>
          </div>
          <div className="flex justify-between text-lumera-text-muted">
            <span>Shipping</span>
            <span className="font-mono text-foreground">${order.shipping_cost}</span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between items-baseline font-semibold text-sm">
            <span className="font-serif text-base text-foreground">Total</span>
            <span className="font-serif text-lg text-foreground">${order.total}</span>
          </div>
        </div>
      </Card>

      {/* Shipping Address */}
      <Card className="p-6 bg-card border-border">
        <h2 className="font-serif text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-lumera-primary" />
          <span>Shipping Information</span>
        </h2>
        <div className="text-xs text-lumera-text-muted space-y-1">
          <p className="font-medium text-foreground text-sm">
            {order.shipping_address.full_name}
          </p>
          <p>{order.shipping_address.phone}</p>
          <p>
            {order.shipping_address.address}
            {order.shipping_address.address_line2 ? `, ${order.shipping_address.address_line2}` : ""}
          </p>
          <p>
            {order.shipping_address.area ? `${order.shipping_address.area}, ` : ""}
            {order.shipping_address.city}
            {order.shipping_address.postal_code ? ` - ${order.shipping_address.postal_code}` : ""}
          </p>
          <p>{order.shipping_address.country}</p>
          {order.customer_notes && (
            <p className="pt-2 italic text-foreground border-t border-border mt-2">
              Note: {order.customer_notes}
            </p>
          )}
        </div>
      </Card>

      {/* Detailed Status History Audit Timeline */}
      {order.status_history && order.status_history.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="font-serif text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-lumera-primary" />
            <span>Order History Log</span>
          </h2>
          <div className="space-y-3">
            {order.status_history.map((hist, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 text-xs border-b border-border/50 pb-2.5 last:border-0 last:pb-0"
              >
                <div>
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <span className="capitalize">{hist.to_status}</span>
                    {hist.actor_type && (
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface-muted text-lumera-text-muted">
                        by {hist.actor_type}
                      </span>
                    )}
                  </div>
                  {hist.reason && (
                    <p className="text-[11px] text-lumera-text-muted mt-0.5">
                      {hist.reason}
                    </p>
                  )}
                </div>
                <span className="text-[11px] text-lumera-text-muted shrink-0 font-mono">
                  {new Date(hist.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
