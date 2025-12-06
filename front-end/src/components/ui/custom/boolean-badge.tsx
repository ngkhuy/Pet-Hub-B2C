"use client";

import { cn } from "@/lib/utils";

interface BooleanBadgeProps {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
  // optional: đổi màu badge theo variant
  variant?: "success" | "danger" | "warning" | "info";
}

export function BooleanBadge({
  value,
  trueLabel = "True",
  falseLabel = "False",
  variant = "success",
}: BooleanBadgeProps) {
  const color = getBadgeColors(variant, value);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border",
        color
      )}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function getBadgeColors(
  variant: "success" | "danger" | "warning" | "info",
  value: boolean
) {
  if (!value) {
    return {
      success: "bg-red-100 text-red-700 border-red-200",
      danger: "bg-red-100 text-red-700 border-red-200",
      warning: "bg-gray-100 text-gray-700 border-gray-300",
      info: "bg-gray-100 text-gray-700 border-gray-300",
    }[variant];
  }

  // true state
  return {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
    info: "bg-blue-100 text-blue-700 border-blue-300",
  }[variant];
}
