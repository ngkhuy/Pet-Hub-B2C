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
import UnauthenticatedButton from "@/components/layout/header/unauthenticated-button";
import { CartButton } from "@/components/layout/header/cart-button";
import { useAuthStore } from "@/lib/stores/auth-store";

export function DesktopNav() {
  const isAuthenticated = useAuthStore.use.isAuthenticated();
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isEvenServiceItem = NAV.service.items.length % 2 === 0;
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-3">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              isActive("/") && "bg-muted"
            )}
          >
            <Link href={NAV.home.path}>{NAV.home.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{NAV.service.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className={cn(
                "grid w-[520px] gap-3 p-4",
                isEvenServiceItem ? "grid-cols-2" : "md:grid-cols-3"
              )}
            >
              {NAV.service.items.map(({ path, title, description }) => (
                <li key={path}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={path}
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
              isActive(NAV.about.path) && "bg-muted"
            )}
          >
            <Link href={NAV.about.path}>{NAV.about.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              isActive(NAV.contact.path) && "bg-muted"
            )}
          >
            <Link href={NAV.contact.path}>{NAV.contact.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          {isAuthenticated && <CartButton />}
        </NavigationMenuItem>

        <NavigationMenuItem>
          {/* Avatar menu */}
          {isAuthenticated ? <UserMenu /> : <UnauthenticatedButton />}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
