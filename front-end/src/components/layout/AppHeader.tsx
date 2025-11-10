"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MdOutlinePets, MdLogout, MdInfo, MdMenu } from "react-icons/md";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const navHeaderLinks = {
  home: { link: "/", title: "Trang chủ" },
  service: {
    title: "Các dịch vụ cho thú cưng",
    services: [
      {
        link: "/services/health",
        title: "Sức khỏe",
        description: "Đặt lịch khám, tư vấn, tiêm phòng.",
      },
      {
        link: "/services/hotel",
        title: "Khách sạn",
        description: "Nghỉ dưỡng an toàn, tiện nghi.",
      },
      {
        link: "/services/spa",
        title: "Spa",
        description: "Tắm, cắt tỉa, chăm sóc lông.",
      },
      {
        link: "/adoption",
        title: "Nhận nuôi",
        description: "Kết nối thú cưng cần mái ấm.",
      },
      {
        link: "/donations",
        title: "Quyên góp",
        description: "Hỗ trợ phòng khám & trại cứu hộ.",
      },
    ],
  },
  aboutUs: { link: "/about", title: "Về chúng tôi" },
  contact: { link: "/contact", title: "Liên hệ" },
  user: {
    profile: "/user/profile",
    actions: [
      { link: "/user/profile", IconName: MdInfo, title: "Thông tin" },
      { link: "/logout", IconName: MdLogout, title: "Đăng xuất" },
    ],
  },
};

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD8a7H132bj_399bPnmLLlc5Q464hbfKxNMuvPyniBZvENb9Esac17ts9DJuUaL1AwlGWT9no4c8aWd1BUYc8RhqM1DJbLLf38cwWT47k_EOn2Z2wE-p_GPvOoykGDdVZw-SGmm2DE-hR0-q8bbVtUQFe-kIrAzmWoCmtfS7BVEJMEj47Q6ErCIKeUZT5XYRA2_BG8IBHFN5DXYJT79Sh8uxn07MIxhEO5ZoillzRhEFsrm18Ok7ALiJtNreh-UtqnS4KHEs9jYODH4";

export default function AppHeader() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/80 dark:bg-(--background-secondary)/80 backdrop-blur supports-backdrop-filter:backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-primary">
          <MdOutlinePets size={24} />
          <span className="text-lg font-bold tracking-[-0.02em]">
            {siteConfig.brandName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/") && "bg-muted"
                  )}
                >
                  <Link href={navHeaderLinks.home.link}>
                    {navHeaderLinks.home.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {navHeaderLinks.service.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[520px] gap-3 p-4 sm:grid-cols-2">
                    {navHeaderLinks.service.services.map(
                      ({ link, title, description }) => (
                        <li key={link}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={link}
                              className="block rounded-md border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-muted/50"
                            >
                              <div className="text-sm font-medium">{title}</div>
                              <p className="text-xs text-muted-foreground">
                                {description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      )
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/about") && "bg-muted"
                  )}
                >
                  <Link href={navHeaderLinks.aboutUs.link}>
                    {navHeaderLinks.aboutUs.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/contact") && "bg-muted"
                  )}
                >
                  <Link href={navHeaderLinks.contact.link}>
                    {navHeaderLinks.contact.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* User */}
              <NavigationMenuItem>
                {pathname.startsWith("/user") ? (
                  <Link
                    href={navHeaderLinks.user.profile}
                    aria-label="Trang cá nhân"
                  >
                    <Avatar className="rounded-lg h-8 w-8">
                      <AvatarImage src={avatar} alt="@User" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                  </Link>
                ) : (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-lg outline-none">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={avatar} alt="@User" />
                            <AvatarFallback>ER</AvatarFallback>
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>

                      {/* align end + sideOffset loại bỏ khoảng hở gây mất hover */}
                      <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-56"
                      >
                        <DropdownMenuItem asChild>
                          <Link
                            href="/user/profile"
                            className="flex items-center gap-2"
                          >
                            <MdInfo className="h-4 w-4" /> Thông tin
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href="/logout"
                            className="flex items-center gap-2"
                          >
                            <MdLogout className="h-4 w-4" /> Đăng xuất
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* <NavigationMenuTrigger className="p-1">
                      <Avatar className="rounded-lg h-8 w-8">
                        <AvatarImage src={avatar} alt="@User" />
                        <AvatarFallback>ER</AvatarFallback>
                      </Avatar>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-56 p-2">
                        {navHeaderLinks.user.actions.map(
                          ({ IconName, link, title }) => (
                            <li key={link}>
                              <Link
                                href={link}
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                              >
                                <IconName className="h-4 w-4" />
                                {title}
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </NavigationMenuContent> */}
                  </>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile: hamburger + avatar */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/user/profile" aria-label="Trang cá nhân">
            <Avatar className="rounded-lg h-8 w-8">
              <AvatarImage src={avatar} alt="@User" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Mở menu">
                <MdMenu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0">
              <SheetHeader className="p-4">
                <SheetTitle className="flex items-center gap-2">
                  <MdOutlinePets className="text-primary" />
                  {siteConfig.brandName}
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <nav className="flex flex-col p-2">
                <Link
                  href="/"
                  className={cn(
                    "rounded-md px-3 py-2 text-sm hover:bg-muted",
                    isActive("/") && "bg-muted"
                  )}
                >
                  {navHeaderLinks.home.title}
                </Link>

                {/* Services collapsible mimic */}
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  {navHeaderLinks.service.title}
                </div>
                <ul className="mb-2">
                  {navHeaderLinks.service.services.map(({ link, title }) => (
                    <li key={link}>
                      <Link
                        href={link}
                        className={cn(
                          "block rounded-md px-6 py-2 text-sm hover:bg-muted",
                          isActive(link) && "bg-muted"
                        )}
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={navHeaderLinks.aboutUs.link}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm hover:bg-muted",
                    isActive("/about") && "bg-muted"
                  )}
                >
                  {navHeaderLinks.aboutUs.title}
                </Link>
                <Link
                  href={navHeaderLinks.contact.link}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm hover:bg-muted",
                    isActive("/contact") && "bg-muted"
                  )}
                >
                  {navHeaderLinks.contact.title}
                </Link>

                <Separator className="my-3" />
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  Tài khoản
                </div>
                {navHeaderLinks.user.actions.map(
                  ({ IconName, link, title }) => (
                    <Link
                      key={link}
                      href={link}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <IconName className="h-4 w-4" />
                      {title}
                    </Link>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
