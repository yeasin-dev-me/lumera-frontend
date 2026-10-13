import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Truck, RotateCcw, Clock, ShieldCheck, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "Learn about Penguin Mart's eco-conscious packaging, domestic & international shipping timelines, and 30-day return policy.",
};

export default function ShippingPage() {
  return (
    <div className="space-y-10 pb-16">
      <Breadcrumb items={[{ label: "Shipping & Returns" }]} />

      <div className="max-w-2xl space-y-2">
        <span className="text-xs uppercase tracking-widest text-lumera-primary font-semibold">
          Customer Care
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-lumera-text">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-lumera-text-muted leading-relaxed">
          Every Penguin Mart package is safely packed in protective materials and shipped with biodegradable, compostable cushioning.
        </p>
      </div>

      {/* Shipping Options Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border/80 bg-surface p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-lumera-cream border border-border flex items-center justify-center text-lumera-primary">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-medium text-lumera-text">Standard Ground</h3>
          <p className="text-2xl font-serif font-bold text-lumera-primary">$5.00 <span className="text-xs font-normal text-lumera-text-muted">or Free over $75</span></p>
          <ul className="text-xs text-lumera-text-muted space-y-2 pt-2 border-t border-border/60">
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 3–5 business days</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Carbon-neutral dispatch</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Full courier tracking</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-lumera-primary/40 bg-surface p-6 space-y-3 shadow-md relative">
          <div className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-lumera-primary text-white">
            Fastest
          </div>
          <div className="w-10 h-10 rounded-xl bg-lumera-cream border border-border flex items-center justify-center text-lumera-primary">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-medium text-lumera-text">Express Air Delivery</h3>
          <p className="text-2xl font-serif font-bold text-lumera-primary">$15.00</p>
          <ul className="text-xs text-lumera-text-muted space-y-2 pt-2 border-t border-border/60">
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 1–2 business days</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Priority handling & pack</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Real-time SMS notifications</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/80 bg-surface p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-lumera-cream border border-border flex items-center justify-center text-lumera-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-medium text-lumera-text">International Express</h3>
          <p className="text-2xl font-serif font-bold text-lumera-primary">$25.00</p>
          <ul className="text-xs text-lumera-text-muted space-y-2 pt-2 border-t border-border/60">
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 4–7 business days</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 45+ countries supported</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Duties calculated at checkout</li>
          </ul>
        </div>
      </div>

      {/* Return Policy Section */}
      <div className="rounded-2xl border border-border/80 bg-surface p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-medium text-lumera-text">30-Day Satisfaction Guarantee & Returns</h2>
            <p className="text-xs text-lumera-text-muted">Effortless customer-first return process.</p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-lumera-text-muted space-y-3 leading-relaxed pt-2 border-t border-border/60">
          <p>
            We take tremendous pride in the quality and efficacy of our botanical formulations. If a product does not satisfy your skincare expectations, you may return the gently used bottle within 30 days of delivery.
          </p>
          <p>
            To initiate a return:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Visit your <Link href="/account/returns" className="text-lumera-primary font-semibold hover:underline">Account Returns Portal</Link>.</li>
            <li>Select your order and the specific item(s) you wish to return.</li>
            <li>Print the prepaid return shipping label and drop off the package at any authorized parcel location.</li>
          </ol>
          <p>
            Once received at our atelier, refunds are credited back to your original payment method within 3–5 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
