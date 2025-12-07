"use client";

import { serviceColumns } from "@/app/admin/service-management/_component/service-column";
import { DataTable } from "@/components/ui/table/data-table";
import { bookingApi } from "@/lib/api/booking";
import { BookingLabelsWithActions, BookingType } from "@/lib/types/booking";
import { toastError } from "@/lib/utils/toast";
import { useEffect, useState } from "react";
import { BookingEditDialog } from "@/app/admin/booking-management/_component/booking-dialog";
import { useBookingManagementStore } from "@/lib/stores/booking-management-store";
import { HttpError } from "@/lib/api/client";
import { bookingColumns } from "@/app/admin/booking-management/_component/booking-table";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 5;

export default function BookingManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const startDate = searchParams.get("start_date") ?? "";
  const endDate = searchParams.get("end_date") ?? "";
  const bookings = useBookingManagementStore.use.bookings();
  const { setBookings } = useBookingManagementStore.use.actions();

  const [searchUserId, setSearchUserId] = useState("");

  // ====== helper update URL ======
  const updateSearchParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  // ====== pagination logic ======
  const isFirstPage = page <= 1;
  const isLastPage = bookings.length < PAGE_SIZE;

  const prevPages: number[] = [];
  for (let i = 3; i >= 1; i--) {
    const p = page - i;
    if (p >= 1) prevPages.push(p);
  }

  const nextPages: number[] = [];
  if (!isLastPage) {
    for (let i = 1; i <= 2; i++) {
      const p = page + i;
      if (p >= 1) nextPages.push(p);
    }
  }
  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage === page) return;
    updateSearchParams({ page: String(newPage) });
  }

  useEffect(() => {
    async function fetchServices() {
      const data: BookingType[] = [];
      const [spaBookings, hotelBookings] = await Promise.all([
        bookingApi
          .adminGetSpaBookings({
            limit: PAGE_SIZE,
            offset: page > 0 ? (page - 1) * PAGE_SIZE : 0,
            start_time_from: startDate || undefined,
            start_time_to: endDate || undefined,
          })
          .catch((err: HttpError) => {
            toastError("Lấy danh sách đặt lịch spa thất bại");
            return [];
          }),
        bookingApi
          .adminGetHotelBookings({
            limit: PAGE_SIZE,
            offset: page > 0 ? (page - 1) * PAGE_SIZE : 0,
            start_time_from: startDate || undefined,
            start_time_to: endDate || undefined,
          })
          .catch((err: HttpError) => {
            toastError("Lấy danh sách đặt lịch khách sạn thất bại");
            return [];
          }),
        ,
      ]);
      data.push(...spaBookings, ...hotelBookings);
      setBookings(data);
    }
    fetchServices();
  }, [page, startDate, endDate, setBookings]);

  return (
    <div className="container mx-auto py-10">
      {/* Bộ lọc / sắp xếp */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Sắp xếp & lọc booking
          </span>
          {/* <span className="text-sm font-medium text-muted-foreground">
            ({clientFilteredAndSorted.length} kết quả)
          </span> */}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* date range filter */}
          <div className="flex items-center gap-2">
            <Input
              type="datetime-local"
              className="h-9 w-40"
              value={startDate}
              onChange={(e) =>
                updateSearchParams({
                  start_date: e.target.value || null,
                  page: "1",
                })
              }
            />
            <span className="text-xs text-muted-foreground">đến</span>
            <Input
              type="datetime-local"
              className="h-9 w-40"
              value={endDate}
              onChange={(e) =>
                updateSearchParams({
                  end_date: e.target.value || null,
                  page: "1",
                })
              }
            />
          </div>

          {/* search id / pet_id */}
          {/* <Input
            className="h-9 w-[220px]"
            placeholder="Tìm theo mã người dùng"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
          /> */}
        </div>
      </div>
      <BookingEditDialog />
      <DataTable
        headerLabels={BookingLabelsWithActions}
        columns={bookingColumns}
        data={bookings}
      />

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!isFirstPage) handlePageChange(page - 1);
              }}
              className={isFirstPage ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Các trang trước (tối đa 3) */}
          {prevPages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Trang hiện tại */}
          <PaginationItem>
            <PaginationLink href="#" isActive>
              {page}
            </PaginationLink>
          </PaginationItem>

          {/* Các trang sau (tối đa 2) */}
          {nextPages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Nếu còn trang sau nữa, cho Ellipsis + nút Next */}
          {!isLastPage && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  title="Trang kế tiếp"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
