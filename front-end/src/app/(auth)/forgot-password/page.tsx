import Link from "next/link";
import Image from "next/image";
import rightBg from "@/assets/images/login-right-background.jpg";
import HeaderForgorPasswordPage from "@/app/(auth)/forgot-password/_components/header-forgot-password-page";
import ForgotPasswordForm from "@/app/(auth)/forgot-password/_components/forgot-password-form";
import { clientUrl } from "@/lib/data/web-url";

export default function ForgotPassword() {
  return (
    <main className="relative flex min-h-screen w-full flex-col">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left UI */}
        <div className="relative hidden lg:flex items-center justify-center bg-primary">
          <Image src={rightBg} alt="" fill className="object-cover inset-0" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/20 via-primary/10 to-transparent"></div>
        </div>

        {/* Right UI */}
        <div className="flex w-full flex-col items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md flex flex-col gap-6">
            <HeaderForgorPasswordPage />
            <ForgotPasswordForm />
            <p className="text-center text-sm text-(--text-secondary)">
              <Link
                href={clientUrl.login.path}
                className="text-primary font-bold hover:underline"
              >
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
