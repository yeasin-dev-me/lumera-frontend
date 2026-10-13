export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-lumera-primary/20 border-t-lumera-primary" />
      <p className="text-xs text-lumera-text-muted uppercase tracking-wider font-medium">
        Loading Penguin Mart...
      </p>
    </div>
  );
}
