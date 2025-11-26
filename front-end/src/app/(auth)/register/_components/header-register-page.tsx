"use client";

import { AnimatePresence, motion } from "motion/react";

export default function HeaderRegisterPage() {
  return (
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
          Cùng chúng tôi chăm sóc những người bạn bốn chân của bạn một cách tốt
          nhất.
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
