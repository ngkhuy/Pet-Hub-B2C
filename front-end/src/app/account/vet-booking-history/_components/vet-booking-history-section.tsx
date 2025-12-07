"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { VetBookingCard } from "@/app/account/vet-booking-history/_components/vet-booking-card";
import { BookingSkeleton } from "@/app/account/vet-booking-history/_components/vet-booking-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { HttpError } from "@/lib/api/client";
import { vetApi } from "@/lib/api/vet";
import { useVetBookingHistoryStore } from "@/lib/stores/vet-booking-history-store";
import { useVetServiceStore } from "@/lib/stores/vet-service-store";
import { toastError } from "@/lib/utils/toast";
import { Filter, PawPrint } from "lucide-react";
import { BookingStatusType } from "@/lib/types/booking";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export function VetBookingHistorySection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const startDate = searchParams.get("start_date") ?? "";
  const endDate = searchParams.get("end_date") ?? "";
  const statusParam = (searchParams.get("status") ?? "All") as
    | BookingStatusType
    | "All";

  // ====== store ======
  const filteredBookingsStore =
    useVetBookingHistoryStore.use.filteredBookings();
  const { setBookings, setFilteredBookings } =
    useVetBookingHistoryStore.use.actions();

  const { setServices, setFilteredServices } = useVetServiceStore.use.actions();

  const [isFetching, setIsFetching] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchText, setSearchText] = useState(""); // filter id + pet_id

  // ====== helper update URL ======
  const updateSearchParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  // ====== fetch BE mỗi khi query URL đổi ======
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const bookingsRes = await vetApi.getBookings({
          skip: page > 0 ? (page - 1) * PAGE_SIZE : 0,
          limit: PAGE_SIZE,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          status: statusParam === "All" ? undefined : statusParam,
        });

        setBookings(bookingsRes);
        setFilteredBookings(bookingsRes);

        const servicesRes = await vetApi.getServices();
        setServices(servicesRes);
        setFilteredServices(servicesRes);
      } catch (error) {
        const err = error as HttpError;
        toastError("Đã có lỗi xảy ra khi tải dữ liệu", {
          description: err.detail,
        });
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    }

    fetchData();
  }, [
    page,
    startDate,
    endDate,
    statusParam,
    setBookings,
    setFilteredBookings,
    setServices,
    setFilteredServices,
  ]);

  // ====== filter FE: id + pet_id + status, sort created_at/updated_at ======
  const clientFilteredAndSorted = useMemo(() => {
    const term = searchText.trim().toLowerCase();

    const base =
      term === ""
        ? filteredBookingsStore
        : filteredBookingsStore.filter((b) => {
            return (
              b.id.toLowerCase().includes(term) ||
              b.pet_id.toLowerCase().includes(term)
            );
          });

    return [...base].sort((a, b) => {
      // sort theo created_at, có thể đổi thành updated_at tùy UI
      const diff =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortOrder === "asc" ? diff : -diff;
    });
  }, [filteredBookingsStore, searchText, sortOrder]);

  // ====== pagination logic ======
  const isFirstPage = page <= 1;
  const isLastPage = clientFilteredAndSorted.length < PAGE_SIZE;

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
            ({clientFilteredAndSorted.length} kết quả)
          </span>
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
            placeholder="Tìm theo mã booking / pet_id"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="No_show">No show</SelectItem>
            </SelectContent>
          </Select>

          {/* sort created_at / updated_at */}
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ngày tạo ↑</SelectItem>
              <SelectItem value="desc">Ngày tạo ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TODO: thêm 2 date input start_date / end_date, onChange gọi updateSearchParams */}

      {/* Grid card booking */}
      <div className="grid grid-cols-1 gap-4  xl:grid-cols-3 ">
        {isFetching &&
          Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <BookingSkeleton key={index} />
          ))}

        {!isFetching && clientFilteredAndSorted.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            <PawPrint className="mb-1 h-6 w-6" />
            Hiện chưa có lịch khám thú y nào.
          </div>
        )}

        {clientFilteredAndSorted.map((item, index) => (
          <VetBookingCard key={item.id} index={index} booking={item} />
        ))}
      </div>

      {/* TODO: component Pagination: khi đổi trang -> updateSearchParams({ page: newPage }) */}
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
