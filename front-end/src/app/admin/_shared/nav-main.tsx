import SidebarNav, { SidebarItemType } from "@/app/admin/_shared/sidebar-node";
import { SidebarGroup } from "@/components/ui/sidebar";

type NavMainType = {
  items: SidebarItemType[];
};

export function NavMain({ items }: NavMainType) {
  return (
    <SidebarGroup className="px-3">
      <SidebarNav items={items} openOnActivePrefix />
    </SidebarGroup>
  );
}
