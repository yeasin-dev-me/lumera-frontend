"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { api, ApiError } from "@/lib/api/client";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { CustomerNotification } from "@/types/notifications";
import { ArrowLeft, Bell, Mail, Clock, CheckCircle2, AlertCircle, ShoppingBag, RotateCcw, CreditCard } from "lucide-react";

const EVENT_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  account_welcome: { label: "Welcome to Lumera", icon: Bell },
  order_placed: { label: "Order Placed", icon: ShoppingBag },
  payment_confirmed: { label: "Payment Confirmed", icon: CreditCard },
  payment_failed: { label: "Payment Failed", icon: AlertCircle },
  order_processing: { label: "Order Processing", icon: ShoppingBag },
  order_shipped: { label: "Order Shipped", icon: ShoppingBag },
  order_delivered: { label: "Order Delivered", icon: ShoppingBag },
  order_cancelled: { label: "Order Cancelled", icon: AlertCircle },
  return_requested: { label: "Return Requested", icon: RotateCcw },
  return_approved: { label: "Return Approved", icon: RotateCcw },
  return_rejected: { label: "Return Rejected", icon: RotateCcw },
  return_received: { label: "Return Received", icon: RotateCcw },
  refund_initiated: { label: "Refund Initiated", icon: CreditCard },
  refund_completed: { label: "Refund Completed", icon: CreditCard },
};

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchNotifications() {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const data = await api.getCustomerNotifications();
        setNotifications(data.results);
      } catch (err: unknown) {
        setError(err instanceof ApiError ? err.message : "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  if (authLoading || (loading && notifications.length === 0)) {
    return (
      <div className="max-w-3xl mx-auto py-12 animate-pulse space-y-4">
        <div className="h-6 bg-surface-muted rounded w-32" />
        <div className="h-24 bg-surface-muted rounded" />
        <div className="h-24 bg-surface-muted rounded" />
        <div className="h-24 bg-surface-muted rounded" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-sm text-lumera-text-muted hover:text-lumera-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Account</span>
      </Link>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-lumera-text">
            Notification History
          </h1>
          <p className="text-sm text-lumera-text-muted mt-1">
            Review recent operational, delivery, and transactional emails dispatched to your account.
          </p>
        </div>
        <Badge variant="muted" className="self-start sm:self-auto px-3 py-1 flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          <span>{notifications.length} {notifications.length === 1 ? "Record" : "Records"}</span>
        </Badge>
      </div>

      {error && (
        <Alert variant="danger" className="mb-6">
          {error}
        </Alert>
      )}

      {notifications.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Bell className="h-10 w-10 text-lumera-text-muted mx-auto mb-3 opacity-40" />
          <h3 className="font-medium text-lumera-text">No notifications yet</h3>
          <p className="text-xs text-lumera-text-muted mt-1 max-w-sm mx-auto">
            You will receive order confirmations, shipping tracking notices, and account updates here as operations occur.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const eventMeta = EVENT_LABELS[notif.event_type] || {
              label: notif.event_type.replace(/_/g, " "),
              icon: Bell,
            };
            const Icon = eventMeta.icon;

            return (
              <Card key={notif.public_id} className="p-5 hover:border-border-hover transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 bg-surface-muted rounded-lg text-lumera-primary mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold uppercase tracking-wider text-lumera-text-muted">
                          {eventMeta.label}
                        </span>
                        {notif.order_number && (
                          <Link
                            href="/account/orders"
                            className="text-xs font-mono text-lumera-primary hover:underline"
                          >
                            Order #{notif.order_number}
                          </Link>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-lumera-text mt-1">
                        {notif.subject}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-lumera-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(notif.created_at).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {notif.channel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {notif.status === "sent" ? (
                      <Badge variant="success" className="flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Delivered</span>
                      </Badge>
                    ) : notif.status === "pending" ? (
                      <Badge variant="muted" className="flex items-center gap-1 text-[11px]">
                        <Clock className="h-3 w-3" />
                        <span>Queued</span>
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="flex items-center gap-1 text-[11px]">
                        <AlertCircle className="h-3 w-3" />
                        <span>Failed</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
