import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setting",
  description: "View and Edit User's settings",
};

export default function UserLayout({
  account,
  changePassword,
  notification,
}: Readonly<{
  account: React.ReactNode;
  changePassword: React.ReactNode;
  notification: React.ReactNode;
}>) {
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
