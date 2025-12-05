"use client";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/custom/input-field";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { FieldGroup } from "@/components/ui/field";
import { authApi } from "@/lib/api/auth";
import { HttpError } from "@/lib/api/client";
import { adminUrl, clientUrl } from "@/lib/data/web-url";
import { LoginFormSchema } from "@/lib/schemas/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { LoginFormType } from "@/lib/types/auth";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

type Props = {
  redirectPath?: string;
};

export default function LoginForm({ redirectPath }: Props) {
  const { setAuthenticated } = useAuthStore.use.actions();
  const router = useRouter();
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [showPass, setShowPass] = useState<boolean>(false);

  function handleClickShowPass() {
    setShowPass((value) => !value);
  }

  async function onSubmit(data: LoginFormType) {
    try {
      const response = await authApi.login(data);
      // Set access token into cookie from Next Server
      const nextServerResponse = await authApi.slideSession(
        response.access_token
      );
      localStorage.clear();
      setAuthenticated(response.access_token, {
        role: nextServerResponse.access_token_payload.role,
        exp: nextServerResponse.access_token_payload.exp,
      });
      const callbackUrl =
        nextServerResponse.access_token_payload.role === "admin"
          ? adminUrl.dashboard.path
          : redirectPath || clientUrl.home.path;
      router.replace(callbackUrl);
      toastSuccess("Đăng nhập thành công!", { position: "top-center" });
    } catch (err) {
      if (err instanceof HttpError) {
        toastError("Đăng nhập thất bại", { description: err.detail });
      } else {
        toastError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
      console.error(err);
    }
  }

  return (
    <div>
      <form
        id="form-login"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="relative"
      >
        <FieldGroup className="gap-9">
          {/* <!-- Phone Number Field --> */}
          <InputField<LoginFormType>
            control={form.control}
            name="username"
            type="email"
            label="Địa chỉ email"
            inputProps={{
              placeholder: "you@exemple.com",
              autoComplete: "email",
              inputMode: "email",
            }}
            id="form-login-phone-number"
            className="text-(--text-secondary)"
          />
          {/* <!-- Password Field --> */}
          <InputField<LoginFormType>
            control={form.control}
            name="password"
            type={showPass ? "text" : "password"}
            label="Mật khẩu"
            inputProps={{
              placeholder: "Nhập mật khẩu",
              autoComplete: "new-password",
              inputMode: "text",
            }}
            addonEnd={
              showPass ? (
                <MdOutlineVisibilityOff
                  className="cursor-pointer "
                  onClick={handleClickShowPass}
                />
              ) : (
                <MdOutlineVisibility
                  className="cursor-pointer "
                  onClick={handleClickShowPass}
                />
              )
            }
            id="form-login-password"
            className="text-(--text-secondary)"
          />
        </FieldGroup>
        <div className="w-full flex justify-end pt-2 absolute z-20">
          <Link
            className="text-sm font-medium text-primary hover:text-secondary underline"
            href={clientUrl.forgot_password.path}
          >
            {clientUrl.forgot_password.title}
          </Link>
        </div>
        <div className="mt-12">
          <Button
            variant={"default"}
            className="flex relative z-50 items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out font-semibold text-base h-14 w-full rounded-lg bg-primary text-white hover:bg-primary/85 cursor-pointer"
            type="submit"
            form="form-login"
          >
            Đăng nhập
          </Button>
        </div>
      </form>

      <LoadingOverlay
        show={form.formState.isSubmitting}
        message="Đang đăng nhập..."
      />
    </div>
  );
}
