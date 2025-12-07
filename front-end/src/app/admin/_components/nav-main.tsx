import SidebarNav from "@/app/admin/_components/sidebar-node";
import { SidebarGroup } from "@/components/ui/sidebar";
import { adminUrl, WebUrlType } from "@/lib/data/web-url";
import { LuPawPrint } from "react-icons/lu";

const navMain: WebUrlType[] = [
  adminUrl.dashboard,
  adminUrl.userManagement,
  adminUrl.serviceManagement,
  adminUrl.bookingManagement,
  {
    IconName: LuPawPrint,
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
