import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/lib/cart/cart-context";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";

import { SITE_URL } from "@/lib/seo/canonical";

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#102A43",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Penguin Mart | Skin Care & Beauty",
    template: "%s | Penguin Mart",
  },
  description: "Penguin Mart — Your premier destination for pure, thoughtful skincare & beauty.",
  icons: {
    icon: "/penguin-mart-logo.jpg",
    apple: "/penguin-mart-logo.jpg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Penguin Mart | Skin Care & Beauty",
    description: "Penguin Mart — Your premier destination for pure, thoughtful skincare & beauty.",
    url: SITE_URL,
    siteName: "Penguin Mart",
    locale: "en_US",
    type: "website",
    images: ["/penguin-mart-logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Penguin Mart | Skin Care & Beauty",
    description: "Penguin Mart — Your premier destination for pure, thoughtful skincare & beauty.",
    images: ["/penguin-mart-logo.jpg"],
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
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable} overflow-x-hidden`}>
      <body className="min-h-screen flex flex-col justify-between overflow-x-hidden antialiased">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 md:pb-8">
                {children}
              </main>
              <BottomNav />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>

        <Footer />
      </body>
    </html>
  );
}
