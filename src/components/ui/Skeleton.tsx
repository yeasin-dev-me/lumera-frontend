import React from "react";

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/60 ${className}`}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl sm:rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Image slot */}
      <Skeleton className="aspect-[4/3] sm:aspect-square w-full rounded-none" />
      {/* Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16 sm:w-20" />
          <Skeleton className="h-4 sm:h-5 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16 sm:w-20" />
          <Skeleton className="h-8 w-8 sm:w-20 rounded-full sm:rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CategoryPillSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 scrollbar-none">
      {[48, 64, 72, 56, 80].map((width, i) => (
        <Skeleton
          key={i}
          className="h-9 shrink-0 rounded-full"
          style={{ width: `${width + 40}px` }}
        />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 p-4 sm:p-5 bg-card space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-40" />
      <div className="pt-2 flex justify-between items-center border-t border-border/40">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
