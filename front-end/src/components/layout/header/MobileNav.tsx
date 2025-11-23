"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MdMenu, MdOutlinePets } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NAV, AVATAR } from "./constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex items-center gap-2 md:hidden">
      <Link href={NAV.user.profile} aria-label="Trang cá nhân">
        <Avatar className="rounded-lg h-8 w-8">
          <AvatarImage src={AVATAR} alt="@User" />
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
              <MdOutlinePets className="text-primary" /> PetCare Connect
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
              {NAV.home.title}
            </Link>

            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
              {NAV.service.title}
            </div>
            <ul className="mb-2">
              {NAV.service.items.map(({ link, title }) => (
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
              href={NAV.about.link}
              className={cn(
                "rounded-md px-3 py-2 text-sm hover:bg-muted",
                isActive(NAV.about.link) && "bg-muted"
              )}
            >
              {NAV.about.title}
            </Link>
            <Link
              href={NAV.contact.link}
              className={cn(
                "rounded-md px-3 py-2 text-sm hover:bg-muted",
                isActive(NAV.contact.link) && "bg-muted"
              )}
            >
              {NAV.contact.title}
            </Link>

            <Separator className="my-3" />
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
              Tài khoản
            </div>
            {[
              ...NAV.user.actions, // map lại chung 2 item
            ].map(({ link, title, IconName }) => (
              <Link
                key={link}
                href={link}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <IconName className="h-4 w-4" /> {title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
