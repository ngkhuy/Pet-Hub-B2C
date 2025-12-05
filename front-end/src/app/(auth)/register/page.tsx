import { Metadata } from "next";
import Image from "next/image";
import bgImage from "@/assets/images/register-background.webp";
import { MdOutlinePets } from "react-icons/md";
import envConfig from "@/config/config";
import HeaderRegisterPage from "@/app/(auth)/register/_components/header-register-page";
import Link from "next/link";
import { clientUrl } from "@/lib/data/web-url";
import RegisterForm from "@/app/(auth)/register/_components/register-form";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Trang đăng ký tài khoản PetCare",
};

export default function RegisterPage() {
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
                {envConfig.BRAND_NAME}
              </h1>
            </header>
            <div className="mb-6">
              <HeaderRegisterPage />
            </div>
            {/* <!-- Register Form --> */}
            <RegisterForm />
            {/* <!--  Login Navigation --> */}
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Đã có tài khoản?
              <Link
                className="font-bold text-primary hover:text-secondary hover:underline"
                href={clientUrl.login.path}
                replace
              >
                {clientUrl.login.title}
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
              loading="lazy"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-w1zN5XWR4KJObkFG5-q7Ij59yoi0yYlmjc7eTRiX7-6rRtHalSfztZ0Yr-IKKyP0isG3vH-vV6f6uURUHyg4tLUG9kvd2yWuk4Vp1SMWyf5xml3fzb8Te2_Rv34QKheNZfhcBTa4QwsvuBozFcRI11KSBc1wx8zA87laiTDug16uOU3CV5XckA7u2V0yFzIfalMa6uY8R0K2uat0PwbNZOUVrKGWqidGhK9oCT8onmaz2oXS146gnBWPn8IFpuq5riao87bbF0Yx"
            />
            <div className="absolute inset-0 bg-primary/20"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
