import { BookingServiceItem } from "@/app/account/booking-history/_common/utils";
import {
  BookingCancelAlert,
  BookingDetailDialog,
  BookingNotesDialog,
} from "@/app/account/booking-history/_components/booking-dialog";
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
import {
  getBookingById,
  useBookingHistoryStore,
} from "@/lib/stores/booking-history-store";
import { getPetById } from "@/lib/stores/own-pet-store";
import {
  BookingStatusLabels,
  BookingType,
  ServiceType,
  ServiceTypeLabels,
} from "@/lib/types/booking";
import { PetType } from "@/lib/types/user-management";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/format";
import {
  Calendar,
  Clock,
  Eye,
  PawPrint,
  Pencil,
  ReceiptText,
  XCircle,
} from "lucide-react";

type BookingCardProps = {
  index: number;
  booking: BookingType;
};
export function BookingCard({ index, booking }: BookingCardProps) {
  const pet = getPetById(booking.pet_id);
  const duration = booking.services.reduce(
    (acc, service) => acc + (service.duration_hours ?? 0),
    0
  );
  const {
    setBookingCancelId,
    setBookingEditId,
    setBookingInfoId,
    setIsOpenCancelDialog,
    setIsOpenEditDialog,
    setIsOpenInfoDialog,
  } = useBookingHistoryStore.use.actions();
  const handleSaveNotes = () => {
    setBookingEditId(booking?.id ?? "");
    setIsOpenEditDialog(true);
  };

  const handleCancelBooking = () => {
    setBookingCancelId(booking?.id ?? "");
    setIsOpenCancelDialog(true);
  };

  const handleDetailBooking = () => {
    setBookingInfoId(booking?.id ?? "");
    setIsOpenInfoDialog(true);
  };

  return (
    <Card className="relative flex h-full flex-col rounded-2xl border bg-card/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <BookingCardHeader
        index={index}
        service={booking?.services[0] ?? ({} as ServiceType)}
        pet={pet}
        booking={booking}
      />

      <CardContent className="space-y-3 text-xs">
        <BookingCardMain booking={booking!} durationLabel={duration} />
        <BookingCardNotes notes={booking.notes} />
      </CardContent>

      <BookingCardFooter
        onOpenDetail={handleDetailBooking}
        onOpenEdit={handleSaveNotes}
        onOpenCancel={handleCancelBooking}
      />
    </Card>
  );
}

type BookingCardHeaderProps = {
  index: number;
  service: ServiceType;
  pet: PetType | undefined;
  booking: BookingType;
};
function BookingCardHeader({
  index,
  service,
  pet,
  booking,
}: BookingCardHeaderProps) {
  return (
    <>
      {/* STT */}
      <div className="absolute right-3 top-3">
        <Badge variant="outline" className="h-6 px-2 text-[11px]">
          #{index + 1}
        </Badge>
      </div>

      <CardHeader className="pr-10">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <span>{service.name}</span>
              <Badge
                variant="outline"
                className={cn(
                  "px-2 py-0.5 text-[10px] font-medium rounded-full border-transparent",
                  service.service_type === "Spa" &&
                    "bg-emerald-50 text-emerald-700",
                  service.service_type === "Hotel" && "bg-sky-50 text-sky-700"
                )}
              >
                {ServiceTypeLabels[service.service_type]}
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
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2 text-[11px]">
              <PawPrint className="h-3 w-3" />
              <span>
                {pet?.name} • {pet?.breed ?? pet?.species}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </>
  );
}

type BookingCardMainProps = {
  booking: BookingType;
  durationLabel: string | number;
};
function BookingCardMain({ booking, durationLabel }: BookingCardMainProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium uppercase tracking-wide">
            Bắt đầu
          </span>
        </div>
        <span className="text-sm font-medium">
          {formatDate({ date: booking.start_time })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium uppercase tracking-wide">
            Tạo lúc
          </span>
        </div>
        <span className="text-xs">
          {formatDate({ date: booking.created_at })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium uppercase tracking-wide">
            Thời lượng
          </span>
        </div>
        <span className="text-sm font-medium">{durationLabel}</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ReceiptText className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium uppercase tracking-wide">
            Tổng thanh toán
          </span>
        </div>
        <span className="text-sm font-bold text-primary">
          {booking.total_price.toLocaleString("vi-VN")}₫
        </span>
      </div>
    </div>
  );
}

type BookingCardNotesProps = {
  notes?: string;
};

function BookingCardNotes({ notes }: BookingCardNotesProps) {
  if (!notes?.trim()) return null;

  return (
    <div className="rounded-xl bg-muted/40 px-3 py-2">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Ghi chú
      </p>
      <p className="line-clamp-2 text-xs text-muted-foreground">{notes}</p>
    </div>
  );
}

type BookingCardFooterProps = {
  onOpenDetail: () => void;
  onOpenEdit: () => void;
  onOpenCancel: () => void;
};

function BookingCardFooter({
  onOpenDetail,
  onOpenEdit,
  onOpenCancel,
}: BookingCardFooterProps) {
  return (
    <CardFooter className="mt-auto flex items-center justify-between gap-2 pt-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={onOpenDetail}
        >
          <Eye className="h-3.5 w-3.5" />
          Chi tiết
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={onOpenEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
          Sửa ghi chú
        </Button>
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="h-8 gap-1 text-xs"
        onClick={onOpenCancel}
      >
        <XCircle className="h-3.5 w-3.5" />
        Huỷ
      </Button>
    </CardFooter>
  );
}
