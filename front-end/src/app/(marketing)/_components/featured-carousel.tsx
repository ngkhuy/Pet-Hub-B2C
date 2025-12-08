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
import { mockItems } from "@/app/(marketing)/_common/mock";
import Link from "next/link";

export function FeaturedCarousel() {
  return (
    <section className="px-4">
      <h2 className="text-[22px] font-bold text-(--text-primary) tracking-[-0.015em] mb-3">
        Dịch vụ nổi bật tuần này
      </h2>

      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {mockItems.map((it, i) => (
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
                    <Link href={it.path} className=" w-full">
                      Xem chi tiết
                    </Link>
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
