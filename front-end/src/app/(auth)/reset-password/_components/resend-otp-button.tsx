"use client";

import { userManagementApi } from "@/lib/api/user-management";
import { toastPromise } from "@/lib/utils/toast";
import clsx from "clsx";
import { useState } from "react";

type Props = {
  email: string;
};

export default function ResendOtpButton({ email }: Props) {
  const [isResending, setIsResending] = useState(false);
  async function handleResendOtp() {
    setIsResending(true);
    await toastPromise(userManagementApi.sendOtpToResetPassword(email), {
      error: "Gửi lại OTP thất bại. Vui lòng thử lại.",
      loading: "Đang gửi lại OTP...",
      success: "Gửi lại OTP thành công!",
    });
    setIsResending(false);
  }

  return (
    <div>
      <button
        disabled={isResending}
        onClick={handleResendOtp}
        className={clsx(
          "text-primary font-bold  ",
          !isResending && "cursor-pointer hover:text-secondary hover:underline",
          isResending && "cursor-not-allowed opacity-50"
        )}
      >
        Gửi lại OTP
      </button>
    </div>
  );
}
