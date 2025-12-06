import { Skeleton } from "@/components/ui/skeleton";

export function CardLoadingSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-3xl border bg-background p-5 shadow-sm space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-40 rounded-full" />
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-4 w-40 rounded-full" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Skeleton className="h-10 w-full rounded-full" />
        <Skeleton className="h-4 w-24 rounded-full mx-auto" />
      </div>
    </div>
  );
}

export function ServiceLoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardLoadingSkeleton key={i} />
      ))}
    </div>
  );
}
