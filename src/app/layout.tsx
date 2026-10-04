import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/layout/Navbar";

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
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
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
