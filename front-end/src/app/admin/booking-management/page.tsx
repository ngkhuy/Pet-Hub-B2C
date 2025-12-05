"use client";

import { serviceColumns } from "@/app/admin/service-management/_component/service-column";
import { DataTable } from "@/components/ui/table/data-table";
import { bookingApi } from "@/lib/api/booking";
import { BookingLabelsWithActions, BookingType } from "@/lib/types/booking";
import { toastError } from "@/lib/utils/toast";
import { useEffect } from "react";
import { BookingEditDialog } from "@/app/admin/booking-management/_component/booking-dialog";
import { useBookingManagementStore } from "@/lib/stores/booking-management-store";
import { HttpError } from "@/lib/api/client";
import { bookingColumns } from "@/app/admin/booking-management/_component/booking-table";

export default function BookingManagementPage() {
  const bookings = useBookingManagementStore.use.bookings();
  const { setBookings } = useBookingManagementStore.use.actions();

  useEffect(() => {
    async function fetchServices() {
      const data: BookingType[] = [];
      const [spaBookings, hotelBookings] = await Promise.all([
        bookingApi.adminGetSpaBookings().catch((err: HttpError) => {
          toastError("Lấy danh sách đặt lịch spa thất bại");
          return [];
        }),
        bookingApi.adminGetHotelBookings().catch((err: HttpError) => {
          toastError("Lấy danh sách đặt lịch khách sạn thất bại");
          return [];
        }),
        ,
      ]);
      data.push(...spaBookings, ...hotelBookings);
      setBookings(data);
    }
    fetchServices();
  }, [setBookings]);

  return (
    <div className="container mx-auto py-10">
      <BookingEditDialog />
      <DataTable
        headerLabels={BookingLabelsWithActions}
        columns={bookingColumns}
        data={bookings}
      />
    </div>
  );
}
