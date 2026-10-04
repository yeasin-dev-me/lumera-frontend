"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.push("/account");
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-semibold text-lumera-text">Welcome Back</h1>
        <p className="text-sm text-lumera-text-muted mt-2">
          Sign in to access your Lumera account and orders
        </p>
      </div>

      <Card className="p-8 shadow-sm">
        {error && (
          <Alert variant="danger" className="mb-6" title="Unable to sign in">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-lumera-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-sm text-lumera-text focus:outline-none focus:ring-2 focus:ring-lumera-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-lumera-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-sm text-lumera-text focus:outline-none focus:ring-2 focus:ring-lumera-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full justify-center py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-lumera-text-muted">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-semibold text-lumera-primary hover:underline">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}
