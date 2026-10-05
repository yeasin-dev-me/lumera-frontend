"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { api, ApiError } from "@/lib/api/client";
import { OrderListItem } from "@/types/order";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ArrowLeft, Package, Clock, ArrowRight } from "lucide-react";

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/account/orders");
      return;
    }

    if (!isAuthenticated) return;

    let isMounted = true;
    setLoading(true);

    api
      .getCustomerOrders()
      .then((res) => {
        if (!isMounted) return;
        setOrders(res.results || []);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load your orders.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-4">
        <div className="h-6 bg-surface-muted rounded w-32" />
        <div className="h-48 bg-surface-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-xs text-lumera-primary hover:underline mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Account</span>
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            My Orders
          </h1>
          <p className="text-xs text-lumera-text-muted mt-1">
            Review past orders and track current fulfillment.
          </p>
        </div>
        <Link href="/products">
          <Button variant="secondary" size="sm">Shop More</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <Alert variant="danger" title="Error">
            {error}
          </Alert>
        </div>
      )}

      {orders.length === 0 ? (
        <Card className="p-8 text-center bg-card border-border">
          <div className="h-12 w-12 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-4 text-lumera-text-muted">
            <Package className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-lg font-semibold text-foreground mb-1">
            No Orders Yet
          </h2>
          <p className="text-xs text-lumera-text-muted max-w-sm mx-auto mb-6">
            You haven&apos;t placed any orders yet. When you complete checkout, your order
            history will appear here.
          </p>
          <Link href="/products">
            <Button variant="primary" size="sm">Browse Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <Card key={ord.public_id} className="p-5 bg-card border-border hover:border-lumera-primary/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    #{ord.order_number}
                  </span>
                  <Badge variant="primary">{ord.status}</Badge>
                  <span className="text-[11px] text-lumera-text-muted bg-surface-muted px-2 py-0.5 rounded">
                    Payment: {ord.payment_status}
                  </span>
                </div>
                <span className="text-xs text-lumera-text-muted">
                  {new Date(ord.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div className="text-xs text-lumera-text-muted">
                  <span>{ord.item_count} {ord.item_count === 1 ? "item" : "items"}</span>
                  <span className="mx-2">&bull;</span>
                  <span className="font-semibold text-foreground font-mono text-sm">
                    ${ord.total}
                  </span>
                </div>
                <Link href={`/account/orders/${ord.public_id}`}>
                  <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
