// app/admin/shop-info-management/page.tsx
"use client";

import Link from "next/link";
import { Globe2, Store, Mail, Phone } from "lucide-react";

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
import { LuFacebook, LuGithub, LuInstagram } from "react-icons/lu";
import envConfig from "@/config/config";

const shopInfo = {
  name: envConfig.BRAND_NAME,
  description: envConfig.APP_DESCRIPTION,
  baseUrl: envConfig.APP_URL,
  supportEmail: envConfig.NEXT_PUBLIC_SUPPORT_EMAIL,
  phone: envConfig.NEXT_PUBLIC_PHONE_NUMBER,
  facebook: envConfig.NEXT_PUBLIC_FACEBOOK_URL,
  instagram: envConfig.NEXT_PUBLIC_INSTAGRAM_URL,
  github: envConfig.NEXT_PUBLIC_GITHUB_URL,
};

type InfoRowProps = {
  icon?: React.ReactNode;
  label: string;
  value: string;
  valueAsLink?: string;
};

function InfoRow({ icon, label, value, valueAsLink }: InfoRowProps) {
  const content = valueAsLink ? (
    <Link
      href={valueAsLink}
      target="_blank"
      className="text-sm font-medium text-primary hover:underline break-all"
    >
      {value}
    </Link>
  ) : (
    <p className="text-sm font-medium text-foreground break-all">{value}</p>
  );

  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      )}
      <div className="flex-1 space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase">
          {label}
        </p>
        {content}
      </div>
    </div>
  );
}

export default function ShopInfoPage() {
  return (
    <div className="h-full w-full px-4 py-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Thông tin shop
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Quản lý thông tin cơ bản, liên hệ và mạng xã hội của hệ thống
              {` ${shopInfo.name}`}.
            </p>
          </div>
          <Badge variant="default" className="rounded-full font-bold px-3 py-1">
            Admin view
          </Badge>
        </div>

        {/* Nội dung */}
        <div className="grid gap-6 md:grid-cols-[2fr,1.2fr]">
          {/* Thông tin chung */}
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Thông tin chung
              </CardTitle>
              <CardDescription>
                Những thông tin mô tả thương hiệu và trang chủ của hệ thống.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="Tên thương hiệu" value={shopInfo.name} />
              <Separator />
              <InfoRow
                label="Mô tả"
                value={shopInfo.description}
                icon={<Store className="h-4 w-4" />}
              />
              <Separator />
              <InfoRow
                label="Trang chủ"
                value={shopInfo.baseUrl}
                valueAsLink={shopInfo.baseUrl}
                icon={<Globe2 className="h-4 w-4" />}
              />

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline" className="rounded-full">
                  Đang hoạt động
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  Pet shop • Vet • Spa • Hotel
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Liên hệ & mạng xã hội */}
          <div className="space-y-4">
            <Card className="border-border/70 bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Thông tin liên hệ
                </CardTitle>
                <CardDescription>
                  Dùng để hiển thị cho khách hàng và gửi thông báo hệ thống.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  label="Email hỗ trợ"
                  value={shopInfo.supportEmail}
                  icon={<Mail className="h-4 w-4" />}
                />
                <Separator />
                <InfoRow
                  label="Số điện thoại"
                  value={shopInfo.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  Mạng xã hội
                </CardTitle>
                <CardDescription>
                  Kết nối với khách hàng qua các kênh chính thức.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="justify-start gap-2"
                >
                  <Link href={shopInfo.facebook} target="_blank">
                    <LuFacebook className="h-4 w-4" />
                    Facebook
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="justify-start gap-2"
                >
                  <Link href={shopInfo.instagram} target="_blank">
                    <LuInstagram className="h-4 w-4" />
                    Instagram
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="justify-start gap-2"
                >
                  <Link href={shopInfo.github} target="_blank">
                    <LuGithub className="h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
