import "@/styles/globals.css";
import AppHeader from "@/components/layout/AppHeader";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

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
  description: "Login page",
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
        <div
          className="
    relative grid min-h-screen w-full
    grid-rows-[auto_auto_1fr]   /* Header - Nav - Content */
    group/design-root
  "
        >
          <AppHeader />

          <main className="h-full w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
