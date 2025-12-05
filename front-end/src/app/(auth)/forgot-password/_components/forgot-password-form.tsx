"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastSuccess } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { FieldGroup } from "@/components/ui/field";
import { InputField } from "@/components/ui/custom/input-field";
import { Button } from "@/components/ui/button";
import { clientUrl } from "@/lib/data/web-url";
import { emailField } from "@/lib/schemas/common";

const ForgotPasswordFormSchema = z.object({
  email: emailField(),
});
type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordFormType) {
    await new Promise((r) => setTimeout(r, 2000));
    toastSuccess("OTP đã được gửi tới email!");
    router.push(`${clientUrl.reset_password.path}?email=${data.email}`);
  }

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="relative"
        id="form-forgot-password"
      >
        <FieldGroup className="gap-10">
          <InputField<ForgotPasswordFormType>
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
      <div className="mt-9">
        <Button
          type="submit"
          form="form"
          className="h-14 w-full bg-primary text-white"
          onClick={form.handleSubmit(onSubmit)}
        >
          Gửi mã OTP
        </Button>
      </div>
      <LoadingOverlay
        show={form.formState.isSubmitting}
        message="Đang gửi OTP..."
      />
    </div>
  );
}
