"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { User, Package, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-muted rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-surface-muted rounded" />
            <div className="h-32 bg-surface-muted rounded" />
            <div className="h-32 bg-surface-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-lumera-text">My Account</h1>
          <p className="text-sm text-lumera-text-muted mt-1">
            Welcome back, {user.first_name || user.email}
          </p>
        </div>
        <Badge variant="success" className="px-3 py-1 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Active Customer</span>
        </Badge>
      </div>

      {/* Account Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6 hover:border-lumera-primary transition-colors">
          <div className="flex items-center gap-3 mb-3 text-lumera-primary">
            <User className="h-5 w-5" />
            <h2 className="font-serif text-lg font-semibold text-lumera-text">Profile Information</h2>
          </div>
          <p className="text-xs text-lumera-text-muted mb-4">
            Manage your personal contact details and preferences.
          </p>
          <Link
            href="/account/profile"
            className="text-xs font-semibold text-lumera-primary hover:underline"
          >
            View Profile →
          </Link>
        </Card>

        <Card className="p-6 hover:border-lumera-primary transition-colors">
          <div className="flex items-center gap-3 mb-3 text-lumera-primary">
            <Package className="h-5 w-5" />
            <h2 className="font-serif text-lg font-semibold text-lumera-text">Order History</h2>
          </div>
          <p className="text-xs text-lumera-text-muted mb-4">
            Track, view, and manage your past and active orders.
          </p>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-lumera-primary hover:underline"
          >
            View Orders →
          </Link>
        </Card>

        <Card className="p-6 border-dashed bg-surface-muted/50">
          <div className="flex items-center gap-3 mb-3 text-lumera-text-muted">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="font-serif text-lg font-semibold text-lumera-text">Security</h2>
          </div>
          <p className="text-xs text-lumera-text-muted mb-2">
            JWT session authenticated with rotating refresh tokens.
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Session Protected</span>
        </Card>
      </div>

      {/* Profile Overview Card */}
      <Card className="mt-8 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-lumera-text mb-4">
          Personal Information Overview
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-lumera-text-muted" />
            <div>
              <dt className="text-xs text-lumera-text-muted">Email</dt>
              <dd className="font-medium text-lumera-text">{user.email}</dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-lumera-text-muted" />
            <div>
              <dt className="text-xs text-lumera-text-muted">Full Name</dt>
              <dd className="font-medium text-lumera-text">
                {user.first_name || user.last_name
                  ? `${user.first_name} ${user.last_name}`.trim()
                  : "Not provided"}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-lumera-text-muted" />
            <div>
              <dt className="text-xs text-lumera-text-muted">Phone</dt>
              <dd className="font-medium text-lumera-text">{user.phone || "Not provided"}</dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-lumera-text-muted" />
            <div>
              <dt className="text-xs text-lumera-text-muted">Member Since</dt>
              <dd className="font-medium text-lumera-text">
                {new Date(user.created_at).toLocaleDateString()}
              </dd>
            </div>
          </div>
        </dl>
      </Card>
    </div>
  );
}
