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
import { ArrowLeft, Package, ShoppingBag, Truck, Clock } from "lucide-react";

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const orderId = typeof params?.id === "string" ? params.id : "";
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!orderId) return;

    let isMounted = true;
    setLoading(true);

    api
      .getCustomerOrder(orderId)
      .then((data) => {
        if (!isMounted) return;
        setOrder(data);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load order details.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderId, isAuthenticated, authLoading, router]);

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
            <Badge variant="primary">{order.status}</Badge>
          </div>
          <p className="text-xs text-lumera-text-muted">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            &bull; Payment: {order.payment_status}
          </p>
        </div>
      </div>

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
    </div>
  );
}
