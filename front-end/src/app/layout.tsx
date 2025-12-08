import "@/styles/globals.css";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";

import { ReactNode } from 'react'

import envConfig from "@/config/config";
import SlideSession from "@/components/global/slide-session";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});
const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "";
export const metadata: Metadata = {
  title: {
    default: brandName,
    template: `%s | ${brandName}`,
  },
  description: envConfig.APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <SlideSession />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
