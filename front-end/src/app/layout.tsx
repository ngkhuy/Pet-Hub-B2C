import "@/styles/globals.css";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { AppProvider } from "@/components/global/app-provider";
import { cookies } from "next/headers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PetCare",
    template: "%s",
  },
  description: "PetCare - Your Trusted Pet Care Partner",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value || "";

  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <AppProvider initSessionToken={sessionToken}>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
