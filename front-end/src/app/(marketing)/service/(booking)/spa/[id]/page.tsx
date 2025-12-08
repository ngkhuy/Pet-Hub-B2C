// app/services/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
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
import { ArrowLeft, Clock, PawPrint, Banknote } from "lucide-react";
import { ServiceType } from "@/lib/types/booking";
import { PetTypeSchema, ServiceTypeSchema } from "@/lib/schemas/booking";
import { mockItems } from "@/app/(marketing)/_common/mock";
import { clientUrl } from "@/lib/data/web-url";

// TODO: thay bằng fetch thật từ API
async function getService(id: string): Promise<ServiceType | null> {
  return {
    id,
    name: "Dịch vụ chăm sóc thú cưng cao cấp",
    service_type: ServiceTypeSchema.enum.Spa,
    pet_type: PetTypeSchema.enum.Cat,
    price_per_hour: 550000,
    duration_hours: 1,
  };
}

export default async function ServiceDetailPage(
  props: PageProps<"/service/hotel/[id]">
) {
  const { id } = await props.params;

  const service = await getService(id);

  if (!service) {
    notFound();
  }

  const { name, service_type, pet_type, price_per_hour, duration_hours } =
    service!;

  const priceText = price_per_hour.toLocaleString("vi-VN") + "₫ / giờ";

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
            <Link href={clientUrl.home.path}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Xem thông tin chi tiết dịch vụ và đặt lịch cho thú cưng.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
          {/* Hình ảnh + mô tả ngắn */}
          <Card className="overflow-hidden border-border/70 bg-card/80">
            <div className="relative h-72 w-full">
              <Image
                src={mockItems[0].img}
                // đặt 1 ảnh mẫu ở public/images/services/service-default.jpg
                alt={name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full">
                  <PawPrint className="mr-1 h-3.5 w-3.5" />
                  {String(pet_type)}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {String(service_type)}
                </Badge>
                {duration_hours && (
                  <Badge variant="outline" className="rounded-full">
                    Thời lượng ~ {duration_hours} giờ
                  </Badge>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
                  Giới thiệu dịch vụ
                </h2>
                <p className="text-sm leading-relaxed text-foreground">
                  Dịch vụ {name.toLowerCase()} giúp thú cưng được chăm sóc
                  chuyên nghiệp và thoải mái nhất. Mô tả chi tiết có thể được
                  lấy từ API và hiển thị tại đây.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Giá & thông tin thêm */}
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle>Thông tin gói dịch vụ</CardTitle>
              <CardDescription>
                Giá, thời lượng và đối tượng áp dụng.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Giá */}
              <div className="rounded-xl bg-muted/60 p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-background p-2">
                    <Banknote className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Giá dịch vụ
                    </p>
                    <p className="text-2xl font-semibold text-primary">
                      {priceText}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tính theo mỗi giờ sử dụng dịch vụ.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Thời lượng */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-muted p-2">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Thời lượng ước tính
                  </p>
                  <p className="text-sm font-medium">
                    {duration_hours
                      ? `${duration_hours} giờ`
                      : "Tuỳ theo gói dịch vụ và nhu cầu thực tế."}
                  </p>
                </div>
              </div>

              <Separator />

              <Button className="w-full rounded-full">Đặt lịch dịch vụ</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
