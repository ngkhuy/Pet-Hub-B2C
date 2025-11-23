"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NAV } from "./constants";
import { UserMenu } from "./UserMenu";

export function DesktopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
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
            <Link href={NAV.home.link}>{NAV.home.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{NAV.service.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[520px] gap-3 p-4 sm:grid-cols-2">
              {NAV.service.items.map(({ link, title, description }) => (
                <li key={link}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link}
                      className="block rounded-md border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-muted/50"
                    >
                      <div className="text-sm font-medium">{title}</div>
                      {description && (
                        <p className="text-xs text-muted-foreground">
                          {description}
                        </p>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              isActive(NAV.about.link) && "bg-muted"
            )}
          >
            <Link href={NAV.about.link}>{NAV.about.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              isActive(NAV.contact.link) && "bg-muted"
            )}
          >
            <Link href={NAV.contact.link}>{NAV.contact.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          {/* Avatar menu */}
          <UserMenu />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
