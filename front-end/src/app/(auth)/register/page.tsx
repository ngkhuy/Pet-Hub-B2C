import Register from "@/app/(auth)/register/_components/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký PetCare",
  description: "Trang đăng ký tài khoản PetCare",
};

export default function RegisterPage() {
  return <Register />;
}
