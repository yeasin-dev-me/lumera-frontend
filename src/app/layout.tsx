import type { Metadata } from "next";
import "@/styles/globals.css";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Lumera | Modern Skincare & Pure Beauty",
  description: "Experience modern, thoughtful skincare engineered for radiance and purity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="h-8 w-8 rounded-full bg-lumera-primary text-white flex items-center justify-center font-serif font-bold text-lg group-hover:bg-lumera-primary-hover transition-colors">
                L
              </span>
              <span className="font-serif text-2xl font-semibold tracking-wider text-lumera-text">
                LUMERA
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-lumera-text-muted">
              <Link href="/" className="text-lumera-primary hover:text-lumera-primary-hover transition-colors">
                Home
              </Link>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1.5 text-xs text-lumera-accent font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Storefront Foundation Active</span>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

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
