"use client";

import bgImage from "@/assets/register-background.webp";
import * as z from "zod";
import { toast } from "sonner";
import { MdOutlinePets, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Image from "next/image";

const formSchema = z.object({
  fullName: z
    .string()
    .min(5, "Tên ít nhất 5 ký tự")
    .max(32, "Tên có tối đa 32 ký tự"),
  email: z
    .string()
    .min(5, "Email ít nhất 5 ký tự")
    .max(100, "Email có tối đa 100 ký tự")
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(8, "Mật khẩu ít nhất 8 ký tự")
    .max(50, "Mật khẩu có tối đa 50 ký tự"),
  confirmPassword: z
    .string()
    .min(8, "Mật khẩu ít nhất 8 ký tự")
    .max(50, "Mật khẩu có tối đa 50 ký tự"),
});

const focusInput =
  "has-[[data-slot=input-group-control]:focus-visible]:ring-primary/50";

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPass, setShowPass] = useState<boolean>(false);

  function handleClickShowPass() {
    setShowPass((value) => !value);
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }

  return (
    <div className="relative">
      <Image
        src={bgImage}
        alt="Background"
        fill
        className="object-cover absolute -z-10  blur-xs"
        priority
      />

      <div className="bg-black/15 inset-0 text-(--text-primary) relative flex min-h-screen w-full flex-col items-center justify-center">
        <main className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-xl shadow-2xl lg:grid-cols-2">
          <div className="flex flex-col justify-center bg-(--background-primary) p-2 sm:p-4 lg:p-8">
            <header className="mb-4 flex items-center gap-3">
              <MdOutlinePets className="text-primary text-4xl" />
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark">
                {siteConfig.brandName}
              </h1>
            </header>
            <div className="mb-6">
              <h2 className="text-3xl font-black leading-tight tracking-[-0.03em] text-text-light dark:text-text-dark">
                Tạo tài khoản mới
              </h2>
            </div>
            <form
              id="form-register"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <FieldGroup className="gap-10 mb-12">
                {/* <!-- FullName Field --> */}
                <Controller
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="gap-1 relative"
                    >
                      <FieldLabel
                        htmlFor="form-register-fullName"
                        className="text-(--text-secondary) text-base font-medium leading-normal"
                      >
                        Họ và tên
                      </FieldLabel>
                      <InputGroup
                        className={`${focusInput}  text-(--text-primary) bg-white leading-normal ps-1 py-6`}
                      >
                        <InputGroupInput
                          {...field}
                          placeholder="Điền đủ tên"
                          id="form-register-fullName"
                          aria-invalid={fieldState.invalid}
                          className=""
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="absolute -bottom-7"
                        />
                      )}
                    </Field>
                  )}
                />
                {/* <!-- Email Field --> */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="gap-1 relative"
                    >
                      <FieldLabel
                        htmlFor="form-register-email"
                        className="text-(--text-secondary) text-base font-medium leading-normal"
                      >
                        Địa chỉ Email
                      </FieldLabel>
                      <InputGroup
                        className={`${focusInput}  text-(--text-primary) outline-primary bg-white leading-normal ps-1 py-6`}
                      >
                        <InputGroupInput
                          {...field}
                          placeholder="you@example.com"
                          id="form-register-email"
                          aria-invalid={fieldState.invalid}
                          className=""
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="absolute -bottom-7"
                        />
                      )}
                    </Field>
                  )}
                />
                {/* <!-- Password Field --> */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="gap-1 relative"
                    >
                      <FieldLabel
                        htmlFor="form-register-password"
                        className="text-(--text-secondary) text-base font-medium leading-normal"
                      >
                        Mật khẩu
                      </FieldLabel>
                      <InputGroup
                        className={`${focusInput}  text-(--text-primary) outline-primary bg-white leading-normal ps-1 py-6`}
                      >
                        <InputGroupInput
                          {...field}
                          placeholder="Mật khẩu ít nhất 8 ký tự"
                          id="form-register-password"
                          aria-invalid={fieldState.invalid}
                          type={showPass ? "text" : "password"}
                        />
                        <InputGroupAddon
                          align={"inline-end"}
                          className="cursor-pointer"
                        >
                          {!showPass ? (
                            <MdVisibility onClick={handleClickShowPass} />
                          ) : (
                            <MdVisibilityOff onClick={handleClickShowPass} />
                          )}
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="absolute -bottom-7"
                        />
                      )}
                    </Field>
                  )}
                />
                {/* <!-- Confirm Password Field --> */}
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="gap-1 relative"
                    >
                      <FieldLabel
                        htmlFor="form-register-confirmPassword"
                        className="text-(--text-secondary) text-base font-medium leading-normal"
                      >
                        Xác nhận mật khẩu
                      </FieldLabel>
                      <InputGroup
                        className={`${focusInput}  text-(--text-primary) outline-primary bg-white leading-normal ps-1 py-6`}
                      >
                        <InputGroupInput
                          {...field}
                          placeholder="Mật khẩu ít nhất 8 ký tự"
                          id="form-register-confirmPassword"
                          aria-invalid={fieldState.invalid}
                          type={showPass ? "text" : "password"}
                        />
                        <InputGroupAddon
                          align={"inline-end"}
                          className="cursor-pointer"
                        >
                          {!showPass ? (
                            <MdVisibility onClick={handleClickShowPass} />
                          ) : (
                            <MdVisibilityOff onClick={handleClickShowPass} />
                          )}
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="absolute -bottom-7"
                        />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <button className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white/90 text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors duration-200">
                <span className="truncate">Đăng ký</span>
              </button>
            </form>
            <div className="my-6 flex items-center">
              <hr className="w-full border-gray-300 dark:border-gray-600" />
              <p className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                hoặc
              </p>
              <hr className="w-full border-gray-300 dark:border-gray-600" />
            </div>
            <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-gray-300 bg-white px-4 text-text-light transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-text-dark dark:hover:bg-gray-700">
              <svg
                className="h-5 w-5"
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.48H18.04C17.74 16.03 16.92 17.34 15.65 18.23V21.1H19.5C21.46 19.26 22.56 16.03 22.56 12.25Z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23C15.24 23 17.95 21.92 19.5 20.2L15.65 17.3C14.52 18.01 13.37 18.42 12 18.42C9.21 18.42 6.83 16.61 5.92 14.05H2V16.99C3.74 20.44 7.55 23 12 23Z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.92 14.05C5.71 13.45 5.6 12.79 5.6 12.1C5.6 11.41 5.71 10.75 5.92 10.15V7.21H2C1.22 8.79 0.73 10.54 0.73 12.4C0.73 14.26 1.22 16.01 2 17.59L5.92 14.05Z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.58C13.43 5.58 14.67 6.07 15.6 6.94L18.72 3.82C16.95 2.18 14.67 1 12 1C7.55 1 3.74 3.56 2 7.01L5.92 9.95C6.83 7.39 9.21 5.58 12 5.58Z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span className="truncate text-base font-medium leading-normal">
                Đăng ký bằng Google
              </span>
            </button>
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Đã có tài khoản?
              <Link
                className="font-semibold text-teal hover:underline"
                href="/auth/login"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
          <div className="relative hidden lg:block">
            <Image
              className="absolute inset-0 h-full w-full object-cover"
              data-alt="A happy golden retriever dog smiling at the camera."
              alt="A happy golden retriever dog smiling at the camera."
              width={500}
              height={500}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-w1zN5XWR4KJObkFG5-q7Ij59yoi0yYlmjc7eTRiX7-6rRtHalSfztZ0Yr-IKKyP0isG3vH-vV6f6uURUHyg4tLUG9kvd2yWuk4Vp1SMWyf5xml3fzb8Te2_Rv34QKheNZfhcBTa4QwsvuBozFcRI11KSBc1wx8zA87laiTDug16uOU3CV5XckA7u2V0yFzIfalMa6uY8R0K2uat0PwbNZOUVrKGWqidGhK9oCT8onmaz2oXS146gnBWPn8IFpuq5riao87bbF0Yx"
            />
            <div className="absolute inset-0 bg-primary/20"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
