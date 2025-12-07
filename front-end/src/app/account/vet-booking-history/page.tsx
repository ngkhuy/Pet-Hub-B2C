import {
  VetBookingCancelAlert,
  VetBookingEditDialog,
} from "@/app/account/vet-booking-history/_components/vet-booking-dialog";
import { VetBookingHistorySection } from "@/app/account/vet-booking-history/_components/vet-booking-history-section";
import { decrypt } from "@/lib/actions/session";
import { clientUrl } from "@/lib/data/web-url";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function VetBookingHistoryPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) {
    redirect(
      `${clientUrl.login.path}?redirect=${clientUrl.account_booking_history.path}`
    );
  }

  const tokenPayload = await decrypt(accessToken || "");
  if (!tokenPayload) {
    redirect(`${clientUrl.home.path}`);
  }

  return (
    <div className="container py-6">
      <h1 className="text-xl font-semibold mb-4">Lịch sử đặt lịch khám</h1>
      <VetBookingHistorySection />
      <VetBookingCancelAlert />
      <VetBookingEditDialog />
    </div>
  );
}
