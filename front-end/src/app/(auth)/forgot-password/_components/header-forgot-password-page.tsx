"use client";

import envConfig from "@/config/config";
import { motion } from "motion/react";
import { MdOutlinePets } from "react-icons/md";
export default function HeaderForgorPasswordPage() {
  return (
    <motion.div
      className="flex w-full flex-col items-center text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 pb-4">
        <MdOutlinePets className="text-4xl text-primary" />
        <p className="text-3xl font-bold text-primary">
          {envConfig.BRAND_NAME}
        </p>
      </div>

      <p className="text-4xl font-black text-(--text-primary)">Quên mật khẩu</p>
      <p className="text-(--text-secondary) mt-2">Nhập email để nhận mã OTP</p>
    </motion.div>
  );
}
