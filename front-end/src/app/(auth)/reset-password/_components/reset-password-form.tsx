"use client";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/custom/input-field";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { FieldGroup } from "@/components/ui/field";
import { HttpError } from "@/lib/api/client";
import { userManagementApi } from "@/lib/api/user-management";
import { clientUrl } from "@/lib/data/web-url";
import { ResetPasswordBodySchema } from "@/lib/schemas/user-management";
import { ResetPasswordBodyType } from "@/lib/types/user-management";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

type Props = {
  email: string;
};

export default function ResetPasswordForm({ email }: Props) {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBodySchema),
    defaultValues: {
      otp: "",
      email,
      new_password: "",
    },
  });

  async function onSubmit(data: ResetPasswordBodyType) {
    try {
      const result = await userManagementApi.resetPassword(data);
      toastSuccess("Đổi mật khẩu thành công!");
      router.replace(clientUrl.login.path);
    } catch (error) {
      const err = error as HttpError;
      toastError("Đổi mật khẩu thất bại.", { description: err.detail });
      console.error("Failed to reset password:", err);
    }
  }

  return (
    <div>
      {" "}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        id="form-verify-reset-pass"
      >
        <FieldGroup className="gap-9">
          {/* OTP */}
          <InputField<ResetPasswordBodyType>
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
          <InputField<ResetPasswordBodyType>
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
      <LoadingOverlay
        show={form.formState.isSubmitting}
        message="Đang xử lý..."
      />
    </div>
  );
}
