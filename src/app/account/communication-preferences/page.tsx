"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { api, ApiError } from "@/lib/api/client";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CommunicationPreference } from "@/types/notifications";
import { ArrowLeft, BellRing, Mail, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CommunicationPreferencesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [preferences, setPreferences] = useState<CommunicationPreference | null>(null);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [marketingSms, setMarketingSms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function loadPreferences() {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const data = await api.getCommunicationPreferences();
        setPreferences(data);
        setMarketingEmail(data.marketing_email);
        setMarketingSms(data.marketing_sms);
      } catch (err: unknown) {
        setError(err instanceof ApiError ? err.message : "Failed to load preferences.");
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadPreferences();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const updated = await api.updateCommunicationPreferences({
        marketing_email: marketingEmail,
        marketing_sms: marketingSms,
      });
      setPreferences(updated);
      setMarketingEmail(updated.marketing_email);
      setMarketingSms(updated.marketing_sms);
      setMessage("Your communication preferences have been successfully updated.");
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Failed to update communication preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (loading && !preferences)) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-pulse space-y-4">
        <div className="h-6 bg-surface-muted rounded w-32" />
        <div className="h-64 bg-surface-muted rounded" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-sm text-lumera-text-muted hover:text-lumera-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Account</span>
      </Link>

      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-lumera-text">
          Communication Preferences
        </h1>
        <p className="text-sm text-lumera-text-muted mt-1">
          Manage how Penguin Mart communicates with you regarding your orders, account status, and wholesale promotions.
        </p>
      </div>

      {message && (
        <Alert variant="success" className="mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Transactional (Required) */}
        <Card className="p-6 border-l-4 border-l-emerald-600">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-lumera-text">
                    Operational & Transactional Notifications
                  </h2>
                  <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider">
                    Required
                  </Badge>
                </div>
                <p className="text-xs text-lumera-text-muted mt-1 leading-relaxed">
                  Important notices regarding order placements, payment confirmations, shipment tracking, return status updates, and account security.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-lumera-text-muted">
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-lumera-text-muted" />
              Sent to: <strong className="text-lumera-text font-medium">{user.email}</strong>
            </span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Always Active
            </span>
          </div>
        </Card>

        {/* Section 2: Marketing & Promotional Communication */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-surface-muted rounded-lg text-lumera-primary">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-lumera-text">
                Marketing & Promotional Updates
              </h2>
              <p className="text-xs text-lumera-text-muted">
                Choose which promotional updates and catalog announcements you wish to receive.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Marketing Email Toggle */}
            <div className="flex items-start justify-between p-4 rounded-lg bg-surface-muted/30 border border-border">
              <div className="flex items-start gap-3 pr-4">
                <Mail className="h-4 w-4 text-lumera-primary mt-0.5" />
                <div>
                  <label htmlFor="marketing_email" className="text-sm font-medium text-lumera-text cursor-pointer">
                    Wholesale Catalog & Promotional Emails
                  </label>
                  <p className="text-xs text-lumera-text-muted mt-0.5">
                    Receive announcements about seasonal inventory, exclusive bulk discounts, and new brand additions.
                  </p>
                </div>
              </div>
              <input
                id="marketing_email"
                type="checkbox"
                checked={marketingEmail}
                onChange={(e) => setMarketingEmail(e.target.checked)}
                className="h-4 w-4 mt-1 rounded border-border text-lumera-primary focus:ring-lumera-primary cursor-pointer"
              />
            </div>

            {/* Marketing SMS Toggle */}
            <div className="flex items-start justify-between p-4 rounded-lg bg-surface-muted/30 border border-border">
              <div className="flex items-start gap-3 pr-4">
                <MessageSquare className="h-4 w-4 text-lumera-primary mt-0.5" />
                <div>
                  <label htmlFor="marketing_sms" className="text-sm font-medium text-lumera-text cursor-pointer">
                    Promotional SMS Messages
                  </label>
                  <p className="text-xs text-lumera-text-muted mt-0.5">
                    Urgent restock alerts and time-sensitive flash promotions via text message (carrier rates may apply).
                  </p>
                </div>
              </div>
              <input
                id="marketing_sms"
                type="checkbox"
                checked={marketingSms}
                onChange={(e) => setMarketingSms(e.target.checked)}
                className="h-4 w-4 mt-1 rounded border-border text-lumera-primary focus:ring-lumera-primary cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Preferences"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
