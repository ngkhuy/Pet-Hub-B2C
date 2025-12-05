"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LuFacebook,
  LuTwitter,
  LuInstagram,
  LuMail,
  LuArrowUpRight,
} from "react-icons/lu";

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand + newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-bold text-foreground">
              PetCare Connect
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Nền tảng đặt lịch thú y, spa, khách sạn thú cưng &amp; nhận nuôi
              an toàn.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex w-full items-center gap-2"
              aria-label="Đăng ký nhận tin"
              noValidate
            >
              <Input
                type="email"
                inputMode="email"
                placeholder="Nhập email của bạn"
                aria-label="Email"
                className="h-10"
                required
              />
              <Button type="submit" className="h-10">
                <LuMail className="mr-2 h-4 w-4" />
                Đăng ký
              </Button>
            </form>
          </div>

          {/* Company */}
          <nav aria-label="Công ty" className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground">Công ty</h3>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              href="/about"
            >
              Về chúng tôi <LuArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/contact"
            >
              Liên hệ
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/adoption"
            >
              Nhận nuôi thú cưng
            </Link>
          </nav>

          {/* Support */}
          <nav aria-label="Hỗ trợ" className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground">Hỗ trợ</h3>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/terms"
            >
              Điều khoản dịch vụ
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/privacy"
            >
              Chính sách bảo mật
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/help"
            >
              Trung tâm trợ giúp
            </Link>
          </nav>

          {/* Partner */}
          <nav aria-label="Đối tác" className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground">
              Dành cho đối tác
            </h3>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/business/register"
            >
              Đăng ký Business
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/clinic/onboarding"
            >
              Tham gia phòng khám thú y
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/docs/api"
            >
              Tài liệu API
            </Link>
          </nav>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} PetCare Connect. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="https://facebook.com"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
            >
              <LuFacebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              aria-label="Twitter"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
            >
              <LuTwitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
            >
              <LuInstagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
