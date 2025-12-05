import { decrypt } from "@/lib/actions/session";
import { clientUrl } from "@/lib/data/web-url";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Setting",
  description: "View and Edit User's settings",
};

export default async function SettingLayout({
  account,
  changePassword,
  notification,
}: Readonly<{
  account: React.ReactNode;
  changePassword: React.ReactNode;
  notification: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) {
    redirect(
      `${clientUrl.login.path}?redirect=${clientUrl.account_settings.path}`
    );
  }

  const tokenPayload = await decrypt(accessToken || "");
  if (!tokenPayload) {
    redirect(`${clientUrl.home.path}`);
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 gap-4">
        {changePassword}
        {notification}
        {account}
      </div>
    </div>
  );
}
