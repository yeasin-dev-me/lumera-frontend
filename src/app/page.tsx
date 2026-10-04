"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CheckCircle2, Server, ShieldCheck, Layers, RefreshCw } from "lucide-react";

export default function StorefrontHomePage() {
  const [healthStatus, setHealthStatus] = useState<string>("Checking...");
  const [backendConfig, setBackendConfig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      const health = await api.getHealth();
      setHealthStatus(health.status);
      const config = await api.getConfig();
      setBackendConfig(config);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(`Backend Error (${err.code}): ${err.message}`);
      } else {
        setError("Unable to communicate with the Backend API.");
      }
      setHealthStatus("unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 max-w-3xl mx-auto space-y-4">
        <Badge variant="accent">TASK-002 Foundation Ready</Badge>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-lumera-text leading-tight">
          Pure formulations for luminous, healthy skin.
        </h1>
        <p className="text-lumera-text-muted text-lg max-w-xl mx-auto">
          Welcome to the Lumera Customer Storefront foundation. Engineered with Next.js,
          TypeScript, and Tailwind CSS.
        </p>
      </section>

      {/* Backend Integration Live Status Card */}
      <section className="max-w-2xl mx-auto">
        <Card lifted className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-lumera-primary/10 text-lumera-primary">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lumera-text">Backend API Integration</h3>
                <p className="text-xs text-lumera-text-muted">
                  Validating Storefront ↔ Django REST API connection
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              isLoading={loading}
              onClick={checkBackend}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Ping API</span>
            </Button>
          </div>

          {error ? (
            <Alert variant="warning" title="Connection Notice">
              {error}
              <div className="mt-2 text-xs opacity-80">
                Ensure backend is running locally at <code>http://localhost:8000</code> or via Docker Compose.
              </div>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-surface-muted text-sm">
                <span className="text-lumera-text-muted">API Health Status:</span>
                <span className="font-mono font-medium flex items-center gap-1.5 text-lumera-success">
                  <CheckCircle2 className="h-4 w-4" />
                  {healthStatus.toUpperCase()}
                </span>
              </div>

              {backendConfig && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded border border-border bg-surface">
                    <span className="text-lumera-text-muted block">Platform</span>
                    <span className="font-semibold text-lumera-text">{backendConfig.site_name}</span>
                  </div>
                  <div className="p-2.5 rounded border border-border bg-surface">
                    <span className="text-lumera-text-muted block">API Version</span>
                    <span className="font-semibold text-lumera-text">{backendConfig.version}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Architecture Pillars */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-lumera-text-muted">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-lumera-primary mt-0.5" />
              <div>
                <strong className="text-lumera-text block">Authoritative Backend</strong>
                Prices and inventory calculated strictly server-side.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Layers className="h-4 w-4 text-lumera-accent mt-0.5" />
              <div>
                <strong className="text-lumera-text block">Centralized API Client</strong>
                Type-safe, normalized error handling for all views.
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
