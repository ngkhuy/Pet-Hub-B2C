"use client";

import {
  BookingServiceItem,
  buildPriority,
  compareByKey,
  SortKey,
  SortOrder,
} from "@/app/account/booking-history/_common/utils";
import { BookingCard } from "@/app/account/booking-history/_components/booking-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingApi } from "@/lib/api/booking";
import { HttpError } from "@/lib/api/client";
import { useBookingHistoryStore } from "@/lib/stores/booking-history-store";
import { toastError } from "@/lib/utils/toast";
import { Filter, PawPrint } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function BookingHistorySection() {
  const bookings = useBookingHistoryStore.use.bookings();
  const { setBookings } = useBookingHistoryStore.use.actions();
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<
    "all" | "Hotel" | "Spa"
  >("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // flatten Booking x Service
  const items = useMemo<BookingServiceItem[]>(() => {
    return bookings.flatMap((booking) =>
      booking.services.map((service) => ({ booking, service }))
    );
  }, [bookings]);

  const sortedItems = useMemo(() => {
    const filtered =
      serviceTypeFilter === "all"
        ? items
        : items.filter((i) => i.service.service_type === serviceTypeFilter);

    const priorities = buildPriority(sortBy);
    const order = sortOrder;
    return [...filtered].sort((a, b) => {
      for (const key of priorities) {
        const diff = compareByKey(key, a, b, order);
        if (diff !== 0) return diff;
      }
      return 0;
    });
  }, [items, sortBy, serviceTypeFilter, sortOrder]);

  useEffect(() => {
    async function fetchBookings() {
      const [spaBookings, hotelBooking] = await Promise.all([
        bookingApi.getSpaBookingHistory().catch((error: HttpError) => {
          toastError("Không tải được lịch sử đặt chỗ spa", {
            description: error.detail,
          });
          return [];
        }),
        bookingApi.getHotelBookingHistory().catch((error: HttpError) => {
          toastError("Không tải được lịch sử đặt chỗ khách sạn", {
            description: error.detail,
          });
          return [];
        }),
      ]);

      const allBookings = [...spaBookings, ...hotelBooking].filter(
        (b) => b.status !== "No_show"
      );
      allBookings.sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      );
      console.log("Fetched bookings:", allBookings);
      setBookings(allBookings);
    }
    fetchBookings();
  }, [setBookings]);

  return (
    <div className="space-y-4">
      {/* Bộ lọc / sắp xếp */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Sắp xếp & lọc booking
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            ({sortedItems.length} kết quả)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortKey)}
          >
            <SelectTrigger className="h-9 w-[190px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Mới tạo gần nhất</SelectItem>
              <SelectItem value="start_time">Ngày bắt đầu</SelectItem>
              <SelectItem value="total_price">Tổng tiền</SelectItem>
              <SelectItem value="duration">Thời lượng dịch vụ</SelectItem>
              <SelectItem value="service_type">Loại dịch vụ</SelectItem>
              <SelectItem value="status">Trạng thái</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={serviceTypeFilter}
            onValueChange={(value) =>
              setServiceTypeFilter(value as "all" | "Hotel" | "Spa")
            }
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Loại dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả dịch vụ</SelectItem>
              <SelectItem value="Spa">Spa</SelectItem>
              <SelectItem value="Hotel">Khách sạn</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOrder)}
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Loại dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Tăng</SelectItem>
              <SelectItem value="desc">Giảm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid card booking */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedItems.map((item, index) => (
          <BookingCard
            key={item.booking.id}
            index={index}
            booking={item.booking}
          />
        ))}

        {bookings.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            <PawPrint className="mb-1 h-6 w-6" />
            Hiện chưa có dịch vụ nào được đặt.
          </div>
        )}
      </div>
    </div>
  );
}
