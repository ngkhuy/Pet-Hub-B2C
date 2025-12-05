import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { type IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";
import { WebUrlType } from "@/lib/data/web-url";

export type SidebarItemType = {
  title: string;
  url?: string;
  IconName: IconType;
  items?: SidebarItemType[];
};

type Props = {
  items: WebUrlType[];
  openOnActivePrefix?: boolean;
};

export default function SidebarNav({
  items,
  openOnActivePrefix = true,
}: Props) {
  const pathname = usePathname();

  return (
    <SidebarMenu className="gap-3">
      {items.map((node) => (
        <SidebarNode
          key={node.path}
          node={node}
          pathname={pathname}
          openOnActivePrefix={openOnActivePrefix}
        />
      ))}
    </SidebarMenu>
  );
}

const hoverButton = "hover:bg-primary/10 hover:scale-105 ";
const baseBtnClass = "group/sidebarItem transition-all duration-200 p-2";
const activeNavItem =
  "border  border-primary/90 bg-primary/10 hover:bg-primary/10";

function SidebarNode({
  node,
  pathname,
  openOnActivePrefix,
}: {
  node: WebUrlType;
  pathname: string;
  openOnActivePrefix: boolean;
}) {
  const { title, path, IconName, subItems = [] } = node;
  const hasChildren = Boolean(subItems?.length);

  const isActiveSelf = pathname === path;

  const isActiveDesc = subItems.some((c) => {
    const u = c.path ?? "#";

    if (openOnActivePrefix) {
      return u !== "/" && pathname.startsWith(u);
    }

    return pathname === u;
  });

  const defaultOpen = hasChildren && (isActiveSelf || isActiveDesc);

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={title}
          className={cn(
            baseBtnClass,
            isActiveSelf ? activeNavItem : hoverButton
          )}
        >
          <Link href={path}>
            {IconName && (
              <IconName className="scale-110 group-hover/sidebarItem:text-primary" />
            )}
            <span className="text-sm font-semibold group-hover/sidebarItem:text-primary">
              {title}
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen={defaultOpen} className="group/collapsible ">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={title}
            className={cn(
              baseBtnClass,
              isActiveSelf ? activeNavItem : hoverButton
            )}
          >
            {IconName && <IconName className="text-2xl" />}
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((child) => (
              <SidebarNode
                key={child.path}
                node={child}
                pathname={pathname}
                openOnActivePrefix={openOnActivePrefix}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
