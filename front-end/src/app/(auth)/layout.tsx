import { decrypt } from "@/lib/actions/session";
import { clientUrl } from "@/lib/data/web-url";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("access_token")?.value;
  const tokenPayload = await decrypt(refreshToken || "");
  if (tokenPayload) {
    redirect(clientUrl.home.path);
  }

  return <>{children}</>;
}
