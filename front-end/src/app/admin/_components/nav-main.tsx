import SidebarNav from "@/app/admin/_components/sidebar-node";
import { SidebarGroup } from "@/components/ui/sidebar";
import { adminUrl, WebUrlType } from "@/lib/data/web-url";

const navMain: WebUrlType[] = [
  adminUrl.dashboard,
  adminUrl.userManagement,
  adminUrl.serviceManagement,
  adminUrl.bookingManagement,
  adminUrl.shopInfoManagement,
];

export function NavMain() {
  return (
    <SidebarGroup className="px-3">
      <SidebarNav items={navMain} openOnActivePrefix />
    </SidebarGroup>
  );
}
