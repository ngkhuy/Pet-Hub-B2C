"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const schema = z.object({
  email_general: z.boolean(),
  email_marketing: z.boolean(),
  email_security: z.boolean(),
  sms_general: z.boolean(),
  sms_marketing: z.boolean(),
  sms_security: z.boolean(),
  push_general: z.boolean(),
  push_marketing: z.boolean(),
  push_security: z.boolean(),
});
type Pref = z.infer<typeof schema>;

export default function NotificationPage() {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<Pref>({
    resolver: zodResolver(schema),
    defaultValues: {
      email_general: true,
      email_marketing: true,
      email_security: true,
      sms_general: false,
      sms_marketing: false,
      sms_security: true,
      push_general: true,
      push_marketing: false,
      push_security: true,
    },
  });

  const setAll = (channel: "email" | "sms" | "push", value: boolean) => {
    const names = ["general", "marketing", "security"] as const;
    names.forEach((n) =>
      form.setValue(`${channel}_${n}` as keyof Pref, value, {
        shouldDirty: true,
      })
    );
  };

  const onSubmit = async (data: Pref) => {
    setIsSaving(true);
    try {
      // TODO: await api.saveNotificationPrefs(data)
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Đã lưu cài đặt thông báo", { position: "top-center" });
      form.reset(data); // clear dirty
    } catch {
      toast.error("Lưu thất bại. Thử lại sau.", { position: "top-center" });
    } finally {
      setIsSaving(false);
    }
  };

  const Row = ({
    title,
    desc,
    emailName,
    smsName,
    pushName,
  }: {
    title: string;
    desc: string;
    emailName: keyof Pref;
    smsName: keyof Pref;
    pushName: keyof Pref;
  }) => (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-start">
      <div className="sm:col-span-2">
        <h3 className="text-[#111418] dark:text-white text-base font-medium">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
      </div>
      <div className="flex items-center justify-between sm:justify-center gap-2">
        <Label htmlFor={String(emailName)} className="sr-only">
          Email {title}
        </Label>
        <Switch
          id={String(emailName)}
          checked={form.watch(emailName) as boolean}
          onCheckedChange={(v) =>
            form.setValue(emailName, v, { shouldDirty: true })
          }
          disabled={isSaving}
        />
      </div>
      <div className="flex items-center justify-between sm:justify-center gap-2">
        <Label htmlFor={String(smsName)} className="sr-only">
          SMS {title}
        </Label>
        <Switch
          id={String(smsName)}
          checked={form.watch(smsName) as boolean}
          onCheckedChange={(v) =>
            form.setValue(smsName, v, { shouldDirty: true })
          }
          disabled={isSaving}
        />
      </div>
      <div className="flex items-center justify-between sm:justify-center gap-2">
        <Label htmlFor={String(pushName)} className="sr-only">
          Push {title}
        </Label>
        <Switch
          id={String(pushName)}
          checked={form.watch(pushName) as boolean}
          onCheckedChange={(v) =>
            form.setValue(pushName, v, { shouldDirty: true })
          }
          disabled={isSaving}
        />
      </div>
    </div>
  );

  return (
    <section
      id="notifications"
      className="scroll-mt-24 bg-white dark:bg-(--background-secondary) p-6 lg:p-8 rounded-xl shadow-sm dark:border-gray-700"
    >
      <div className="flex flex-col gap-6">
        <header>
          <h2 className="text-(--text-primary) dark:text-white text-2xl font-bold leading-tight tracking-[-0.03em]">
            Quản lý thông báo
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base pt-2">
            Chọn cách bạn muốn nhận thông báo từ chúng tôi.
          </p>
        </header>

        <Separator />

        {/* Channel controls */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Bật/tắt nhanh theo kênh:
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAll("email", true)}
              disabled={isSaving}
            >
              Bật Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAll("email", false)}
              disabled={isSaving}
            >
              Tắt Email
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAll("sms", true)}
              disabled={isSaving}
            >
              Bật SMS
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAll("sms", false)}
              disabled={isSaving}
            >
              Tắt SMS
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAll("push", true)}
              disabled={isSaving}
            >
              Bật Push
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAll("push", false)}
              disabled={isSaving}
            >
              Tắt Push
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border/60 divide-y divide-border/60">
          {/* Header columns */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 text-sm text-muted-foreground">
            <div className="sm:col-span-2">Loại thông báo</div>
            <div className="text-center">Email</div>
            <div className="text-center">SMS</div>
            <div className="text-center">Push</div>
          </div>

          {/* Rows */}
          <div className="p-4">
            <Row
              title="Thông báo chung"
              desc="Tin tức, cập nhật hệ thống, lịch bảo trì."
              emailName="email_general"
              smsName="sms_general"
              pushName="push_general"
            />
          </div>
          <div className="p-4">
            <Row
              title="Khuyến mãi & tiếp thị"
              desc="Ưu đãi spa, khách sạn thú cưng, combo dịch vụ."
              emailName="email_marketing"
              smsName="sms_marketing"
              pushName="push_marketing"
            />
          </div>
          <div className="p-4">
            <Row
              title="Bảo mật & tài khoản"
              desc="Đăng nhập lạ, thay đổi mật khẩu, xác thực."
              emailName="email_security"
              smsName="sms_security"
              pushName="push_security"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSaving}
          >
            Hủy thay đổi
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving || !form.formState.isDirty}
            className="bg-primary text-white"
          >
            {isSaving ? "Đang lưu..." : "Lưu cài đặt"}
          </Button>
        </div>
      </div>
    </section>
  );
}
