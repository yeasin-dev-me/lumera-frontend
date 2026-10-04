"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront runtime error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 max-w-md mx-auto">
      <div className="p-3 rounded-full bg-lumera-danger/10 text-lumera-danger">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="font-serif text-2xl font-semibold text-lumera-text">
        Something went wrong
      </h2>
      <p className="text-sm text-lumera-text-muted">
        We encountered an unexpected error while loading this page. Please try again.
      </p>
      <Button variant="primary" onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
}
