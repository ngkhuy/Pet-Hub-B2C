import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { clientUrl } from "@/lib/data/web-url";
import { getPetById } from "@/lib/stores/own-pet-store";
import { useVetBookingHistoryStore } from "@/lib/stores/vet-booking-history-store";
import { BookingStatusLabels } from "@/lib/types/booking";
import { VetBookingResponseType } from "@/lib/types/vet";
import { cn } from "@/lib/utils";
import { currencyFormat, formatDate } from "@/lib/utils/format";
import {
  Calendar,
  Clock,
  Eye,
  PawPrint,
  Pencil,
  ReceiptText,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type BookingCardProps = {
  index: number;
  booking: VetBookingResponseType;
};

// ...imports giữ nguyên

export function VetBookingCard({ index, booking }: BookingCardProps) {
  const pet = getPetById(booking.pet_id);

  // duration (phút)
  const durationMs = booking.end_time.getTime() - booking.start_time.getTime();
  const durationMinutes = Math.max(Math.round(durationMs / 60000), 0);
  const durationLabel =
    durationMinutes < 60
      ? `${durationMinutes} phút`
      : `${Math.floor(durationMinutes / 60)}h${
          durationMinutes % 60 ? ` ${durationMinutes % 60}p` : ""
        }`;

  const totalPrice = booking.services.reduce(
    (total, service) => total + service.base_price,
    0
  );

  const mainService = booking.services[0];
  const extraServiceCount =
    booking.services.length > 1 ? booking.services.length - 1 : 0;

  const serviceTitle = mainService
    ? `${mainService.name}${
        extraServiceCount ? ` + ${extraServiceCount} dịch vụ khác` : ""
      }`
    : "Dịch vụ khám thú y";

  const {
    setBookingCancel,
    setBookingEdit,
    setBookingInfo,
    setIsOpenCancelDialog,
    setIsOpenEditDialog,
    setIsOpenInfoDialog,
  } = useVetBookingHistoryStore.use.actions();

  return (
    <Card className="relative flex h-full flex-col rounded-2xl border bg-card/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* ===== Header ===== */}
      <CardHeader className="space-y-1 pr-10">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="h-6 px-2 text-[11px]">
            #{index + 1}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              "px-2 py-0.5 text-[10px] font-medium rounded-full border-transparent",
              "bg-emerald-50 text-emerald-700"
            )}
          >
            {BookingStatusLabels[booking.status]}
          </Badge>
        </div>

        <CardTitle className="mt-1 line-clamp-1 text-sm font-semibold">
          {serviceTitle}
        </CardTitle>

        <CardDescription className="flex items-center gap-1 text-[11px]">
          <PawPrint className="h-3 w-3" />
          <span className="truncate">
            {pet
              ? `${pet.name} • ${pet.breed ?? pet.species}`
              : "Thú cưng (đã xoá)"}
          </span>
        </CardDescription>
      </CardHeader>

      {/* ===== Content ===== */}
      <CardContent className="space-y-3 text-xs">
        <div className="space-y-2">
          {/* Thời gian khám */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wide">
                Thời gian khám
              </span>
            </div>
            <span className="text-xs font-medium">
              {formatDate({ date: booking.start_time })}
            </span>
          </div>

          {/* Thời lượng */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wide">
                Thời lượng
              </span>
            </div>
            <span className="text-xs font-medium">{durationLabel}</span>
          </div>

          {/* Tổng thanh toán */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ReceiptText className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wide">
                Tổng thanh toán
              </span>
            </div>
            <span className="text-sm font-bold text-primary">
              {currencyFormat(totalPrice)}
            </span>
          </div>

          {/* Ngày tạo */}
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px]">Tạo lúc</span>
            <span className="text-[11px]">
              {formatDate({ date: booking.created_at })}
            </span>
          </div>

          {/* Ngày cập nhật */}
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px]">Cập nhật</span>
            <span className="text-[11px]">
              {formatDate({ date: booking.updated_at })}
            </span>
          </div>
        </div>

        {/* Ghi chú */}
        {booking.notes?.trim() && (
          <div className="rounded-xl bg-muted/40 px-3 py-2">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Ghi chú
            </p>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {booking.notes}
            </p>
          </div>
        )}
      </CardContent>

      {/* ===== Footer ===== */}
      <CardFooter className="mt-auto flex items-center justify-between gap-2 pt-2">
        <div className="flex gap-2">
          <Link
            href={`${clientUrl.account_vet_booking_history.path}/${booking.id}`}
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => {
                setBookingInfo(booking);
                setIsOpenInfoDialog(true);
              }}
            >
              <Eye className="h-3.5 w-3.5" />
              Chi tiết
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => {
              setBookingEdit(booking);
              setIsOpenEditDialog(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa ghi chú
          </Button>
        </div>

        <Button
          variant="destructive"
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={() => {
            setBookingCancel(booking);
            setIsOpenCancelDialog(true);
          }}
          disabled={
            booking.status === "Cancelled" || booking.status === "Completed"
          }
        >
          <XCircle className="h-3.5 w-3.5" />
          Huỷ
        </Button>
      </CardFooter>
    </Card>
  );
}
