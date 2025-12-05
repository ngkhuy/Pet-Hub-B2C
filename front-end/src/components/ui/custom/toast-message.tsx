"use client";

import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, XCircle } from "lucide-react";

export function ToastMessage({
  title,
  description,
  type = "success",
  id,
}: {
  title: string;
  description?: string | (() => React.ReactNode);
  type?: "success" | "error" | "loading";
  id?: string | number;
}) {
  return (
    <div
      className="
        flex items-center gap-3 
        px-4 py-3 
        rounded-xl 
        bg-white/90 
        dark:bg-neutral-900/80 
        shadow-md 
        border border-neutral-200 dark:border-neutral-800
        backdrop-blur
        w-[300px]
      "
    >
      {/* Icon */}
      <div className="mt-0.5">
        {type === "success" && (
          <CheckCircle2 className="text-green-500 h-5 w-5" />
        )}
        {type === "error" && <XCircle className="text-red-500 h-5 w-5" />}
        {type === "loading" && <Spinner className="text-blue-500 h-5 w-5" />}
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="font-semibold text-sm leading-tight">{title}</p>

        {description && (
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-snug">
            {typeof description === "function" ? description() : description}
          </p>
        )}
      </div>
    </div>
  );
}
