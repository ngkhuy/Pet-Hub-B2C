"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BooleanBadge } from "@/components/ui/custom/boolean-badge";

import { VetServiceResponseType } from "@/lib/types/vet";
import { currencyFormat } from "@/lib/utils/format";

export function VetServiceCard({
  service,
  onClickBooking,
}: {
  service: VetServiceResponseType;
  onClickBooking: () => void;
}) {
  const hasFollowUp = service.follow_up_interval_days !== null;
  const hasMultiDoses =
    service.doses_required !== null && service.doses_required > 1;

  return (
    <Card className="group flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex-1">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg line-clamp-2">
              {service.name}
            </CardTitle>
            {service.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {service.description}
              </CardDescription>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Giá tham khảo
            </p>
            <p className="text-lg font-bold text-primary leading-tight">
              {currencyFormat(service.base_price)}
            </p>
            <p className="text-[11px] text-muted-foreground">/ giờ</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-1 mt-6">
          {/* Section: Info */}
          <div>
            <p className="text-[11px] uppercase font-bold text-primary mb-1 tracking-wide">
              Thông tin dịch vụ
            </p>

            <section
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pb-3 
                        border-b border-muted/30"
            >
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Thời lượng gợi ý</p>
                <p className="font-semibold">{service.duration_minutes} phút</p>
              </div>

              {hasFollowUp && (
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">Lịch tái khám</p>
                  <p className="font-semibold">
                    Sau {service.follow_up_interval_days} ngày
                  </p>
                </div>
              )}

              {service.doses_required !== null && (
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">Số liều điều trị</p>
                  <p className="font-semibold">{service.doses_required} liều</p>
                </div>
              )}

              {service.dose_interval_days !== null && (
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">
                    Khoảng cách giữa các liều
                  </p>
                  <p className="font-semibold">
                    Mỗi {service.dose_interval_days} ngày
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Section: Badges */}
          <div>
            <p className="text-[11px] uppercase font-bold text-primary mb-2 tracking-wide">
              Trạng thái & Yêu cầu
            </p>

            <div className="flex flex-wrap gap-2">
              <BooleanBadge
                variant="info"
                value={hasFollowUp}
                trueLabel="Có lịch tái khám"
                falseLabel="Không yêu cầu tái khám"
              />

              {service.doses_required !== null && (
                <BooleanBadge
                  variant="warning"
                  value={hasMultiDoses}
                  trueLabel="Điều trị nhiều liều"
                  falseLabel="Điều trị 1 liều"
                />
              )}
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-0 border-t border-border/60 flex gap-2 justify-between">
        <Button
          variant="default"
          className="w-full text-sm sm:text-base font-semibold"
          onClick={onClickBooking}
        >
          Đặt dịch vụ
        </Button>
      </CardFooter>
    </Card>
  );
}
