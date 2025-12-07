"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { getBookingById } from "@/lib/stores/vet-booking-history-store";
import { getPetById } from "@/lib/stores/own-pet-store";
import { BookingStatusLabels } from "@/lib/types/booking";
import { currencyFormat, formatDate } from "@/lib/utils/format";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Info,
  PawPrint,
  ReceiptText,
  Stethoscope,
} from "lucide-react";

export default function VetBookingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const booking = getBookingById(params.id);

  const pet = useMemo(
    () => (booking ? getPetById(booking.pet_id) : null),
    [booking]
  );

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Không tìm thấy booking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Booking có thể đã bị xoá hoặc bạn truy cập sai đường dẫn.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // duration
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

  return (
    <div className="mx-auto max-w-7xl space-y-10 py-10 px-4 sm:px-6 lg:px-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại lịch sử
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Mã booking: <span className="font-mono text-xs">{booking.id}</span>
          </span>
          <Badge>{BookingStatusLabels[booking.status]}</Badge>
        </div>
      </div>

      {/* Summary card */}
      <Card className="border-primary/10 bg-card/80">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="h-5 w-5 text-primary" />
              Chi tiết booking khám thú y
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Tạo lúc{" "}
              <span className="font-medium">
                {formatDate({
                  date: booking.created_at,
                  type: "short-datetime",
                })}
              </span>{" "}
              • Cập nhật lần cuối{" "}
              <span className="font-medium">
                {formatDate({
                  date: booking.updated_at,
                  type: "short-datetime",
                })}
              </span>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Pet info */}
            <div className="space-y-2 rounded-xl border bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Thú cưng
                </p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {pet ? pet.name : "Thú cưng (đã xoá)"}
                </p>
                {pet && (
                  <>
                    <p className="text-xs text-muted-foreground">
                      {pet.breed ?? pet.species}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ngày sinh: {formatDate({ date: pet.birth, type: "date" })}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Time & payment */}
            <div className="space-y-2 rounded-xl border bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Thời gian & thanh toán
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Bắt đầu</span>
                  <span className="text-xs font-medium">
                    {formatDate({ date: booking.start_time })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    Kết thúc
                  </span>
                  <span className="text-xs font-medium">
                    {formatDate({ date: booking.end_time })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Thời lượng
                  </div>
                  <span className="text-xs font-medium">{durationLabel}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ReceiptText className="h-3.5 w-3.5" />
                    Tổng thanh toán
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {currencyFormat(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms & notes */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Triệu chứng / lý do khám
                </p>
              </div>
              <p className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                {booking.symptoms?.trim() || "Không có thông tin."}
              </p>
            </div>

            {booking.notes?.trim() && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ghi chú của bạn
                </p>
                <p className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="h-4 w-4 text-primary" />
            Dịch vụ trong booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {booking.services.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Chưa có thông tin dịch vụ.
            </p>
          )}

          <div className="space-y-2">
            {booking.services.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-1 rounded-xl border bg-muted/40 p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{s.name}</p>
                  {s.description && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {s.description}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Thời lượng: {s.duration_minutes} phút
                  </p>
                  {s.follow_up_interval_days != null && (
                    <p className="text-[11px] text-muted-foreground">
                      Tái khám sau: {s.follow_up_interval_days} ngày
                    </p>
                  )}
                  {s.doses_required != null && (
                    <p className="text-[11px] text-muted-foreground">
                      Liệu trình: {s.doses_required} liều
                      {s.dose_interval_days != null &&
                        ` • mỗi ${s.dose_interval_days} ngày`}
                    </p>
                  )}
                </div>

                <div className="mt-1 text-right sm:mt-0">
                  <p className="text-xs text-muted-foreground">Đơn giá</p>
                  <p className="text-sm font-semibold">
                    {currencyFormat(s.base_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
