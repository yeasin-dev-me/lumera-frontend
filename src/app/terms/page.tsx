import React from "react";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Penguin Mart Skincare & Beauty terms and conditions of purchase and website use.",
};

export default function TermsPage() {
  return (
    <div className="space-y-6 pb-16 max-w-3xl">
      <Breadcrumb items={[{ label: "Terms of Service" }]} />

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-lumera-primary font-semibold">
          Legal & Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-lumera-text">
          Terms of Service
        </h1>
        <p className="text-xs text-lumera-text-muted">Last Updated: October 13, 2026</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border/80 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-lumera-text-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-lumera-text">1. Agreement to Terms</h2>
          <p>
            By accessing or using the Penguin Mart e-commerce platform and purchasing products, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-lumera-text">2. Product Formulations & Usage</h2>
          <p>
            Penguin Mart cosmetic products are intended for topical skincare and beauty use only. Information provided on this site is not intended to diagnose, treat, cure, or prevent any medical condition. Please perform a patch test prior to full application if you have allergies or hypersensitive skin.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-lumera-text">3. Pricing & Orders</h2>
          <p>
            All prices are listed in USD (or local designated currency) and are subject to change without notice. We reserve the right to cancel or limit orders that appear fraudulent, exceed wholesale volume caps, or violate our terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-lumera-text">4. Returns & Cancellations</h2>
          <p>
            Orders can be cancelled before dispatch directly from your customer account dashboard. For dispatched items, please refer to our 30-day Satisfaction Guarantee outlined in our Shipping & Returns policy.
          </p>
        </section>
      </div>
    </div>
  );
}
