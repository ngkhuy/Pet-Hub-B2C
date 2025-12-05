"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LuStethoscope, LuShowerHead, LuHotel } from "react-icons/lu";

const cats = [
  { title: "Khám bệnh", icon: LuStethoscope, href: "/services/vet" },
  { title: "Spa & Grooming", icon: LuShowerHead, href: "/services/spa" },
  { title: "Khách sạn thú cưng", icon: LuHotel, href: "/services/hotel" },
];

export function CategoryGrid() {
  return (
    <section className="px-4">
      <h2 className="text-[22px] font-bold text-(--text-primary) tracking-[-0.015em] mb-3">
        Bạn đang tìm gì?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cats.map(({ title, icon: Icon, href }) => (
          <Link key={title} href={href} className="group">
            <Card className="flex flex-col items-center justify-center gap-4 p-8 border-border bg-white dark:bg-(--background-secondary) transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="grid place-items-center size-16 rounded-full bg-secondary/20 text-secondary">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-(--text-primary)">
                {title}
              </h3>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
