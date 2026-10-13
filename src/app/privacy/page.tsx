import React from "react";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Penguin Mart Skincare & Beauty Privacy Policy and data protection terms.",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6 pb-16 max-w-3xl">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-lumera-primary font-semibold">
          Legal & Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-lumera-text">
          Privacy Policy
        </h1>
        <p className="text-xs text-lumera-text-muted">Last Updated: October 13, 2026</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border/80 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-lumera-text-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-lumera-text">1. Overview</h2>
          <p>
            At Penguin Mart (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), we respect your privacy and are committed to safeguarding your personal information. This Privacy Policy describes how we collect, store, utilize, and protect your information when you visit our website or purchase our skincare products.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-lumera-text">2. Information We Collect</h2>
          <p>
            When you create an account, complete an order, or subscribe to our newsletter, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact information (full name, email address, phone number).</li>
            <li>Shipping and billing addresses.</li>
            <li>Payment transaction records (we do not store raw credit card numbers; all payments are processed through PCI-DSS compliant providers).</li>
            <li>Purchase history and wishlist preferences.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-lumera-text">3. How We Use Your Data</h2>
          <p>
            Your information is used strictly to fulfill your orders, provide customer care assistance, notify you of order status updates, and—with your consent—send curated botanical newsletters. We will never sell, rent, or trade your personal data to third-party brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-lumera-text">4. Security</h2>
          <p>
            We implement industry-standard 256-bit TLS encryption across all web traffic. Authentication tokens are handled through secure, ephemeral session tokens and encrypted authorization protocols.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-lumera-text">5. Your Rights</h2>
          <p>
            You have the right to inspect, update, or request the deletion of your personal account data at any time by accessing your Profile settings or contacting care@penguinmart.com.
          </p>
        </section>
      </div>
    </div>
  );
}
