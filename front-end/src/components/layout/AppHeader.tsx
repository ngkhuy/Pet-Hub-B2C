"use client";

import { siteConfig } from "@/config/site";
import Link from "next/link";
import { MdLogout, MdOutlinePets, MdInfo } from "react-icons/md";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";

const navHeaderLinks = {
  home: {
    link: "/",
    title: "Trang chủ",
  },
  service: {
    title: "Các dịch vụ cho thú cưng",
    services: [
      {
        link: "/",
        title: "Sức khỏe",
        description:
          "Đặt lịch khám, tư vấn và tiêm phòng cho thú cưng với bác sĩ uy tín.",
      },
      {
        link: "/",
        title: "Khách sạn",
        description:
          "Đặt chỗ nghỉ dưỡng an toàn, tiện nghi cho thú cưng khi bạn vắng nhà.",
      },
      {
        link: "/",
        title: "Spa",
        description:
          "Chăm sóc, tắm rửa, cắt tỉa lông giúp thú cưng luôn sạch đẹp và khỏe mạnh.",
      },
      {
        link: "/",
        title: "Nhận nuôi",
        description:
          "Kết nối bạn với những thú cưng đang cần mái ấm yêu thương.",
      },
      {
        link: "/",
        title: "Quyên góp",
        description:
          "Chung tay hỗ trợ các phòng khám và trại cứu hộ chăm sóc thú cưng khó khăn.",
      },
    ],
  },
  aboutUs: {
    link: "/",
    title: "Về chúng tôi",
  },
  contact: {
    link: "/",
    title: "Liên hệ",
  },
  user: {
    profile: "/user/profile",
    actions: [
      { link: "/user/profile", IconName: MdInfo, title: "Thông tin" },
      { link: "#", IconName: MdLogout, title: "Đăng xuất" },
    ],
  },
};

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD8a7H132bj_399bPnmLLlc5Q464hbfKxNMuvPyniBZvENb9Esac17ts9DJuUaL1AwlGWT9no4c8aWd1BUYc8RhqM1DJbLLf38cwWT47k_EOn2Z2wE-p_GPvOoykGDdVZw-SGmm2DE-hR0-q8bbVtUQFe-kIrAzmWoCmtfS7BVEJMEj47Q6ErCIKeUZT5XYRA2_BG8IBHFN5DXYJT79Sh8uxn07MIxhEO5ZoillzRhEFsrm18Ok7ALiJtNreh-UtqnS4KHEs9jYODH4";

export default function AppHeader() {
  const pathName = usePathname();

  return (
    <header className="shadow-md sticky top-0 inset-x-0 z-20  supports-backdrop-filter:backdrop-blur flex items-center justify-center  px-10 py-3 bg-white dark:bg-(--background-secondary)">
      <div className="flex flex-1 w-full max-w-5/6 mx-auto ">
        {/* Brand name and Icon */}
        <div className=" flex items-center gap-2 text-primary dark:text-white">
          <div className=" text-primary flex justify-center items-center">
            <MdOutlinePets size={30} />
          </div>
          <h2 className=" text-2xl font-bold leading-tight tracking-[-0.015em]">
            {siteConfig.brandName}
          </h2>
        </div>
        {/* Navigation Menu */}
        <div className="flex flex-1 justify-end">
          <NavigationMenu>
            <NavigationMenuList className="flex-wrap">
              {/* Home Navigation */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={navHeaderLinks.home.link}>
                    {navHeaderLinks.home.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Services Navigation */}
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger>
                  {" "}
                  {navHeaderLinks.service.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-4  ">
                    <li>
                      {navHeaderLinks.service.services.map(
                        ({ link, title, description }, key) => (
                          <NavigationMenuLink asChild key={key}>
                            <Link href={link} className="">
                              <div className="font-medium ">{title}</div>
                              <div className="text-muted-foreground wrap-break-word">
                                {description}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        )
                      )}
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* About Us Navigation */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={navHeaderLinks.aboutUs.link}>
                    {navHeaderLinks.aboutUs.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>{" "}
              {/* Contact Navigation */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={navHeaderLinks.contact.link}>
                    {navHeaderLinks.contact.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Account Navigation */}
              <NavigationMenuItem>
                {pathName.startsWith("/user") ? (
                  <Avatar className="rounded-lg">
                    <AvatarImage src={avatar} alt="@User" />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                ) : (
                  <>
                    <NavigationMenuTrigger>
                      <Avatar className="rounded-lg ">
                        <AvatarImage src={avatar} alt="@User" />
                        <AvatarFallback>ER</AvatarFallback>
                      </Avatar>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[500px] gap-4  ">
                        <li>
                          {navHeaderLinks.user.actions.map(
                            ({ IconName, link, title }, key) => (
                              <NavigationMenuLink asChild key={key}>
                                <Link href={link} className="">
                                  <div className="font-medium ">{title}</div>
                                </Link>
                              </NavigationMenuLink>
                            )
                          )}
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
