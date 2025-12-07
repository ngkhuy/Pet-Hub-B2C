"use client";

import { DataTable } from "@/app/admin/vet/_components/data-table";
import { bookingColumns } from "@/app/admin/vet/booking-management/_components/booking-data-table";
import {
  BookingCreateDialog,
  BookingDeleteAlertDialog,
  BookingEditDialog,
} from "@/app/admin/vet/booking-management/_components/booking-dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vetApi } from "@/lib/api/vet";
import { BookingStatusSchema } from "@/lib/schemas/booking";
import { VetBookingLabels } from "@/lib/schemas/vet";
import { useVetBookingManagementStore } from "@/lib/stores/vet-booking-management-store";
import { BookingStatusLabels, BookingStatusType } from "@/lib/types/booking";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export default function VetBookingManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const startDate = searchParams.get("start_date") ?? "";
  const endDate = searchParams.get("end_date") ?? "";
  const statusParam = (searchParams.get("status") ?? "All") as
    | BookingStatusType
    | "All";

  const bookings = useVetBookingManagementStore.use.bookings();
  const { setBookings } = useVetBookingManagementStore.use.actions();

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
    async function fetchbookingss() {
      const bookingsRes = await vetApi.getBookings({
        skip: page > 0 ? (page - 1) * PAGE_SIZE : 0,
        limit: PAGE_SIZE,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        status: statusParam === "All" ? undefined : statusParam,
        user_id: searchUserId || undefined,
      });

      setBookings(bookingsRes);
    }
    fetchbookingss();
  }, [page, startDate, endDate, statusParam, searchUserId, setBookings]);

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
              type="date"
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
              type="date"
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
          <Input
            className="h-9 w-[220px]"
            placeholder="Tìm theo mã người dùng"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
          />

          {/* filter status -> đổi URL -> refetch BE */}
          <Select
            value={statusParam}
            onValueChange={(value) =>
              updateSearchParams({
                status: value === "all" ? null : value,
                page: "1",
              })
            }
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {BookingStatusSchema.options.map((status) => (
                <SelectItem key={status} value={status}>
                  {BookingStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <BookingCreateDialog />
      </div>
      <DataTable
        headerLabels={VetBookingLabels}
        columns={bookingColumns}
        data={bookings}
      />
      <BookingEditDialog />
      <BookingDeleteAlertDialog />

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
