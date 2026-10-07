import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/lib/cart/cart-context";
import { Navbar } from "@/components/layout/Navbar";

import { SITE_URL } from "@/lib/seo/canonical";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lumera | Modern Skincare & Pure Beauty",
    template: "%s | Lumera Skincare",
  },
  description: "Experience modern, thoughtful skincare engineered for radiance and purity.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lumera | Modern Skincare & Pure Beauty",
    description: "Experience modern, thoughtful skincare engineered for radiance and purity.",
    url: SITE_URL,
    siteName: "Lumera Skincare",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumera | Modern Skincare & Pure Beauty",
    description: "Experience modern, thoughtful skincare engineered for radiance and purity.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>

        {/* Footer */}
        <footer className="border-t border-border bg-surface-muted py-8 text-center text-xs text-lumera-text-muted">
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-serif text-base font-medium text-lumera-text mb-1">LUMERA SKINCARE</p>
            <p>© {new Date().getFullYear()} Lumera E-Commerce Platform. Architectural Foundation.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
