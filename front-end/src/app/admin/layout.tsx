import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminUrl, clientUrl } from "@/lib/data/web-url";
import { decrypt } from "@/lib/actions/session";
import { AdminSidebar } from "@/app/admin/_components/admin-sidebar";
import AdminHeader from "@/app/admin/_components/admin-header";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administrative dashboard for managing PetCare platform",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) {
    redirect(`${clientUrl.login.path}?redirect=${adminUrl.dashboard.path}`);
  }

  const decryptedToken = await decrypt(accessToken);
  if (!decryptedToken || decryptedToken?.role !== "admin") {
    redirect(clientUrl.home.path);
  }

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
