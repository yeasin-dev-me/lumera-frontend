"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Package, Clock } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-pulse space-y-4">
        <div className="h-6 bg-surface-muted rounded w-32" />
        <div className="h-64 bg-surface-muted rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-xs text-lumera-primary hover:underline mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Account</span>
      </Link>

      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-lumera-text">My Orders</h1>
        <p className="text-xs text-lumera-text-muted mt-1">
          Review past orders and track current shipments.
        </p>
      </div>

      <Card className="p-8 text-center bg-surface-muted/30">
        <div className="h-12 w-12 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-4 text-lumera-text-muted">
          <Package className="h-6 w-6" />
        </div>
        <h2 className="font-serif text-lg font-semibold text-lumera-text mb-1">No Orders Yet</h2>
        <p className="text-xs text-lumera-text-muted max-w-sm mx-auto mb-6">
          You haven&apos;t placed any orders yet. When you make your first purchase, it will appear here.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-lumera-accent font-medium bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          <Clock className="h-3.5 w-3.5" />
          <span>Orders API integration scheduled for Slice 5</span>
        </div>
      </Card>
    </div>
  );
}
