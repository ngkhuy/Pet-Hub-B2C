import { Skeleton } from "@/components/ui/skeleton";

export function PetCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" /> {/* Name */}
          <div className="flex gap-2">
            <Skeleton className="h-4 w-12" /> {/* Loài */}
            <Skeleton className="h-4 w-20" /> {/* Ngày sinh */}
          </div>
        </div>
      </div>

      {/* Breed */}
      <Skeleton className="mt-4 h-4 w-40" />

      {/* Note lines */}
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-2/3" />

      {/* Actions */}
      <div className="mt-5 flex justify-between">
        <Skeleton className="h-6 w-24" /> {/* Xem chi tiết */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" /> {/* Chỉnh sửa */}
          <Skeleton className="h-8 w-16" /> {/* Xóa */}
        </div>
      </div>
    </div>
  );
}
