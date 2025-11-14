import "@/styles/globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Login PetCare",
  description: "Login page",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
