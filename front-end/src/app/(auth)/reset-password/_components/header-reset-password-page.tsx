"use client";

import envConfig from "@/config/config";
import { motion } from "motion/react";
import { MdOutlinePets } from "react-icons/md";

type Props = {
  email: string;
};

export default function HeaderResetPasswordPage({ email }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <MdOutlinePets className="text-4xl text-primary" />
      <p className="text-3xl font-bold text-primary">{envConfig.BRAND_NAME}</p>
      <p className="text-4xl font-black mt-4 text-(--text-primary)">
        Xác thực OTP
      </p>
      <p className="text-(--text-secondary) mt-2">
        Nhập mã OTP đã gửi tới email
        <span className="font-semibold text-primary"> {email}</span>
      </p>
    </motion.div>
  );
}
