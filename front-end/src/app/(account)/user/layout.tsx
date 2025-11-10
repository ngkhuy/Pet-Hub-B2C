import "@/styles/globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import AppHeader from "@/components/layout/AppHeader";
import Sidebar from "./_component/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | PetCare",
    default: "PetCare",
  },
  description: "View and Edit User's settings",
};

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCFKvpRR65IK--05P5ZmX1HXhWFoOwA-itL1Xjz0w_uYrRpjw5K2bB_tyuftQaVq9Md5932WTAxZcpQJlh99K44qEqkw9SNYJHOC_kO1EgbCVc4goB_PItO2cQMJiQhkrQROlfkCCtNTBawdETL0yAwyUKKN_V1skTl9l58U02cirkhot9riuD_lcmXi-cp4DZ9jfYbwJPdDX9zLY5T58fQ3BUPbIvLwDr4aY5k6oZuxOzZvYfzqbnzdA5RSowT44yP4miZea5_bkSo";

export default function SettingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased bg-(--background-primary) dark:bg-(--background-secondary)`}
      >
        <div className=" relative flex h-auto min-h-screen w-full flex-col group/design-root ">
          <AppHeader />

          <div className="flex flex-1 w-full max-w-5/6 mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <Sidebar avatarString={avatar} />
              {children}
              <Toaster />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
