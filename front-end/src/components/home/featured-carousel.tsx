"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    title: "Tắm & Cắt tỉa",
    rating: "5.0 (212)",
    img: "https://images.unsplash.com/photo-1560114927-6ae7c0c544f0?q=80&w=1200",
  },
  {
    title: "Khám tổng quát",
    rating: "4.9 (189)",
    img: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=1200",
  },
  {
    title: "Trông giữ cuối tuần",
    rating: "4.8 (155)",
    img: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1200",
  },
  {
    title: "Tiêm phòng định kỳ",
    rating: "5.0 (301)",
    img: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
  },
  {
    title: "Tiêm phòng định kỳ",
    rating: "5.0 (301)",
    img: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
  },
];

export function FeaturedCarousel() {
  return (
    <section className="px-4">
      <h2 className="text-[22px] font-bold text-(--text-primary) tracking-[-0.015em] mb-3">
        Dịch vụ nổi bật tuần này
      </h2>

      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {items.map((it, i) => (
            <CarouselItem
              key={i}
              className="basis-[80%] sm:basis-[50%] md:basis-[33%] lg:basis-[25%]"
            >
              <Card className="overflow-hidden border-border bg-white dark:bg-(--background-secondary) h-full">
                <div className="relative aspect-3/4 w-full">
                  <Image
                    src={it.img}
                    alt={it.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex flex-col gap-2 p-4">
                  <p className="text-base font-semibold text-(--text-primary)">
                    {it.title}
                  </p>
                  <p className="text-sm text-(--text-secondary)">{it.rating}</p>
                  <Button
                    variant="outline"
                    className="mt-2 border-primary text-primary hover:bg-primary/10"
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
