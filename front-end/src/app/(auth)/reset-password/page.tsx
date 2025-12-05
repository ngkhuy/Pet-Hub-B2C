import HeaderResetPasswordPage from "@/app/(auth)/reset-password/_components/header-reset-password-page";
import ResetPasswordForm from "@/app/(auth)/reset-password/_components/reset-password-form";
import ResendOtpButton from "@/app/(auth)/reset-password/_components/resend-otp-button";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const email = ((await searchParams).email as string | undefined) ?? "";

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6 relative">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* HEADER */}
        <HeaderResetPasswordPage email={email} />

        {/* FORM */}
        <ResetPasswordForm email={email} />
        <div className="text-center flex justify-center items-center text-sm text-(--text-secondary)">
          <span>Không nhận được mã?</span> <ResendOtpButton email={email} />
        </div>
      </div>
    </main>
  );
}
