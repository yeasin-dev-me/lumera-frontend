"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { api, ApiError } from "@/lib/api/client";
import { CustomerReturn } from "@/types/api";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function ReturnsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [returns, setReturns] = useState<CustomerReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated) {
      api.getCustomerReturns()
        .then(setReturns)
        .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Unable to load returns."))
        .finally(() => setLoading(false));
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || loading) {
    return <div className="max-w-3xl mx-auto py-12 animate-pulse"><div className="h-64 bg-surface-muted rounded" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-lumera-text">My Returns</h1>
        <p className="text-xs text-lumera-text-muted mt-1">Track return requests submitted for delivered orders.</p>
      </div>
      {error && <Alert variant="danger" title="Returns error">{error}</Alert>}
      {returns.length === 0 ? (
        <Card className="p-6 text-sm text-lumera-text-muted">You have not submitted any return requests.</Card>
      ) : (
        <div className="space-y-3">
          {returns.map((item) => (
            <Card key={item.public_id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-xs text-lumera-text-muted">Order {item.order_public_id}</p>
                  <p className="text-sm font-medium text-lumera-text mt-1">{item.reason}</p>
                </div>
                <Badge variant={item.status === "rejected" ? "danger" : item.status === "received" ? "success" : "accent"}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-xs text-lumera-text-muted mt-3">
                {item.items.map((entry) => `${entry.product_name} × ${entry.quantity}`).join(", ")}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
