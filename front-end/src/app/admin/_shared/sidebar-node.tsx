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

export type SidebarItemType = {
  title: string;
  url?: string;
  IconName: IconType;
  items?: SidebarItemType[];
};

type Props = {
  items: SidebarItemType[];
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
          key={node.url}
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
  node: SidebarItemType;
  pathname: string;
  openOnActivePrefix: boolean;
}) {
  const { title, url, IconName, items = [] } = node;
  const hasChildren = !!items.length;

  const isActiveSelf = pathname === url;

  const isActiveDesc = items.some((c) => {
    const u = c?.url ?? "#";

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
          <Link href={url ?? "#"}>
            <IconName className="scale-110 group-hover/sidebarItem:text-primary" />
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
            <IconName className="text-2xl" />
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((child) => (
              <SidebarNode
                key={child.title}
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
