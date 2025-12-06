import { BookingHotelConfirmDialog } from "@/app/(marketing)/service/(booking)/hotel/_components/booking-hotel-confirm-dialog";
import { HotelSearchSection } from "@/app/(marketing)/service/(booking)/hotel/_components/hotel-search-section";
import { HotelSection } from "@/app/(marketing)/service/(booking)/hotel/_components/hotel-section";
import { SingleHotelBookingDialog } from "@/app/(marketing)/service/(booking)/hotel/_components/single-hotel-booking-dialog";
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
            Dịch vụ Khách sạn
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Đặt dịch vụ khách sạn cho thú cưng của bạn một cách dễ dàng và nhanh
            chóng.
          </p>
        </div>
        {/* SERVICES SECTION */}
        <div>
          <HotelSearchSection />
          <HotelSection />
          <SingleHotelBookingDialog />
          <BookingHotelConfirmDialog />
        </div>
      </div>
    </main>
  );
}
