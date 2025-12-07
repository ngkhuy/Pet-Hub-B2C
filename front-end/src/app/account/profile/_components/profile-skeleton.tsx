"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-10">
      {/* Title section */}

      {/* USER CARD */}
      <div className="rounded-2xl border p-8 bg-card shadow-sm space-y-6">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-28 w-28 rounded-full" />

          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-40 mx-auto" /> {/* Name */}
            <Skeleton className="h-4 w-32 mx-auto" /> {/* Email */}
          </div>
        </div>

        {/* Badges row */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>

        {/* Join date */}
        <div className="flex justify-center">
          <Skeleton className="h-4 w-52" />
        </div>

        {/* Update button */}
        <div className="flex justify-center">
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="rounded-2xl border p-8 bg-card shadow-sm">
        <Skeleton className="h-6 w-32 mb-6" /> {/* Thông tin chi tiết */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            <div>
              <Skeleton className="h-4 w-24 mb-2" /> {/* label */}
              <Skeleton className="h-5 w-40" /> {/* value */}
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-40" />
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-28" />
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-60" /> {/* giới thiệu dài */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
