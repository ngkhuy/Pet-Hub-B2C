import { UserProfile } from "@/app/account/profile/_components/user-profile";
import { decrypt } from "@/lib/actions/session";
import { clientUrl } from "@/lib/data/web-url";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) {
    redirect(
      `${clientUrl.login.path}?redirect=${clientUrl.account_profile.path}`
    );
  }

  const tokenPayload = await decrypt(accessToken || "");
  if (!tokenPayload) {
    redirect(`${clientUrl.home.path}`);
  }

  return (
    <main className="flex-1 bg-white dark:bg-[#1a202c] p-6 lg:p-8 rounded-xl shadow-sm">
      <div className="flex flex-col gap-6">
        {/* HEADER */}
        <header>
          <h2 className="text-(--text-primary) dark:text-white text-2xl font-bold leading-tight tracking-[-0.03em]">
            Thông tin cá nhân
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base pt-2">
            Xem và cập nhật thông tin tài khoản của bạn.
          </p>
        </header>

        <div className="border-t dark:border-gray-700" />

        {/* MAIN CONTENT */}
        <section>
          <UserProfile />
        </section>
      </div>
    </main>
  );
}
