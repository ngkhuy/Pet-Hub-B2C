"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MdEdit } from "react-icons/md";
import NavLinkItem, {
  SIDEBAR_CONTENT_INACTIVE,
  SIDEBAR_LINK_INACTIVE,
} from "./NavLinkItem";
import clsx from "clsx";
import { clientUrl } from "@/lib/data/web-url";
import { toastPromise } from "@/lib/utils/toast";
import { useAuthStore } from "@/lib/stores/auth-store";
import { globalLogout } from "@/lib/utils/session";

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCFKvpRR65IK--05P5ZmX1HXhWFoOwA-itL1Xjz0w_uYrRpjw5K2bB_tyuftQaVq9Md5932WTAxZcpQJlh99K44qEqkw9SNYJHOC_kO1EgbCVc4goB_PItO2cQMJiQhkrQROlfkCCtNTBawdETL0yAwyUKKN_V1skTl9l58U02cirkhot9riuD_lcmXi-cp4DZ9jfYbwJPdDX9zLY5T58fQ3BUPbIvLwDr4aY5k6oZuxOzZvYfzqbnzdA5RSowT44yP4miZea5_bkSo";

const navSidebarLinks = {
  service: {
    services: [
      clientUrl.account_profile,
      clientUrl.account_pets,
      clientUrl.account_booking_history,
      clientUrl.account_reviews,
    ],
  },
  accountSetting: clientUrl.account_settings,
  logout: clientUrl.logout,
};

export default function Sidebar() {
  const user = useAuthStore.use.user();
  const LogoutIcon = navSidebarLinks.logout.IconName;

  function handleLogout() {
    toastPromise(globalLogout(clientUrl.home.path), {
      loading: "Đang đăng xuất...",
      success: "Đăng xuất thành công",
      error: "Đăng xuất thất bại, vui lòng thử lại",
    });
  }

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="sticky top-24 flex flex-col gap-4 bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow ">
        {/* General Infomation */}
        <div className="flex flex-col items-center gap-3 dark:border-gray-600">
          <div className="relative">
            <Avatar className="bg-center bg-no-repeat aspect-square bg-cover size-24">
              <AvatarImage
                src={user?.avt_url || avatar}
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
              {user?.full_name || "Xin chào"}
            </h1>
            <p className="text-(--text-secondary) dark:text-gray-400 text-sm font-normal leading-normal">
              {user?.email || "Chưa cập nhật email"}
            </p>
          </div>
        </div>
        <Separator className="mb-3 mt-1" />
        {/* Services */}
        <div className="flex flex-col gap-3">
          {navSidebarLinks.service.services.map(({ IconName, path, title }) => (
            <NavLinkItem
              key={path}
              IconName={IconName}
              link={path}
              title={title}
            />
          ))}
        </div>
        <Separator className="mt-1" />

        <div className=" pt-4 flex flex-col gap-1 ">
          <NavLinkItem
            IconName={navSidebarLinks.accountSetting.IconName}
            key={navSidebarLinks.accountSetting.path}
            link={navSidebarLinks.accountSetting.path}
            title={navSidebarLinks.accountSetting.title}
          />

          <button className="block" onClick={handleLogout}>
            <div
              className={clsx(
                "rounded-lg flex items-center p-2 gap-3 group transition-all text-red-500  ",
                SIDEBAR_LINK_INACTIVE
              )}
            >
              {LogoutIcon && (
                <LogoutIcon
                  className={clsx("size-6", SIDEBAR_CONTENT_INACTIVE)}
                />
              )}
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
