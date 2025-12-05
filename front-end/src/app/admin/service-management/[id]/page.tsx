import Link from "next/link";
import {
  ChevronLeft,
  CalendarClock,
  Clock3,
  PawPrint,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { differenceInMinutes } from "date-fns";
import { adminUrl } from "@/lib/data/web-url";
import { BookingType, ServiceType } from "@/lib/types/booking";
import { currencyFormat, formatDate } from "@/lib/utils/format";

const statusColorMap: Record<BookingType["status"], string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Completed: "bg-sky-100 text-sky-800 border-sky-200",
  Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  No_show: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function ServiceDetailPage() {
  const service: ServiceType = {
    id: "d9a6c3e2-1234-5678-9abc-0123456789ab",
    name: "Tắm & Spa cho chó cỡ nhỏ",
    service_type: "Spa",
    pet_type: "Dog",
    price_per_hour: 150_000,
    duration_hours: 1,
  };

  const bookings: BookingType[] = [
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
    {
      id: "b1",
      user_id: "u1",
      pet_id: "p1",
      start_time: new Date(),
      end_time: new Date(),
      total_price: 150_000,
      status: "Confirmed",
      notes: "Khách muốn cắt lông ngắn hơn bình thường.",
      created_at: new Date(),
      updated_at: new Date(),
      services: [service],
    },
  ];

  const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter((b) =>
    differenceInMinutes(b.start_time, new Date())
  ).length;

  return (
    <div className="mx-auto flex w-full  flex-col gap-6 px-4 pb-10 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 h-8 px-2 text-sm text-muted-foreground"
          >
            <Link href={`${adminUrl.serviceManagement.path}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Quay lại danh sách dịch vụ
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {service.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Mã dịch vụ:{" "}
              <span className="font-mono text-xs">{service.id}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="flex items-center gap-1 rounded-full bg-primary/10 text-primary">
                <PawPrint className="h-3.5 w-3.5" />
                {String(service.pet_type)}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {String(service.service_type)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Card className="flex-1 border-dashed bg-muted/40">
            <CardContent className="flex items-center justify-between gap-4 p-3">
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground">
                  Giá / giờ
                </p>
                <p className="text-lg font-semibold">
                  {currencyFormat(service.price_per_hour)}
                </p>
                {service.duration_hours && (
                  <p className="text-xs text-muted-foreground">
                    Gợi ý thời lượng: {service.duration_hours} giờ
                  </p>
                )}
              </div>
              <Clock3 className="h-8 w-8 text-muted-foreground/60" />
            </CardContent>
          </Card>

          <Button className="h-10 rounded-xl shadow-sm">
            <CalendarClock className="mr-2 h-4 w-4" />
            Tạo booking mới
          </Button>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.3fr)]">
        {/* Service info */}
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Thông tin dịch vụ</CardTitle>
            <CardDescription>
              Thông tin chi tiết cho admin & bác sĩ thú y.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Loại dịch vụ
                </p>
                <p className="mt-1 font-medium">
                  {String(service.service_type)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Loài thú cưng
                </p>
                <p className="mt-1 font-medium">{String(service.pet_type)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Giá / giờ
                </p>
                <p className="mt-1 font-medium">
                  {currencyFormat(service.price_per_hour)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Thời lượng mặc định
                </p>
                <p className="mt-1 font-medium">
                  {service.duration_hours
                    ? `${service.duration_hours} giờ`
                    : "Linh hoạt"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Tổng booking
                </p>
                <p className="mt-1 text-base font-semibold">{totalBookings}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Booking sắp tới
                </p>
                <p className="mt-1 text-base font-semibold">
                  {upcomingBookings}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Doanh thu
                </p>
                <p className="mt-1 text-base font-semibold">
                  {currencyFormat(totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings table */}
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
            <div>
              <CardTitle className="text-base">Danh sách booking</CardTitle>
              <CardDescription>
                Tất cả lịch hẹn đã được đặt cho dịch vụ này.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[380px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/70 backdrop-blur">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[170px]">Thời gian</TableHead>
                    <TableHead className="w-[120px]">Khách hàng</TableHead>
                    <TableHead className="w-[120px]">Thú cưng</TableHead>
                    <TableHead className="w-[120px] text-right">
                      Tổng tiền
                    </TableHead>
                    <TableHead className="w-[120px]">Trạng thái</TableHead>
                    <TableHead>Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        Chưa có booking nào cho dịch vụ này.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((b) => (
                      <TableRow key={b.id} className="text-xs">
                        <TableCell className="align-top">
                          <div className="space-y-0.5">
                            <p className="font-medium">
                              {/* {dt.format(new Date(b.start_time))} */}
                              {formatDate({
                                date: new Date(b.start_time),
                                type: "short-datetime",
                              })}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              đến{" "}
                              {formatDate({
                                date: new Date(b.end_time),
                                type: "short-datetime",
                              })}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="align-top">
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="font-mono text-[11px]">
                              {String(b.user_id).slice(0, 6)}…
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="align-top">
                          <span className="font-mono text-[11px]">
                            {String(b.pet_id).slice(0, 6)}…
                          </span>
                        </TableCell>

                        <TableCell className="align-top text-right font-medium">
                          {currencyFormat(b.total_price)}
                        </TableCell>

                        <TableCell className="align-top">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                              statusColorMap[b.status]
                            )}
                          >
                            {b.status.replace("_", " ")}
                          </Badge>
                        </TableCell>

                        <TableCell className="max-w-[220px] align-top">
                          <p className="truncate text-[11px] text-muted-foreground">
                            {b.notes || "—"}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
