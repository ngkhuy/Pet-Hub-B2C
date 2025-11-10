"use client";

import bgImage from "@/assets/images/register-background.webp";
import { toast } from "sonner";
import {
  MdOutlinePets,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldGroup } from "@/components/ui/field";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { RegisterInputType, registerInputSchema } from "@/lib/schemas/auth";
import { Button } from "../ui/button";
import { applyApiErrorsToForm } from "@/lib/forms/applyApiErrorsToForm";
import { ApiError } from "@/lib/http/errors";
import { InputField } from "@/components/ui/custom/input-field";
import { PhoneTooltip } from "@/components/ui/custom/phone-tooltip";

const navLinks = {
  login: {
    link: "/login",
    title: "Đăng nhập ngay",
  },
};

export default function Register() {
  const form = useForm<RegisterInputType>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      phone_number: "",
      password: "",
      confirm_password: "",
    },
  });

  const [showPass, setShowPass] = useState<boolean>(false);

  function handleClickShowPass() {
    setShowPass((value) => !value);
  }

  async function onSubmit(data: RegisterInputType) {
    try {
      // const res = await AuthApi.signup(data);

      toast.success("Sign-up successfully", {
        position: "top-center",
        className: "text-primary",
      });
      // toast("You submitted the following values:", {
      //   description: (
      //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
      //       <code>{JSON.stringify(registerschema.parse(data), null, 2)}</code>
      //     </pre>
      //   ),
      //   position: "bottom-right",
      //   classNames: {
      //     content: "flex flex-col gap-2",
      //   },
      //   style: {
      //     "--border-radius": "calc(var(--radius)  + 4px)",
      //   } as React.CSSProperties,
      // });
    } catch (err) {
      applyApiErrorsToForm(err, form);
    }
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
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-primary dark:text-text-dark">
                {siteConfig.brandName}
              </h1>
            </header>
            <div className="mb-6">
              <div>
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={"title"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.75, ease: "easeInOut" }}
                    className="text-3xl font-black leading-tight tracking-[-0.03em] text-primary dark:text-(--text-secondary) mb-3"
                  >
                    Tạo tài khoản
                  </motion.h2>
                  <motion.p
                    key={"description"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                      delay: 0.25,
                    }}
                    className="font-semibold text-(--text-primary)/60 text-lg inline-block"
                  >
                    Cùng chúng tôi chăm sóc những người bạn bốn chân của bạn một
                    cách tốt nhất.
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            {/* <!-- Register Form --> */}
            <form
              id="form-register"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <FieldGroup className="gap-8 mb-14">
                {/* <!-- Phone Number Field --> */}
                <InputField<RegisterInputType>
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
                  id="form-register-phone-number"
                  className="text-(--text-secondary)"
                />
                {/* <!-- Password Field --> */}
                <InputField<RegisterInputType>
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
                <InputField<RegisterInputType>
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
            {/* <!--  Login Navigation --> */}
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Đã có tài khoản?
              <Link
                className="font-bold text-primary hover:text-secondary hover:underline"
                href={navLinks.login.link}
                replace
              >
                {navLinks.login.title}
              </Link>
            </p>
          </div>
          {/* <!-- Right Side --> */}
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
