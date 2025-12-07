import {
  VetSearchSection,
  VetSection,
} from "@/app/(marketing)/service/(booking)/vet/_components/vet-section";
import {
  BookingVetConfirmDialog,
  SingleVetBookingDialog,
} from "@/app/(marketing)/service/(booking)/vet/_components/vet-service-dialog";
import { decrypt } from "@/lib/actions/session";
import { clientUrl } from "@/lib/data/web-url";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function VetServicePage() {
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
            Dịch vụ Phòng khám Thú y
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Chăm sóc sức khỏe toàn diện cho thú cưng của bạn với các dịch vụ
            phòng khám thú y chuyên nghiệp
          </p>
        </div>
        {/* SERVICES SECTION */}
        <div>
          <VetSearchSection />
          <VetSection />
          <SingleVetBookingDialog />
          <BookingVetConfirmDialog />
        </div>
      </div>
    </main>
  );
}
