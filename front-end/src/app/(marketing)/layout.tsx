import AppHeader from "@/components/layout/header/AppHeader";
import type { Metadata } from "next";
import AppFooter from "@/components/layout/footer/AppFooter";

export const metadata: Metadata = {
  title: "PetCare",
  description: "Connecting Pets with Caregivers Seamlessly",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" font-display bg-(--background-primary) dark:bg-(--background-secondary)">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root">
        <AppHeader />
        <div className="mx-auto w-full max-w-5/6  p-4 md:p-6 lg:p-8 ">
          {children}
        </div>
        <AppFooter />
      </div>
    </div>
  );
}
