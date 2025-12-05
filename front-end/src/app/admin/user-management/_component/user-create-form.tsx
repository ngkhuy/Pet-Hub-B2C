"use client";

import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { AdminCreateUserFormType } from "@/lib/types/user-management";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminCreateUserFormSchema } from "@/lib/schemas/user-management";
import { authApi } from "@/lib/api/auth";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { InputField } from "@/components/ui/custom/input-field";
import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

export function UserCreateForm() {
  const router = useRouter();
  const form = useForm<AdminCreateUserFormType>({
    resolver: zodResolver(AdminCreateUserFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [showPass, setShowPass] = useState(false);
  const { handleSubmit, formState } = form;

  function handleClickShowPass() {
    setShowPass((value) => !value);
  }

  async function onSubmit(data: AdminCreateUserFormType) {
    try {
      const result = await authApi.register(data);
      toastSuccess("Tạo người dùng thành công!");
      router.refresh();
    } catch (err) {
      toastError("Tạo người dùng thất bại");
      console.error(err);
    }
  }

  return (
    <>
      <ScrollArea className="max-h-[45vh] sm:max-w-[500px] px-10 py-">
        <form
          noValidate
          id="form-create-user"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup className="space-y-2  p-6">
            {/* Username */}
            <InputField<AdminCreateUserFormType>
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

            {/* Password */}
            <InputField<AdminCreateUserFormType>
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
        </form>
      </ScrollArea>
      <LoadingOverlay show={formState.isSubmitting} message="Đang tạo..." />
    </>
  );
}
