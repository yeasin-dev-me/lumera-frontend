import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 max-w-md mx-auto">
      <h1 className="font-serif text-6xl font-bold text-lumera-primary">404</h1>
      <h2 className="font-serif text-2xl font-semibold text-lumera-text">Page Not Found</h2>
      <p className="text-sm text-lumera-text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="primary">Return Home</Button>
      </Link>
    </div>
  );
}
