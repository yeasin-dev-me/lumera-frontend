"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Lock, Mail, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone,
      });
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
        <h1 className="font-serif text-3xl font-semibold text-lumera-text">Create Account</h1>
        <p className="text-sm text-lumera-text-muted mt-2">
          Join Lumera to enjoy personalized skincare and track your orders
        </p>
      </div>

      <Card className="p-8 shadow-sm">
        {error && (
          <Alert variant="danger" className="mb-6" title="Registration failed">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-lumera-text-muted" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="w-full pl-10 pr-3 py-2.5 rounded-md border border-border bg-background text-sm text-lumera-text focus:outline-none focus:ring-2 focus:ring-lumera-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-lumera-text mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-3 py-2.5 rounded-md border border-border bg-background text-sm text-lumera-text focus:outline-none focus:ring-2 focus:ring-lumera-primary"
              />
            </div>
          </div>

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
              Phone (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-lumera-text-muted" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
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
                minLength={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 10 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-sm text-lumera-text focus:outline-none focus:ring-2 focus:ring-lumera-primary"
              />
            </div>
            <p className="text-[11px] text-lumera-text-muted mt-1.5">
              Must be at least 10 characters and cannot be entirely numeric or common.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full justify-center py-2.5 mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-lumera-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-lumera-primary hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
