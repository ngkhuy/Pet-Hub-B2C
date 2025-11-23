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
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";
import { logoutServerAction } from "@/lib/actions";
import { RoutePath } from "@/lib/utils/route-path";
import { sessionToken } from "@/lib/api/client";

const profile = NAV.user.actions[0];
const admin = NAV.user.actions[2];
const logout = NAV.user.actions[1];

type IconProps = React.ComponentProps<"span"> & {
  IconName: IconType;
};

function Icon({ IconName, className, ...props }: IconProps) {
  return (
    <span {...props}>
      <IconName className={cn("h-4 w-4", className)} />
    </span>
  );
}

export function UserMenu() {
  const route = useRouter();
  const pathName = usePathname();

  async function handleLogout() {
    // Xóa token khỏi localStorage hoặc cookie
    sessionToken.value = "";
    await logoutServerAction();
    route.push(`${RoutePath.login}?redirect=${pathName}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-lg outline-none">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={AVATAR} alt="@User" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 font-medium"
      >
        <DropdownMenuItem asChild>{}</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={profile.link} className="flex items-center gap-2">
            {<Icon IconName={profile.IconName} />} {profile.title}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>{}</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={admin.link} className="flex items-center gap-2">
            {<Icon IconName={admin.IconName} />} {admin.title}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

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
