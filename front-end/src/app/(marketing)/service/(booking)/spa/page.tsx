import { BookingSpaConfirmDialog } from "@/app/(marketing)/service/(booking)/spa/_components/booking-spa-confirm-dialog";
import { SingleSpaBookingDialog } from "@/app/(marketing)/service/(booking)/spa/_components/single-spa-booking-dialog";
import { SpaSearchSection } from "@/app/(marketing)/service/(booking)/spa/_components/spa-search-section";
import { SpaSection } from "@/app/(marketing)/service/(booking)/spa/_components/spa-section";
import { decrypt } from "@/lib/actions/session";
import { clientUrl } from "@/lib/data/web-url";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SpaServicePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) {
    redirect(`${clientUrl.login.path}?redirect=${clientUrl.spa_service.path}`);
  }

  const tokenPayload = await decrypt(accessToken || "");
  if (!tokenPayload) {
    redirect(`${clientUrl.home.path}`);
  }

  return (
    <main className="container mx-auto px-4 ">
      <div className="layout-content-container flex flex-col w-full">
        {/* Page Heading */}
        <div className="flex flex-col text-center gap-3 p-4">
          <p className="text-4xl md:text-5xl font-black text-primary dark:text-white">
            Dịch vụ Spa
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Chăm sóc và nuông chiều thú cưng của bạn với các dịch vụ spa chuyên
            nghiệp
          </p>
        </div>
        {/* SERVICES SECTION */}
        <div>
          <SpaSearchSection />
          <SpaSection />
          <SingleSpaBookingDialog />
          <BookingSpaConfirmDialog />
        </div>
      </div>
    </main>
  );
}
