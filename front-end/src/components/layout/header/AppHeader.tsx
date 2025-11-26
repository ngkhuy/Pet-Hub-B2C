"use client";

import Link from "next/link";
import { MdOutlinePets } from "react-icons/md";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import envConfig from "@/config/config";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/80 dark:bg-(--background-secondary)/80 backdrop-blur supports-backdrop-filter:backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5/6 items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-primary">
          <MdOutlinePets size={24} />
          <span className="text-lg font-bold tracking-[-0.02em]">
            {envConfig.BRAND_NAME}
          </span>
        </Link>

        {/* Desktop / Mobile */}
        <div className="hidden md:block">
          <DesktopNav />
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
