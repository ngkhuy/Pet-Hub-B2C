"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface LoadingOverlayProps {
  message?: string;
  className?: string;
  show: boolean;
  children?: React.ReactNode;
}

export function LoadingOverlay({
  show,
  message = "Đang xử lý...",
  className,
  children,
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-100 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[1px] rounded-xl",
        className
      )}
    >
      <div className="relative z-50 flex justify-center items-center gap-3 rounded-lg bg-white/90 dark:bg-zinc-900/80 px-4 py-2 shadow-lg border border-border">
        {children ?? <Spinner className="h-8 w-8 text-primary" />}

        <p className="text-sm font-medium text-primary">{message}</p>
      </div>
    </div>
  );
}
