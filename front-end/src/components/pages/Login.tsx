"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { LoginType, loginSchema } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/lib/api/auth";
import { InputField } from "@/components/ui/custom/input-field";
import { PhoneTooltip } from "@/components/ui/custom/phone-tooltip";

const urlImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDkLCuUHYCmkumM0pNO-5JQeJ1oQNpf0YxxuoH4vJapR4eg40DbSc4rFk4T7kVNlGqj6AvKGH1jrjPwtFhz5jizNWdcg2K93jOkwwOFf8rsZfKnGm_-2qi5GUI3nEpX_rUwq9LqEXpa20tAy2w5oSDNWlCGWwP7ngOtox9gP6KmJTCtN5SfNSs_VcfvI5uq01lGCkpSpTQxuO4yMm2m0FrUPyqPMI3CERzsofr-zDLDJjuBMvFJ1LfF6NT4LPciWwergMtwPU9akisU";

const navLinks = {
  register: {
    link: "/register",
    title: "Đăng ký",
  },
  forgotPassword: {
    link: "/forgot-password",
    title: "Quên mật khẩu",
  },
  userProfile: {
    link: "/user/profile",
    title: "Tài khoản",
  },
};

export default function Login() {
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone_number: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: LoginType) {
    try {
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

      // const response = await AuthApi.login(data);

      router.replace(navLinks.userProfile.link);
    } catch (err) {
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
                    <FieldGroup className="gap-10">
                      {/* <!-- Phone Number Field --> */}
                      <InputField<LoginType>
                        control={form.control}
                        name="phone_number"
                        type="tel"
                        label="Số điện thoại"
                        inputProps={{
                          placeholder: "Điền số điện thoại",
                          autoComplete: "tel",
                          inputMode: "text",
                        }}
                        addonEnd={<PhoneTooltip />}
                        id="form-login-phone-number"
                        className="text-(--text-secondary)"
                      />
                      {/* <!-- Password Field --> */}
                      <InputField<LoginType>
                        control={form.control}
                        name="password"
                        type={showPass ? "text" : "password"}
                        label="Mật khẩu"
                        inputProps={{
                          placeholder: "Điền mật khẩu",
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
                      className="flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out font-semibold text-base h-14 w-full rounded-lg bg-primary text-white hover:bg-primary/85 cursor-pointer"
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
    </main>
  );
}
