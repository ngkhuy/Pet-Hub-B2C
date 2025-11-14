"use client";

import { useState } from "react";
import * as z from "zod";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  MdOutlinePets,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z
    .string()
    .min(5, "Email ít nhất 5 ký tự")
    .max(100, "Email có tối đa 100 ký tự")
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(8, "Mật khẩu ít nhất 8 ký tự")
    .max(50, "Mật khẩu có tối đa 50 ký tự"),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const urlImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDkLCuUHYCmkumM0pNO-5JQeJ1oQNpf0YxxuoH4vJapR4eg40DbSc4rFk4T7kVNlGqj6AvKGH1jrjPwtFhz5jizNWdcg2K93jOkwwOFf8rsZfKnGm_-2qi5GUI3nEpX_rUwq9LqEXpa20tAy2w5oSDNWlCGWwP7ngOtox9gP6KmJTCtN5SfNSs_VcfvI5uq01lGCkpSpTQxuO4yMm2m0FrUPyqPMI3CERzsofr-zDLDJjuBMvFJ1LfF6NT4LPciWwergMtwPU9akisU";

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
    <main
      className={`relative flex h-auto min-h-screen w-full flex-col bg-(--background-primary)  overflow-x-hidden`}
    >
      <div className="contain-layout flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full flex-1">
            <div className="grid lg:grid-cols-2 min-h-screen">
              {/* <!-- Left Panel: Image --> */}
              <div className="relative hidden lg:flex flex-col items-center justify-center bg-primary">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${urlImage}")`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-linear-to-t from-primary/70 via-primary/40 to-transparent"></div>
                <div className="relative z-10 p-12 text-white text-center">
                  {/* <!-- Logo could go here if desired --> */}
                </div>
              </div>
              {/* <!-- Right Panel: Form --> */}
              <div className="flex w-full flex-col items-center justify-center bg-(--background-primary) p-6 sm:p-12">
                <div className="flex w-full max-w-md flex-col gap-8">
                  {/* <!-- Header --> */}
                  <div className="flex w-full flex-col items-center text-center">
                    <div className="flex items-center gap-3 pb-4">
                      <MdOutlinePets className="text-4xl text-primary" />
                      <p className="text-2xl font-bold text-primary">
                        {siteConfig.brandName}
                      </p>
                    </div>
                    <p className="text-(--text-primary) text-4xl font-black leading-tight tracking-tight">
                      Chào mừng quay trở lại
                    </p>
                    <p className="text-(--text-secondary) mt-2">
                      Đăng nhập để tiếp tục
                    </p>
                  </div>
                  {/* <!-- Form --> */}
                  <form
                    id="form-login"
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate
                  >
                    <FieldGroup className="gap-10">
                      {/* <!-- Email Field --> */}
                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field
                            data-invalid={fieldState.invalid}
                            className="relative gap-1"
                          >
                            <FieldLabel
                              htmlFor="form-login-email"
                              className="text-(--text-secondary) text-base font-medium leading-normal"
                            >
                              Địa chỉ Email
                            </FieldLabel>
                            <InputGroup className="text-(--text-primary) bg-white leading-normal ps-1 py-6  ">
                              <InputGroupInput
                                {...field}
                                placeholder="you@example.com"
                                id="form-login-email"
                                type="email"
                                aria-invalid={fieldState.invalid}
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
                            className="relative gap-1"
                          >
                            <FieldLabel
                              htmlFor="form-login-password"
                              className="text-(--text-secondary) text-base font-medium leading-normal"
                            >
                              Mật khẩu
                            </FieldLabel>
                            <InputGroup className="text-(--text-primary) bg-white leading-normal ps-1 py-6">
                              <InputGroupInput
                                {...field}
                                placeholder="Điền mật khẩu"
                                id="form-login-password"
                                type={showPass ? "text" : "password"}
                                aria-invalid={fieldState.invalid}
                              />
                              <InputGroupAddon
                                align={"inline-end"}
                                className="text-2xl "
                              >
                                {showPass ? (
                                  <MdOutlineVisibilityOff
                                    className="cursor-pointer "
                                    onClick={handleClickShowPass}
                                  />
                                ) : (
                                  <MdOutlineVisibility
                                    className="cursor-pointer "
                                    onClick={handleClickShowPass}
                                  />
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
                    <div className="w-full flex justify-end pt-2">
                      <Link
                        className="text-sm font-medium text-primary hover:text-secondary underline"
                        href="#"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                  </form>
                  {/* <!-- Action Buttons --> */}
                  <div className="flex flex-col gap-4">
                    <Button
                      variant={"default"}
                      className="flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out font-semibold text-base h-14 w-full rounded-lg bg-primary text-white hover:bg-primary/85 cursor-pointer"
                      type="submit"
                      form="form-login"
                    >
                      Đăng nhập
                    </Button>
                    <div className="flex items-center gap-4">
                      <hr className="w-full border-gray-300" />
                      <span className="text-(--text-secondary) text-sm whitespace-nowrap">
                        Sử dụng phương thức khác
                      </span>
                      <hr className="w-full border-gray-300" />
                    </div>
                    <Button
                      className="cursor-pointer flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out font-semibold text-base h-14 w-full rounded-lg bg-white text-(--text-primary) border-gray-300 hover:bg-gray-100"
                      type="button"
                    >
                      <svg
                        className="mr-2"
                        fill="none"
                        height="20"
                        viewBox="0 0 24 24"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12.27V14.2H18.2C17.93 15.65 17.14 16.89 15.98 17.72V20.25H19.52C21.46 18.44 22.56 15.63 22.56 12.25Z"
                          fill="#4285F4"
                        ></path>
                        <path
                          d="M12.27 23C15.11 23 17.51 22.14 19.52 20.25L15.98 17.72C15.01 18.36 13.76 18.75 12.27 18.75C9.65 18.75 7.42 17.02 6.57 14.71H2.94V17.24C4.94 20.59 8.32 23 12.27 23Z"
                          fill="#34A853"
                        ></path>
                        <path
                          d="M6.57 14.71C6.37 14.13 6.26 13.52 6.26 12.9C6.26 12.28 6.37 11.67 6.57 11.09V8.56H2.94C2.1 10.02 1.67 11.41 1.67 12.9C1.67 14.39 2.1 15.78 2.94 17.24L6.57 14.71Z"
                          fill="#FBBC05"
                        ></path>
                        <path
                          d="M12.27 7.05C13.84 7.05 15.22 7.57 16.31 8.59L19.59 5.31C17.51 3.44 15.11 2.5 12.27 2.5C8.32 2.5 4.94 4.91 2.94 8.56L6.57 11.09C7.42 8.78 9.65 7.05 12.27 7.05Z"
                          fill="#EA4335"
                        ></path>
                      </svg>
                      Đăng nhập với Google
                    </Button>
                  </div>
                  {/* <!-- Sign Up Link --> */}
                  <p className="text-(--text-secondary) text-center text-sm">
                    Không có tài khoản?
                    <Link
                      className="font-bold text-primary hover:text-secondary hover:underline"
                      href="/auth/register"
                    >
                      Đăng ký
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
