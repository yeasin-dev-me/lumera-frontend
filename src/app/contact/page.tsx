"use client";

import React, { useState } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Mail, Phone, MapPin, Clock, CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Customer Care",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: "Contact Us" }]} />

      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-widest text-lumera-primary font-semibold">
          Client Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-lumera-text mt-1">
          How can we assist your ritual?
        </h1>
        <p className="text-xs sm:text-sm text-lumera-text-muted mt-2 leading-relaxed">
          Our botanical skincare specialists are available Monday through Friday to assist with product guidance, order inquiries, and wholesale requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-2">
            <div className="flex items-center gap-2 text-lumera-primary font-medium text-sm">
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </div>
            <p className="text-xs text-lumera-text-muted">Dedicated client responses within 24 hours.</p>
            <a
              href="mailto:care@penguinmart.com"
              className="text-sm font-semibold text-lumera-text hover:text-lumera-primary transition-colors block"
            >
              care@penguinmart.com
            </a>
          </div>

          <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-2">
            <div className="flex items-center gap-2 text-lumera-primary font-medium text-sm">
              <Phone className="w-4 h-4" />
              <span>Concierge Phone</span>
            </div>
            <p className="text-xs text-lumera-text-muted">Toll-free customer assistance.</p>
            <a
              href="tel:+18005550199"
              className="text-sm font-semibold text-lumera-text hover:text-lumera-primary transition-colors block"
            >
              +1 (800) 555-0199
            </a>
          </div>

          <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-2">
            <div className="flex items-center gap-2 text-lumera-primary font-medium text-sm">
              <Clock className="w-4 h-4" />
              <span>Concierge Hours</span>
            </div>
            <p className="text-xs text-lumera-text-muted">Monday – Friday: 9:00 AM – 6:00 PM EST</p>
            <p className="text-xs text-lumera-text-muted">Saturday – Sunday: Closed for botanical rest</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-2">
            <div className="flex items-center gap-2 text-lumera-primary font-medium text-sm">
              <MapPin className="w-4 h-4" />
              <span>Botanical Atelier</span>
            </div>
            <p className="text-xs text-lumera-text-muted">
              450 Sutter Botanical Way, Suite 800<br />
              San Francisco, CA 94108, USA
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-lumera-text">Message Received</h3>
              <p className="text-xs sm:text-sm text-lumera-text-muted max-w-md mx-auto">
                Thank you for contacting Penguin Mart. A client specialist will review your inquiry and respond to {formData.email} within 24 business hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "Customer Care", message: "" });
                }}
                className="px-6 py-2.5 rounded-full border border-border text-xs sm:text-sm font-semibold text-lumera-text hover:bg-surface-muted transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-xl font-medium text-lumera-text">Send an Inquiry</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-lumera-text">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Evelyn Vane"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-1 focus:ring-lumera-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-lumera-text">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="evelyn@example.com"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-1 focus:ring-lumera-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-lumera-text">
                  Inquiry Topic
                </label>
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-1 focus:ring-lumera-primary cursor-pointer"
                >
                  <option value="Customer Care">Order Status & Customer Care</option>
                  <option value="Product Advice">Skincare Routine Consultation</option>
                  <option value="Returns">Returns & Exchanges</option>
                  <option value="Wholesale">Wholesale & Spa Distribution</option>
                  <option value="Press">Press & Media Relations</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-lumera-text">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with our products or your recent order?"
                  className="w-full p-3.5 rounded-xl border border-border bg-background text-sm text-lumera-text focus:outline-none focus:border-lumera-primary focus:ring-1 focus:ring-lumera-primary resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 h-12 rounded-full bg-lumera-primary text-white text-xs sm:text-sm font-semibold hover:bg-lumera-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
