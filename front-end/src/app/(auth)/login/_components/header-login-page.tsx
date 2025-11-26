"use client";

import envConfig from "@/config/config";
import { motion } from "motion/react";
import { MdOutlinePets } from "react-icons/md";

export default function HeaderLoginPage() {
  return (
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
          {envConfig.BRAND_NAME}
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
  );
}
