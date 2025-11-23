"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialogSubmit } from "@/components/ui/custom/confirm-dialog-submit";
import { InputField } from "@/components/ui/custom/input-field";
import { FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { ChangePasswordForm, ChangePasswordFormType } from "@/lib/schemas/auth";

export default function ChangePasswordPage() {
  const [showNewPass, setShowNewPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(ChangePasswordForm),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  function handleClearFormContent() {
    form.setValue("confirm_new_password", "");
    form.setValue("new_password", "");
    form.setValue("old_password", "");
  }

  function handleShowNewPass() {
    setShowNewPass((v) => !v);
  }

  return (
    <section
      id="change-password"
      className="scroll-mt-24 bg-white dark:bg-(--background-secondary) p-6 lg:p-8 rounded-xl shadow-sm dark:border-gray-700"
    >
      <div className="flex flex-col gap-6">
        <header>
          <h2 className="text-(--text-primary) dark:text-white text-2xl font-bold leading-tight tracking-[-0.03em]">
            Đổi mật khẩu
          </h2>
          <p className="text-(--text-secondary) dark:text-gray-400 text-base font-normal leading-normal pt-2">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người
            khác.
          </p>
        </header>
        <Separator />

        <form id="form-change-pass" noValidate className="relative rounded-xl">
          <LoadingOverlay
            show={isSubmitting}
            message="Đang cập nhật mật khẩu mới..."
          />

          <FieldSet disabled={isSubmitting} aria-busy={isSubmitting}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
              {/* <!--Old Password Field --> */}
              <div className="md:col-span-2">
                <InputField<ChangePasswordFormType>
                  control={form.control}
                  name="old_password"
                  type={"password"}
                  label="Mật khẩu hiện tại"
                  inputProps={{
                    placeholder: "Nhập mật khẩu hiện tại",
                  }}
                  id="form-change-pass-old-pass"
                  className="text-(--text-secondary) "
                />
              </div>
              {/* <!-- New Password Field --> */}
              <div>
                <InputField<ChangePasswordFormType>
                  control={form.control}
                  name="new_password"
                  type={showNewPass ? "text" : "password"}
                  label="Mật khẩu mới"
                  inputProps={{
                    placeholder: "Nhập mật khẩu mới",
                  }}
                  addonEnd={
                    showNewPass ? (
                      <MdOutlineVisibilityOff
                        className="cursor-pointer "
                        onClick={handleShowNewPass}
                      />
                    ) : (
                      <MdOutlineVisibility
                        className="cursor-pointer "
                        onClick={handleShowNewPass}
                      />
                    )
                  }
                  id="form-register-password"
                  className="text-(--text-secondary)"
                />
              </div>
              {/* <!-- Confirm New Password Field --> */}
              <div>
                <InputField<ChangePasswordFormType>
                  control={form.control}
                  name="confirm_new_password"
                  type={showNewPass ? "text" : "password"}
                  label="Xác nhận mật khẩu mới"
                  inputProps={{
                    placeholder: "Nhập lại mật khẩu mới",
                  }}
                  addonEnd={
                    showNewPass ? (
                      <MdOutlineVisibilityOff
                        className="cursor-pointer "
                        onClick={handleShowNewPass}
                      />
                    ) : (
                      <MdOutlineVisibility
                        className="cursor-pointer "
                        onClick={handleShowNewPass}
                      />
                    )
                  }
                  id="form-register-password"
                  className="text-(--text-secondary)"
                />
              </div>
            </div>
            <ConfirmDialogSubmit
              form={form}
              title="Xác nhận đổi mật khẩu"
              description="Bạn có chắc chắn muốn lưu thay đổi này không?"
              onBusyChange={setIsSubmitting}
              onConfirm={async (values) => {
                await new Promise((r) => setTimeout(r, 1000));
                handleClearFormContent();
                toast("You submitted the following values:", {
                  description: (
                    <pre className="bg-code text-black mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                      <code>{JSON.stringify(values, null, 2)}</code>
                    </pre>
                  ),
                  position: "top-center",
                  duration: 1000,
                });
              }}
              renderTrigger={({ onClick, disabled }) => (
                <Button
                  type="button"
                  onClick={onClick}
                  disabled={disabled}
                  className="w-full h-14 bg-primary mt-10 text-white"
                >
                  Lưu thay đổi
                </Button>
              )}
            />
          </FieldSet>
        </form>
      </div>
    </section>
  );
}
