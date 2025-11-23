import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/app/admin/_shared/admin-sidebar";
import AdminHeader from "@/app/admin/_shared/header/admin-header";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administrative dashboard for managing PetCare platform",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-(--background-primary) dark:bg-(--background-secondary)">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <div className="p-4 pt-0">{children} </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
