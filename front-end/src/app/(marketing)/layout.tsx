import "@/styles/globals.css";
import AppHeader from "@/components/layout/AppHeader";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import AppFooter from "@/components/layout/AppFooter";

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
  description: "PetCate website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased font-display bg-(--background-primary) dark:bg-(--background-secondary)`}
      >
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root">
          <AppHeader />
          <div className="mx-auto w-full max-w-5/6  p-4 md:p-6 lg:p-8 ">
            {children}
          </div>
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
