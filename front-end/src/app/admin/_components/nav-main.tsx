import SidebarNav from "@/app/admin/_components/sidebar-node";
import { SidebarGroup } from "@/components/ui/sidebar";
import { adminUrl, WebUrlType } from "@/lib/data/web-url";

const navMain: WebUrlType[] = [
  adminUrl.dashboard,
  adminUrl.userManagement,
  adminUrl.serviceManagement,
  adminUrl.bookingManagement,
  {
    IconName: null,
    title: "Thú y",
    description: "Quản lý dịch vụ thú y",
    path: "/admin/vet",
    subItems: [adminUrl.vetServiceManagement, adminUrl.vetBookingManagement],
  },
  adminUrl.shopInfoManagement,
];

export function NavMain() {
  return (
    <SidebarGroup className="px-3">
      <SidebarNav items={navMain} openOnActivePrefix />
    </SidebarGroup>
  );
}
