import Register from "@/components/pages/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register page",
};

export default function RegisterPage() {
  return <Register />;
}
