"use client";

import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "../../../../components/ui/button";
import { InputField } from "@/components/ui/custom/input-field";

import { toastError, toastSuccess } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import { RegisterBodySchema, RegisterFormSchema } from "@/lib/schemas/auth";
import { authApi } from "@/lib/api/auth";
import { HttpError } from "@/lib/api/client";
import { RegisterFormType } from "@/lib/types/auth";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";

export default function RegisterForm() {
  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });
  const router = useRouter();
  const [showPass, setShowPass] = useState<boolean>(false);

  function handleClickShowPass() {
    setShowPass((value) => !value);
  }

  async function onSubmit(data: RegisterFormType) {
    try {
      const body = await RegisterBodySchema.safeParseAsync(data);
      if (!body.success) {
        toastError("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
        return;
      }
      const registerResult = await authApi.register(body.data);
      console.log("Register result:", registerResult);
      toastSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      router.push("/login");
    } catch (err) {
      if (err instanceof HttpError) {
        toastError(`Đăng ký thất bại: ${err.detail}`);
      } else {
        toastError("Đăng ký thất bại. Vui lòng thử lại.");
      }

      console.error("Register error:", err);
    }
  }

  return (
    <div>
      <form
        id="form-register"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup className="gap-8 mb-14">
          {/* <!-- Phone Number Field --> */}
          <InputField<RegisterFormType>
            control={form.control}
            name="email"
            type="email"
            label="Đia chỉ email"
            inputProps={{
              placeholder: "you@example.com",
              autoComplete: "email",
              inputMode: "email",
            }}
            id="form-register-phone-number"
            className="text-(--text-secondary)"
          />
          {/* <!-- Password Field --> */}
          <InputField<RegisterFormType>
            control={form.control}
            name="password"
            type={showPass ? "text" : "password"}
            label="Mật khẩu"
            inputProps={{
              placeholder: "Điền mật khẩu",
              autoComplete: "new-password",
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
            id="form-register-password"
            className="text-(--text-secondary)"
          />
          {/* <!-- Confirm Password Field --> */}
          <InputField<RegisterFormType>
            control={form.control}
            name="confirm_password"
            type={showPass ? "text" : "password"}
            label="Xác nhận mật khẩu"
            inputProps={{
              placeholder: "Điền mật khẩu",
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
            id="form-register-password"
            className="text-(--text-secondary)"
          />
        </FieldGroup>

        <Button
          variant={"default"}
          className="flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out font-semibold text-base h-14 w-full rounded-lg bg-primary text-white hover:bg-primary/85 cursor-pointer"
        >
          Đăng ký
        </Button>
      </form>
      <LoadingOverlay
        show={form.formState.isSubmitting}
        message="Đang thực hiện đăng ký..."
      />
    </div>
  );
}
