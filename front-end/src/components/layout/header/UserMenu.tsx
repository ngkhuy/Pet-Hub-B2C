"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV, AVATAR } from "./constants";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { toastPromise } from "@/lib/utils/toast";
import { useAuthStore } from "@/lib/stores/auth-store";
import { globalLogout } from "@/lib/utils/session";
import { clientUrl } from "@/lib/data/web-url";

const profile = NAV.user[0];
const admin = NAV.user[1];
const logout = NAV.user[2];

type IconProps = React.ComponentProps<"span"> & {
  IconName: IconType | null;
};

function Icon({ IconName, className, ...props }: IconProps) {
  if (!IconName) return null;
  return (
    <span {...props}>
      <IconName className={cn("h-4 w-4", className)} />
    </span>
  );
}

export function UserMenu() {
  const { role } = useAuthStore.use.tokenPayload();
  const user = useAuthStore.use.user();

  function handleLogout() {
    toastPromise(globalLogout(clientUrl.home.path), {
      loading: "Đang đăng xuất...",
      success: "Đăng xuất thành công",
      error: "Đăng xuất thất bại, vui lòng thử lại",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-lg outline-none">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.avt_url || AVATAR} alt="@User" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 font-medium"
      >
        <DropdownMenuItem asChild>
          <Link href={profile.path} className="flex items-center gap-2">
            {<Icon IconName={profile.IconName} />} {profile.title}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {role === "admin" && (
          <>
            <DropdownMenuItem asChild>
              <Link href={admin.path} className="flex items-center gap-2">
                {<Icon IconName={admin.IconName} />} {admin.title}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild>
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-2"
          >
            {<Icon IconName={logout.IconName} className="text-red-400" />}
            <span className="text-red-400">{logout.title}</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
