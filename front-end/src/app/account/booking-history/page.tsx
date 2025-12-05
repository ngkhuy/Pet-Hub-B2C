import {
  BookingCancelAlert,
  BookingDetailDialog,
  BookingNotesDialog,
} from "@/app/account/booking-history/_components/booking-dialog";
import { BookingHistorySection } from "@/app/account/booking-history/_components/booking-history-section";
import { decrypt } from "@/lib/actions/session";
import { clientUrl } from "@/lib/data/web-url";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// export default function BookingHistoryPage() {
//   const [bookings, setBookings] = useState<BookingType[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchBookings() {
//       setLoading(true);
//       const [spaBookings, hotelBooking] = await Promise.all([
//         bookingApi.getSpaBookingHistory().catch((error: HttpError) => {
//           toastError("Không tải được lịch sử đặt chỗ spa", {
//             description: error.detail,
//           });
//           return [];
//         }),
//         bookingApi.getHotelBookingHistory().catch((error: HttpError) => {
//           toastError("Không tải được lịch sử đặt chỗ khách sạn", {
//             description: error.detail,
//           });
//           return [];
//         }),
//       ]);

//       const allBookings = [...spaBookings, ...hotelBooking];
//       allBookings.sort(
//         (a, b) => b.created_at.getTime() - a.created_at.getTime()
//       );

//       setBookings(allBookings);
//       setLoading(false);
//     }

//     fetchBookings();
//   }, []);

//   return (
//     <main className="flex-1 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a202c] lg:p-8">
//       {/* Header */}
//       <div className="mb-8 flex flex-col gap-1">
//         <h2 className="text-2xl font-bold leading-tight tracking-[-0.03em] text-(--text-primary) dark:text-white">
//           Lịch sử đặt chỗ của tôi
//         </h2>
//         <p className="text-base text-gray-500 dark:text-gray-400">
//           Xem và quản lý các đặt chỗ dịch vụ thú cưng của bạn
//         </p>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <section className="grid gap-4 md:grid-cols-2">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <BookingSkeleton key={i} />
//           ))}
//         </section>
//       )}

//       {/* Empty State */}
//       {!loading && bookings.length === 0 && (
//         <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/40 px-6 py-12 text-center">
//           <p className="text-base font-medium text-(--text-primary) dark:text-white">
//             Bạn chưa có đặt chỗ nào
//           </p>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Hãy đặt dịch vụ spa, khách sạn hoặc khám cho thú cưng của bạn.
//           </p>
//           <Button className="mt-4">Đặt dịch vụ đầu tiên</Button>
//         </div>
//       )}

//       {/* Bookings List */}
//       {!loading && bookings.length > 0 && (
//         <section className="grid gap-4 md:grid-cols-2">
//           {bookings.map((booking) => (
//             <BookingCard key={booking.id} booking={booking} />
//           ))}
//         </section>
//       )}
//     </main>
//   );
// }

export default async function BookingHistoryPage() {
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
      <h1 className="text-xl font-semibold mb-4">Lịch sử đặt dịch vụ</h1>
      <BookingHistorySection />
      <BookingCancelAlert />
      <BookingDetailDialog />
      <BookingNotesDialog />
    </div>
  );
}
