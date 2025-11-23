"use client";

import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import rightBg from "@/assets/images/login-right-background.jpg";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { InputField } from "@/components/ui/custom/input-field";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { toastSuccess } from "@/lib/utils/toast";
import { MdOutlinePets } from "react-icons/md";
import { siteConfig } from "@/config/site";
import {
  ResetPasswordRequest,
  resetPasswordRequestSchema,
} from "@/lib/schemas/user";

export default function ForgotPassword() {
  const router = useRouter();

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: { email: "", purpose: "reset_password" },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: ResetPasswordRequest) {
    await new Promise((r) => setTimeout(r, 2000));
    toastSuccess("OTP đã được gửi tới email!");
    router.push(`/forgot-password/verify?email=${data.email}`);
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left UI */}
        <div className="relative hidden lg:flex items-center justify-center bg-primary">
          <Image src={rightBg} alt="" fill className="object-cover inset-0" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/20 via-primary/10 to-transparent"></div>
        </div>

        {/* Right UI */}
        <div className="flex w-full flex-col items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md flex flex-col gap-8">
            <motion.div
              className="flex w-full flex-col items-center text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 pb-4">
                <MdOutlinePets className="text-4xl text-primary" />
                <p className="text-3xl font-bold text-primary">
                  {siteConfig.brandName}
                </p>
              </div>

              <p className="text-4xl font-black text-(--text-primary)">
                Quên mật khẩu
              </p>
              <p className="text-(--text-secondary) mt-2">
                Nhập email để nhận mã OTP
              </p>
            </motion.div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="relative"
              id="form-forgot-password"
            >
              <FieldGroup className="gap-10">
                <InputField<ResetPasswordRequest>
                  id="form-forgot-password-email"
                  control={form.control}
                  name="email"
                  type="email"
                  label="Địa chỉ email"
                  inputProps={{
                    placeholder: "you@example.com",
                    autoComplete: "email",
                  }}
                />
              </FieldGroup>
            </form>

            <Button
              type="submit"
              form="form"
              className="h-14 w-full bg-primary text-white"
              onClick={form.handleSubmit(onSubmit)}
            >
              Gửi mã OTP
            </Button>

            <p className="text-center text-sm text-(--text-secondary)">
              <Link
                href="/login"
                className="text-primary font-bold hover:underline"
              >
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>

      <LoadingOverlay show={isSubmitting} message="Đang gửi OTP..." />
    </main>
  );
}
