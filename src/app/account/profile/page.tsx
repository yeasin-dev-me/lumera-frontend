"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { api, ApiError } from "@/lib/api/client";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, User, Mail, Phone, Calendar, Shield } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, refreshProfile } = useAuth();
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || "",
      });
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-pulse space-y-4">
        <div className="h-6 bg-surface-muted rounded w-32" />
        <div className="h-64 bg-surface-muted rounded" />
      </div>
    );
  }

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await api.updateMe(form);
      await refreshProfile();
      setMessage("Profile updated.");
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

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
        <h1 className="font-serif text-2xl font-semibold text-lumera-text">Customer Profile</h1>
        <p className="text-xs text-lumera-text-muted mt-1">
          Your personal details authenticated via Penguin Mart Customer API.
        </p>
      </div>

      {message && <Alert variant="success" title="Saved">{message}</Alert>}
      {error && <Alert variant="danger" title="Update failed">{error}</Alert>}

      <Card className="p-6">
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["first_name", "last_name", "phone"] as const).map((field) => (
              <label key={field} className="text-xs text-lumera-text-muted">
                <span className="block mb-1 capitalize">{field.replace("_", " ")}</span>
                <input
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-lumera-text"
                  value={form[field]}
                  onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                />
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={saving}>Save profile</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 divide-y divide-border">
        <div className="py-4 first:pt-0">
          <span className="text-xs text-lumera-text-muted block mb-1">Customer Identifier (UUID)</span>
          <span className="text-xs font-mono bg-surface-muted px-2 py-1 rounded text-lumera-text">
            {user.id}
          </span>
        </div>

        <div className="py-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-lumera-text-muted block">Email Address</span>
            <span className="text-sm font-medium text-lumera-text">{user.email}</span>
          </div>
          <Mail className="h-4 w-4 text-lumera-text-muted" />
        </div>

        <div className="py-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-lumera-text-muted block">First Name</span>
            <span className="text-sm font-medium text-lumera-text">{user.first_name || "—"}</span>
          </div>
          <User className="h-4 w-4 text-lumera-text-muted" />
        </div>

        <div className="py-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-lumera-text-muted block">Last Name</span>
            <span className="text-sm font-medium text-lumera-text">{user.last_name || "—"}</span>
          </div>
          <User className="h-4 w-4 text-lumera-text-muted" />
        </div>

        <div className="py-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-lumera-text-muted block">Phone</span>
            <span className="text-sm font-medium text-lumera-text">{user.phone || "—"}</span>
          </div>
          <Phone className="h-4 w-4 text-lumera-text-muted" />
        </div>

        <div className="py-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-lumera-text-muted block">Account Status</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Active Verified
            </span>
          </div>
          <Shield className="h-4 w-4 text-emerald-600" />
        </div>

        <div className="py-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-lumera-text-muted block">Created Date</span>
            <span className="text-sm text-lumera-text">{new Date(user.created_at).toLocaleString()}</span>
          </div>
          <Calendar className="h-4 w-4 text-lumera-text-muted" />
        </div>
      </Card>
    </div>
  );
}
