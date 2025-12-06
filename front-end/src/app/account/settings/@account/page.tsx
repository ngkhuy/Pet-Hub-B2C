"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  LuUser,
  LuKeyRound,
  LuBell,
  LuShield,
  LuChevronRight,
  LuTrash2,
} from "react-icons/lu";
import { SmoothScrollLink } from "@/components/ui/custom/smooth-scroll-link";

export default function AccountPage() {
  const items = [
    {
      href: "/account/profile",
      title: "Hồ sơ cá nhân",
      desc: "Xem và chỉnh sửa thông tin cá nhân của bạn.",
      icon: LuUser,
    },
    {
      href: "#change-password",
      title: "Đổi mật khẩu",
      desc: "Cập nhật mật khẩu để bảo vệ tài khoản.",
      icon: LuKeyRound,
    },
    {
      href: "#notifications",
      title: "Thông báo",
      desc: "Quản lý cách bạn nhận thông báo.",
      icon: LuBell,
    },
    {
      href: "/user/security",
      title: "Bảo mật",
      desc: "2FA, phiên đăng nhập và thiết bị tin cậy.",
      icon: LuShield,
    },
  ];

  return (
    <div className="bg-white dark:bg-(--background-secondary) p-6 lg:p-8 rounded-xl shadow-sm border border-border">
      <div className="flex flex-col gap-6">
        <header>
          <h2 className="text-(--text-primary) dark:text-white text-2xl font-bold leading-tight tracking-[-0.03em]">
            Tài khoản &amp; Bảo mật
          </h2>
          <p className="text-(--text-secondary) dark:text-gray-400 text-base pt-2">
            Quản lý thông tin tài khoản và các tùy chọn bảo mật.
          </p>
        </header>

        <Separator />

        <nav className="rounded-lg border border-border/60 divide-y divide-border/60 overflow-hidden">
          {items.map(({ href, title, desc, icon: Icon }) => {
            const child: React.ReactNode = (
              <>
                {" "}
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 rounded-lg border border-border p-2">
                    <Icon className="h-5 w-5 text-(--text-secondary)" />
                  </div>
                  <div>
                    <h3 className="text-(--text-primary) dark:text-white text-base font-medium">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </div>
                </div>
                <LuChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </>
            );

            return href.startsWith("#") ? (
              <SmoothScrollLink href={href as `#${string}`} key={href}>
                {child}
              </SmoothScrollLink>
            ) : (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={title}
              >
                {child}
              </Link>
            );
          })}
        </nav>

        {/* Danger Zone */}
        <section className="mt-2">
          <h3 className="text-red-600 dark:text-red-500 text-base font-medium">
            Xóa tài khoản
          </h3>
          <p className="text-muted-foreground text-sm mt-1 mb-3">
            Khi bạn xóa tài khoản, toàn bộ dữ liệu sẽ bị xóa vĩnh viễn và không
            thể khôi phục.
          </p>

          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa tài khoản?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị
                  xóa khỏi hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-600/90">
                  Xác nhận xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>

            <Button
              variant="outline"
              className="cursor-pointer mt-1 h-11 border-red-600 text-red-600 hover:bg-red-600/10"
              asChild
            >
              <span className="inline-flex items-center gap-2">
                <LuTrash2 className="h-4 w-4" />
                Xóa tài khoản của tôi
              </span>
            </Button>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
}
