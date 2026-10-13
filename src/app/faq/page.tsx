"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Accordion } from "@/components/ui/Accordion";
import { Search, HelpCircle, ArrowRight } from "lucide-react";

const FAQ_ITEMS = [
  {
    id: "ingredients-organic",
    category: "ingredients",
    title: "Are Penguin Mart formulations 100% natural and organic?",
    children: (
      <p>
        Yes. All botanical extracts and oils are sourced from certified organic or biodynamic agriculture. We utilize cold-pressing and bio-fermentation methods to preserve nutrient potency. None of our formulations contain parabens, phthalates, synthetic perfumes, or sulfates.
      </p>
    ),
    defaultOpen: true,
  },
  {
    id: "sensitive-skin",
    category: "ingredients",
    title: "Can I use Penguin Mart products if I have sensitive or rosacea-prone skin?",
    children: (
      <p>
        Our formulations are specifically designed to respect and rebuild compromised lipid barriers. Products such as our Ceramide Barrier Defense Cream and Hydrating Rose Water Mist have undergone clinical hypoallergenic patch testing on sensitive skin panels.
      </p>
    ),
  },
  {
    id: "shelf-life",
    category: "ingredients",
    title: "What is the shelf life of your botanical formulations?",
    children: (
      <p>
        Because we formulate without harsh synthetic preservatives, our unopened products have a shelf life of 24 months. Once opened, we recommend utilizing your botanical treatments within 6 to 9 months for maximum antioxidant vitality.
      </p>
    ),
  },
  {
    id: "shipping-times",
    category: "shipping",
    title: "How long does shipping take and how do I track my order?",
    children: (
      <p>
        Orders are processed within 24 to 48 hours. Standard domestic shipping arrives in 3–5 business days, and DHL Express delivers in 1–2 business days. Once your order ships, you will receive an email containing real-time courier tracking details. You can also monitor delivery directly in your Account Orders dashboard.
      </p>
    ),
  },
  {
    id: "international-shipping",
    category: "shipping",
    title: "Do you offer international shipping?",
    children: (
      <p>
        Yes, Penguin Mart ships to over 45 countries worldwide via DHL Express. International delivery takes approximately 4–7 business days depending on customs clearance. Taxes and duties are calculated at checkout where applicable.
      </p>
    ),
  },
  {
    id: "returns-policy",
    category: "returns",
    title: "What is your return and satisfaction policy?",
    children: (
      <p>
        We want you to love your skincare ritual. If a formulation does not suit your skin, we offer a 30-day satisfaction guarantee. You may initiate a return directly from your Account Returns portal for a full product refund or exchange.
      </p>
    ),
  },
  {
    id: "payment-methods",
    category: "payment",
    title: "What payment methods are accepted?",
    children: (
      <p>
        We accept Visa, MasterCard, American Express, Apple Pay, Google Pay, PayPal, and SSLCommerz. All transactions are securely encrypted via bank-grade 256-bit SSL protocols.
      </p>
    ),
  },
];

export default function FAQPage() {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredItems = filterQuery.trim()
    ? FAQ_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : FAQ_ITEMS;

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: "Frequently Asked Questions" }]} />

      <div className="max-w-2xl space-y-3">
        <span className="text-xs uppercase tracking-widest text-lumera-primary font-semibold">
          Knowledge Base
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-lumera-text">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-lumera-text-muted leading-relaxed">
          Find answers about our botanical formulations, clinical testing, shipping, order tracking, and returns.
        </p>

        {/* Quick Search */}
        <div className="relative pt-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-lumera-text-muted" />
          <input
            type="search"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter questions (e.g. shipping, sensitive skin, returns)..."
            className="w-full h-11 pl-10 pr-4 rounded-full border border-border bg-surface text-sm text-lumera-text placeholder:text-lumera-text-muted/70 focus:outline-none focus:border-lumera-primary focus:ring-1 focus:ring-lumera-primary shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Accordion FAQ list */}
      <div className="bg-surface rounded-2xl border border-border/80 p-6 sm:p-8 shadow-sm">
        {filteredItems.length > 0 ? (
          <Accordion items={filteredItems} allowMultiple={true} />
        ) : (
          <div className="py-12 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-lumera-text-muted mx-auto opacity-50" />
            <p className="text-sm font-medium text-lumera-text">
              No questions matched &ldquo;{filterQuery}&rdquo;
            </p>
            <p className="text-xs text-lumera-text-muted">
              Can&apos;t find what you are looking for? Our client concierge is here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs text-lumera-primary font-semibold hover:underline pt-2"
            >
              <span>Contact Client Care</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Bottom CTA Card */}
      <div className="rounded-2xl border border-border/70 bg-surface-muted/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif text-lg font-medium text-lumera-text">Have a custom skincare question?</h3>
          <p className="text-xs text-lumera-text-muted">Our licensed aestheticians provide personalized routine consultations.</p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-2.5 rounded-full bg-lumera-primary text-white text-xs sm:text-sm font-semibold hover:bg-lumera-primary-hover transition-colors shadow-sm shrink-0 active:scale-95"
        >
          Speak with Concierge
        </Link>
      </div>
    </div>
  );
}
