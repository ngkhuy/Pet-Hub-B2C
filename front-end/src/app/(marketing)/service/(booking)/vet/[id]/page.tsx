// app/vet/services/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Syringe, Repeat, CalendarClock } from "lucide-react";
import Link from "next/link";
import { VetServiceResponseType } from "@/lib/types/vet";
import { mockItems } from "@/app/(marketing)/_common/mock";
import { clientUrl } from "@/lib/data/web-url";

// TODO: thay bằng fetch thực tế từ API / store của cậu
async function getVetService(
  id: string
): Promise<VetServiceResponseType | null> {
  // ví dụ: const res = await fetch(`${process.env.NEXT_PUBLIC_VET_API}/services/${id}`);
  // return res.ok ? await res.json() : null;

  // mock cho dễ test
  //   if (id !== "demo") return null;
  return {
    id: "demo",
    name: "Tiêm phòng định kỳ",
    description:
      "Gói tiêm phòng giúp thú cưng được bảo vệ toàn diện khỏi các bệnh truyền nhiễm phổ biến. Phù hợp cho cả chó và mèo.",
    base_price: 350000,
    duration_minutes: 30,
    follow_up_interval_days: 365,
    doses_required: 3,
    dose_interval_days: 21,
  };
}

export default async function VetServiceDetailPage(
  props: PageProps<"/service/vet/[id]">
) {
  const { id } = await props.params;

  const service = await getVetService(id);

  if (!service) {
    notFound();
  }

  const {
    name,
    description,
    base_price,
    duration_minutes,
    follow_up_interval_days,
    doses_required,
    dose_interval_days,
  } = service;

  const priceText = base_price.toLocaleString("vi-VN") + "₫";

  return (
    <div className="h-full w-full px-4 py-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
          >
            <Link href="/vet/services">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Xem thông tin chi tiết và lịch trình tiêm cho thú cưng.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
          {/* Hình ảnh + mô tả */}
          <Card className="overflow-hidden border-border/70 bg-card/80">
            <div className="relative h-72 w-full">
              <Image
                src={mockItems[3].img} // ảnh mẫu
                alt={name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full">
                  <Syringe className="mr-1 h-3.5 w-3.5" />
                  Tiêm phòng
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  Thời lượng {duration_minutes} phút
                </Badge>
                {follow_up_interval_days && (
                  <Badge variant="outline" className="rounded-full">
                    Tái khám mỗi {follow_up_interval_days} ngày
                  </Badge>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
                  Mô tả dịch vụ
                </h2>
                <p className="text-sm leading-relaxed text-foreground">
                  {description ??
                    "Dịch vụ tiêm phòng định kỳ giúp thú cưng được bảo vệ tốt nhất theo phác đồ của bác sĩ thú y."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin chi tiết / giá */}
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle>Thông tin gói dịch vụ</CardTitle>
              <CardDescription>
                Các thông số chính của phác đồ tiêm.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Giá */}
              <div className="rounded-xl bg-muted/60 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Giá cơ bản
                </p>
                <p className="mt-1 text-2xl font-semibold text-primary">
                  {priceText}
                </p>
                <p className="text-xs text-muted-foreground">
                  Giá có thể thay đổi tuỳ theo cân nặng, tình trạng sức khoẻ và
                  loại vắc xin.
                </p>
              </div>

              <Separator />

              {/* Thời lượng & lịch */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-muted p-2">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Thời lượng ước tính
                    </p>
                    <p className="text-sm font-medium">
                      {duration_minutes} phút / lần tiêm
                    </p>
                  </div>
                </div>

                {doses_required && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-muted p-2">
                      <Repeat className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Số mũi cần tiêm
                      </p>
                      <p className="text-sm font-medium">
                        {doses_required} mũi
                      </p>
                      {dose_interval_days && (
                        <p className="text-xs text-muted-foreground">
                          Mỗi mũi cách nhau khoảng {dose_interval_days} ngày.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {follow_up_interval_days && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-muted p-2">
                      <CalendarClock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Lịch tái tiêm / tái khám
                      </p>
                      <p className="text-sm font-medium">
                        Đề xuất tái tiêm mỗi {follow_up_interval_days} ngày.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <Button className="w-full rounded-full">
                <Link href={clientUrl.vet_service.path} className="w-full">
                  Đặt lịch tiêm cho thú cưng
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
