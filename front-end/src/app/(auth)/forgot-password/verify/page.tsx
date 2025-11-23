"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import { InputField } from "@/components/ui/custom/input-field";
import { Button } from "@/components/ui/button";
import {
  MdOutlinePets,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { motion } from "motion/react";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { toastSuccess } from "@/lib/utils/toast";
import { siteConfig } from "@/config/site";
import {
  VerifyResetPassRequest,
  verifyResetPassRequestSchema,
} from "@/lib/schemas/user";
import { useState } from "react";

export default function VerifyOTP() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [showPass, setShowPass] = useState(false);

  const form = useForm<VerifyResetPassRequest>({
    resolver: zodResolver(verifyResetPassRequestSchema),
    defaultValues: {
      otp: "",
      email: email,
      new_password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: VerifyResetPassRequest) {
    await new Promise((r) => setTimeout(r, 1500)); // giả lập
    toastSuccess("Đổi mật khẩu thành công!");
    router.replace("/");
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* HEADER */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MdOutlinePets className="text-4xl text-primary" />
          <p className="text-3xl font-bold text-primary">
            {siteConfig.brandName}
          </p>
          <p className="text-4xl font-black mt-4 text-(--text-primary)">
            Xác thực OTP
          </p>
          <p className="text-(--text-secondary) mt-2">
            Nhập mã OTP đã gửi tới email
            <span className="font-semibold text-primary"> {email}</span>
          </p>
        </motion.div>

        {/* FORM */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          id="form-verify-reset-pass"
        >
          <FieldGroup className="gap-10">
            {/* OTP */}
            <InputField<VerifyResetPassRequest>
              id="orm-verify-reset-pass-otp"
              control={form.control}
              name="otp"
              label="Mã OTP"
              inputProps={{
                placeholder: "Nhập OTP",
                inputMode: "numeric",
              }}
            />

            {/* NEW PASSWORD */}
            <InputField<VerifyResetPassRequest>
              id="orm-verify-reset-pass-new-pass"
              control={form.control}
              name="new_password"
              type={showPass ? "text" : "password"}
              label="Mật khẩu mới"
              inputProps={{
                placeholder: "Nhập mật khẩu mới",
                autoComplete: "new-password",
              }}
              addonEnd={
                showPass ? (
                  <MdOutlineVisibilityOff
                    className="cursor-pointer"
                    onClick={() => setShowPass((v) => !v)}
                  />
                ) : (
                  <MdOutlineVisibility
                    className="cursor-pointer"
                    onClick={() => setShowPass((v) => !v)}
                  />
                )
              }
            />
          </FieldGroup>

          <Button
            type="submit"
            className="h-14 w-full bg-primary text-white mt-12"
          >
            Đổi mật khẩu
          </Button>
        </form>

        <p className="text-center text-sm text-(--text-secondary)">
          Không nhận được mã?{" "}
          <span className="text-primary font-bold cursor-pointer hover:underline">
            Gửi lại OTP
          </span>
        </p>
      </div>

      <LoadingOverlay show={isSubmitting} message="Đang xử lý..." />
    </main>
  );
}
