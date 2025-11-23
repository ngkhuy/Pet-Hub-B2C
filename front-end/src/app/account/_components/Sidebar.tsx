"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  MdEdit,
  MdPersonOutline,
  MdOutlinePets,
  MdCalendarMonth,
  MdOutlineStarOutline,
  MdOutlineSettings,
  MdLogout,
} from "react-icons/md";
import NavLinkItem, {
  SIDEBAR_CONTENT_INACTIVE,
  SIDEBAR_LINK_INACTIVE,
} from "./NavLinkItem";
import { usePathname, useRouter } from "next/navigation";
import { RoutePath } from "@/lib/utils/route-path";
import { logoutServerAction } from "@/lib/actions";
import clsx from "clsx";
import { sessionToken } from "@/lib/api/client";

type Props = {
  avatarString: string;
};

const navSidebarLinks = {
  service: {
    services: [
      {
        key: "PI",
        title: "Thông tin cá nhân",
        link: "/account/profile",
        IconName: MdPersonOutline,
      },
      {
        key: "P",
        title: "Thú cưng của tôi",
        link: "/account/pets",
        IconName: MdOutlinePets,
      },
      {
        key: "H",
        title: "Lịch sử",
        link: "#",
        IconName: MdCalendarMonth,
      },
      {
        key: "R",
        title: "Đánh giá",
        link: "#",
        IconName: MdOutlineStarOutline,
      },
    ],
  },
  accountSetting: {
    key: "ST",
    title: "Cài đặt",
    link: "/account/setting",
    IconName: MdOutlineSettings,
  },
  logout: {
    key: "L",
    title: "Đăng xuất",
    link: "",
    IconName: MdLogout,
  },
};

export default function Sidebar({ avatarString }: Props) {
  const pathName = usePathname();
  const route = useRouter();
  const LogoutIcon = navSidebarLinks.logout.IconName;

  async function handleLogout() {
    sessionToken.value = "";
    await logoutServerAction();
    const url = `${RoutePath.login}?redirect=${pathName}`;
    route.push(url);
  }

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="sticky top-24 flex flex-col gap-4 bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow ">
        {/* General Infomation */}
        <div className="flex flex-col items-center gap-3 dark:border-gray-600">
          <div className="relative">
            <Avatar className="bg-center bg-no-repeat aspect-square bg-cover size-24">
              <AvatarImage
                src={avatarString}
                alt="Ảnh đại diện"
                className="object-cover"
              />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <Button
              className="absolute -bottom-1 -right-1 size-9 rounded-full shadow-md
               bg-primary text-primary-foreground hover:bg-primary/90
               ring-2 ring-white dark:ring-background cursor-pointer"
              aria-label="Đổi ảnh đại diện"
            >
              <MdEdit className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-(--text-primary) dark:text-white text-base font-medium leading-normal">
              Nguyen Van A
            </h1>
            <p className="text-(--text-secondary) dark:text-gray-400 text-sm font-normal leading-normal">
              nva@email.com
            </p>
          </div>
        </div>
        <Separator className="mb-3 mt-1" />
        {/* Services */}
        <div className="flex flex-col gap-3">
          {navSidebarLinks.service.services.map(
            ({ IconName, key, link, title }) => (
              <NavLinkItem
                key={key}
                IconName={IconName}
                link={link}
                title={title}
              />
            )
          )}
        </div>
        <Separator className="mt-1" />

        <div className=" pt-4 flex flex-col gap-1 ">
          <NavLinkItem
            IconName={navSidebarLinks.accountSetting.IconName}
            key={navSidebarLinks.accountSetting.key}
            link={navSidebarLinks.accountSetting.link}
            title={navSidebarLinks.accountSetting.title}
          />

          <button className="block" onClick={handleLogout}>
            <div
              className={clsx(
                "rounded-lg flex items-center p-2 gap-3 group transition-all text-red-500  ",
                SIDEBAR_LINK_INACTIVE
              )}
            >
              <LogoutIcon
                className={clsx("size-6", SIDEBAR_CONTENT_INACTIVE)}
              />
              <span
                className={clsx(
                  "font-medium leading-normal",
                  SIDEBAR_CONTENT_INACTIVE
                )}
              >
                {navSidebarLinks.logout.title}
              </span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
