"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import Image from "next/image";
import { Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="max-w-md mx-auto py-8 sm:py-14 px-2 sm:px-0">
      <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md ring-2 ring-lumera-primary/20 mb-3">
          <Image
            src="/penguin-mart-logo.jpg"
            alt="Penguin Mart Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-lumera-primary">
          Penguin Mart Client Portal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-lumera-text mt-1">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-lumera-text-muted mt-2">
          Join Penguin Mart to enjoy personalized skincare and track your orders
        </p>
      </div>

      <Card className="p-6 sm:p-8 rounded-2xl border border-border/80 shadow-md">
        {error && (
          <Alert variant="danger" className="mb-5" title="Registration failed">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="register-firstname"
                className="block text-xs font-semibold text-lumera-text mb-1.5"
              >
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-lumera-text-muted" />
                <input
                  id="register-firstname"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="w-full h-12 pl-10 pr-3 rounded-xl border border-border bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="register-lastname"
                className="block text-xs font-semibold text-lumera-text mb-1.5"
              >
                Last Name
              </label>
              <input
                id="register-lastname"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full h-12 px-3.5 rounded-xl border border-border bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="block text-xs font-semibold text-lumera-text mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-lumera-text-muted" />
              <input
                id="register-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-phone"
              className="block text-xs font-semibold text-lumera-text mb-1.5"
            >
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-lumera-text-muted" />
              <input
                id="register-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="block text-xs font-semibold text-lumera-text mb-1.5"
            >
              Password (Min. 10 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-lumera-text-muted" />
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-12 pl-10 pr-11 rounded-xl border border-border bg-background text-base sm:text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-2 focus:ring-lumera-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-lumera-text-muted hover:text-lumera-text transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-lumera-primary text-white text-sm font-semibold hover:bg-lumera-primary-hover disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 mt-2"
          >
            <span>{isSubmitting ? "Creating Account..." : "Create Penguin Mart Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/80 text-center text-xs text-lumera-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-lumera-primary hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
