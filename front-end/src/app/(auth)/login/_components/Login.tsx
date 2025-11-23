"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import {
  MdOutlinePets,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { InputField } from "@/components/ui/custom/input-field";
import Image from "next/image";
import rightBg from "@/assets/images/login-right-background.jpg";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { RoutePath } from "@/lib/utils/route-path";
import { LoginForm, LoginFormType } from "@/lib/schemas/auth";
import { authApi } from "@/lib/api/auth";
import { setSessionTokenCookie } from "@/lib/actions";
import { sessionToken } from "@/lib/api/client";

const navLinks = {
  register: {
    link: RoutePath.register,
    title: "Đăng ký",
  },
  forgotPassword: {
    link: RoutePath.forgotPassword,
    title: "Quên mật khẩu",
  },
  userProfile: {
    link: RoutePath.userProfile,
    title: "Tài khoản",
  },
};

export default function Login() {
  const searchParams = useSearchParams();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const router = useRouter();

  async function onSubmit(data: LoginFormType) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await authApi.login(data);

      // Lưu token vào context và cookie
      await setSessionTokenCookie(sessionToken.value);

      toastSuccess("Đăng nhập thành công!");
      const callbackUrl = searchParams.get("redirect") || RoutePath.home;
      router.replace(callbackUrl);
    } catch (err) {
      toastError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      console.log(err);
    }
  }

  const [showPass, setShowPass] = useState<boolean>(false);

  function handleClickShowPass() {
    setShowPass((value) => !value);
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
                <Image
                  src={rightBg}
                  alt="background right side"
                  fill
                  loading="eager"
                  priority={false}
                  className="object-cover object-center absolute inset-0"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/20 via-primary/10 to-transparent"></div>

                <div className="whitespace-nowrap absolute bottom-12 left-12 right-12 bg-white/30 backdrop-blur-sm p-6 rounded-lg shadow-md">
                  <p className="text-primary text-xl font-semibold text-dark-gray text-center">
                    Nơi tình yêu thương được chăm sóc
                  </p>
                </div>
              </div>
              {/* <!-- Right Panel: Form --> */}
              <div className="flex w-full flex-col items-center justify-center bg-(--background-primary) p-6 sm:p-12">
                <div className="flex w-full max-w-md flex-col gap-8">
                  {/* <!-- Header --> */}
                  <motion.div
                    className="flex w-full flex-col items-center text-center"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {/* Logo + Brand */}
                    <motion.div
                      className="flex items-center gap-3 pb-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
                    >
                      <MdOutlinePets className="text-4xl text-primary " />
                      <p className="text-3xl font-bold text-primary">
                        {siteConfig.brandName}
                      </p>
                    </motion.div>

                    {/* Title */}
                    <motion.p
                      className="text-(--text-primary) text-4xl font-black leading-tight tracking-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.4,
                        ease: "easeOut",
                      }}
                    >
                      Chào mừng quay trở lại
                    </motion.p>

                    {/* Subtitle */}
                    <motion.p
                      className="text-(--text-secondary) mt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.6,
                        ease: "easeOut",
                      }}
                    >
                      Đăng nhập để tiếp tục
                    </motion.p>
                  </motion.div>
                  {/* <!-- Form --> */}

                  <form
                    id="form-login"
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate
                  >
                    {/* Overlay loading */}

                    <FieldGroup className="gap-10">
                      {/* <!-- Phone Number Field --> */}
                      <InputField<LoginFormType>
                        control={form.control}
                        name="email"
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
                    <div className="w-full flex justify-end pt-2">
                      <Link
                        className="text-sm font-medium text-primary hover:text-secondary underline"
                        href={navLinks.forgotPassword.link}
                      >
                        {navLinks.forgotPassword.title}
                      </Link>
                    </div>
                  </form>
                  {/* <!-- Action Buttons --> */}
                  <div>
                    <Button
                      variant={"default"}
                      className="flex relative z-50 items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out font-semibold text-base h-14 w-full rounded-lg bg-primary text-white hover:bg-primary/85 cursor-pointer"
                      type="submit"
                      form="form-login"
                    >
                      Đăng nhập
                    </Button>
                  </div>
                  {/* <!-- Sign Up Link --> */}
                  <p className="text-(--text-secondary) text-center text-sm">
                    Không có tài khoản?
                    <Link
                      className="font-bold text-primary hover:text-secondary hover:underline"
                      href={navLinks.register.link}
                      replace
                    >
                      {navLinks.register.title}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoadingOverlay show={isSubmitting} message="Đang đăng nhập..." />
    </main>
  );
}
