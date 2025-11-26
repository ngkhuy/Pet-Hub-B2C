import Link from "next/link";
import Image from "next/image";
import rightBg from "@/assets/images/login-right-background.jpg";
import LoginForm from "@/app/(auth)/login/_components/login-form";
import HeaderLoginPage from "@/app/(auth)/login/_components/header-login-page";
import { Metadata } from "next";
import { clientUrl } from "@/lib/data/web-url";

export const metadata: Metadata = {
  title: "Đăng nhập ",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const redirect = (await searchParams).redirect as string | undefined;

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
                  <HeaderLoginPage />
                  {/* <!-- Form --> */}
                  <LoginForm redirectPath={redirect} />

                  {/* <!-- Sign Up Link --> */}
                  <p className="text-(--text-secondary) text-center text-sm">
                    Không có tài khoản?
                    <Link
                      className="font-bold text-primary hover:text-secondary hover:underline"
                      href={clientUrl.register.path}
                      replace
                    >
                      {clientUrl.register.title}
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
