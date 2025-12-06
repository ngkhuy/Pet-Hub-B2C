"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCountAll } from "@/lib/stores/booking-cart-store";
import { useLayoutEffect, useRef, useState } from "react";
import { LuCalendarCheck2 } from "react-icons/lu";

export function CartButton() {
  const countService = useCountAll();
  const [shake, setShake] = useState(false);

  const prevCount = useRef(countService);

  useLayoutEffect(() => {
    function startUp() {
      if (countService > prevCount.current) {
        setShake(true);
        const timer = setTimeout(() => setShake(false), 350);
        return () => clearTimeout(timer);
      }
      prevCount.current = countService;
    }

    return startUp();
  }, [countService]);

  return (
    <Link
      href="/cart"
      aria-label="Giỏ dịch vụ"
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-full",
        "bg-background/80 backdrop-blur-sm border border-border/40",
        "shadow-[0_2px_6px_-1px_rgb(0,0,0,0.15)]",
        "transition-all duration-200 hover:shadow-lg hover:scale-[1.07]",
        "hover:bg-accent/50 dark:hover:bg-accent/30"
      )}
    >
      <LuCalendarCheck2
        className={cn(
          "h-[21px] w-[21px]  transition-transform",
          shake && "animate-cart-shake"
        )}
        strokeWidth={2}
      />

      {countService > 0 && (
        <span
          className={cn(
            "absolute -top-1.5 -right-1.5 flex items-center justify-center",
            "min-h-5 min-w-5 rounded-full px-1.5",
            "bg-pink-500 text-white dark:bg-pink-400",
            "shadow-[0_0_6px_rgba(255,105,180,0.5)]",
            "text-[11px] font-semibold",
            "animate-in fade-in zoom-in duration-200"
          )}
        >
          {countService}
        </span>
      )}
    </Link>
  );
}
