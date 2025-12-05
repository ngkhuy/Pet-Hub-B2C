"use client";

import Link from "next/link";
import { MdOutlinePets } from "react-icons/md";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import envConfig from "@/config/config";
import { clientUrl } from "@/lib/data/web-url";
import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { userManagementApi } from "@/lib/api/user-management";
import { useOwnPetStore } from "@/lib/stores/own-pet-store";

export default function AppHeader() {
  const { setUser } = useAuthStore.use.actions();
  const { setOwnPets } = useOwnPetStore.use.actions();

  const fetchInit = useCallback(() => {
    Promise.all([
      userManagementApi
        .getMe()
        .then((user) => {
          setUser(user);
        })
        .catch((err) => {
          setUser(null);
          console.error("Failed to fetch user info:", err);
        }),
      ,
      userManagementApi
        .getOwnPets()
        .then((data) => {
          setOwnPets(data);
        })
        .catch((err) => {
          console.error("Failed to fetch own pets:", err);
        }),
    ]);
  }, [setUser, setOwnPets]);

  useEffect(() => {
    fetchInit();
  }, [fetchInit]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/80 dark:bg-(--background-secondary)/80 backdrop-blur supports-backdrop-filter:backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-5/6 items-center justify-between px-4 ">
        {/* Brand */}
        <Link
          href={clientUrl.home.path}
          className="flex items-center gap-2 text-primary"
        >
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
