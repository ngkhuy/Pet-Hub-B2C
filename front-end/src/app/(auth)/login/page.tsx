import Login from "@/app/(auth)/login/_components/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập PetCare",
  description: "Trang đăng nhập tài khoản PetCare",
};

export default async function LoginPage() {
  return <Login />;
}
