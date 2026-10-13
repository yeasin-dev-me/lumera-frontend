import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Leaf, ShieldCheck, Sparkles, HeartHandshake, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — The Penguin Mart Philosophy",
  description: "Learn about Penguin Mart's commitment to pure skincare & beauty, clean ingredients, and radiant skin barrier health.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-16">
      <Breadcrumb items={[{ label: "About Us" }]} />

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-lumera-primary to-lumera-primary-hover text-white p-8 sm:p-16 text-center shadow-lg">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 mx-auto rounded-full overflow-hidden border-2 border-white/60 shadow-md">
            <Image
              src="/penguin-mart-logo.jpg"
              alt="Penguin Mart Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <span className="text-xs uppercase tracking-widest text-lumera-accent font-semibold block">
            The Penguin Mart Standard
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight leading-tight">
            Skin Care &amp; Beauty for Pure Radiance.
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
            Founded with the belief that healthy, glowing skin comes from biocompatible botanicals and gentle, effective formulations. Penguin Mart crafts every ritual without compromise.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border/80 bg-surface p-6 sm:p-8 space-y-4 hover:border-lumera-primary/40 transition-colors shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-lumera-cream border border-border flex items-center justify-center text-lumera-primary">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-medium text-lumera-text">Cold-Pressed Botanicals</h3>
          <p className="text-xs sm:text-sm text-lumera-text-muted leading-relaxed">
            We source virgin, cold-pressed plant seeds and bio-ferments from regenerative farms to preserve thermolabile nutrients, antioxidants, and active enzymes.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-surface p-6 sm:p-8 space-y-4 hover:border-lumera-primary/40 transition-colors shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-lumera-cream border border-border flex items-center justify-center text-lumera-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-medium text-lumera-text">Clinical Verification</h3>
          <p className="text-xs sm:text-sm text-lumera-text-muted leading-relaxed">
            Every formulation undergoes rigorous dermatologist supervision and hypoallergenic patch testing to ensure deep cellular barrier repair without irritation.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-surface p-6 sm:p-8 space-y-4 hover:border-lumera-primary/40 transition-colors shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-lumera-cream border border-border flex items-center justify-center text-lumera-primary">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-medium text-lumera-text">Radical Transparency</h3>
          <p className="text-xs sm:text-sm text-lumera-text-muted leading-relaxed">
            100% cruelty-free, vegan certified, and packaged in endlessly recyclable ultraviolet violet glass to preserve photochemical integrity sustainably.
          </p>
        </div>
      </section>

      {/* Story & Formulation Standards */}
      <section className="rounded-2xl border border-border/70 bg-surface-muted/40 p-6 sm:p-12 space-y-6">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-lumera-primary">
            Our Formulation Standard
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-lumera-text">
            Formulated without 2,000+ questionable compounds.
          </h2>
          <p className="text-xs sm:text-sm text-lumera-text-muted leading-relaxed">
            We adhere to the strictest clean beauty standards globally. Every serum, cream, and cleanser is free from synthetic fragrances, artificial parabens, sulfates, phthalates, silicones, and petrochemical carriers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60">
          <div className="p-4 rounded-xl bg-surface border border-border/60 text-center">
            <span className="block font-serif text-2xl sm:text-3xl font-bold text-lumera-primary">100%</span>
            <span className="text-[11px] text-lumera-text-muted uppercase tracking-wider font-semibold">Vegan & Clean</span>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/60 text-center">
            <span className="block font-serif text-2xl sm:text-3xl font-bold text-lumera-primary">0%</span>
            <span className="text-[11px] text-lumera-text-muted uppercase tracking-wider font-semibold">Fillers & Toxins</span>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/60 text-center">
            <span className="block font-serif text-2xl sm:text-3xl font-bold text-lumera-primary">98%</span>
            <span className="text-[11px] text-lumera-text-muted uppercase tracking-wider font-semibold">Barrier Repair</span>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/60 text-center">
            <span className="block font-serif text-2xl sm:text-3xl font-bold text-lumera-primary">Eco</span>
            <span className="text-[11px] text-lumera-text-muted uppercase tracking-wider font-semibold">Glass Packaging</span>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lumera-primary text-white text-xs sm:text-sm font-semibold hover:bg-lumera-primary-hover transition-colors shadow-sm active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore The Collection</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
