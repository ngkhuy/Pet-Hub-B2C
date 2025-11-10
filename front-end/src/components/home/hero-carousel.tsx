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
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

const slides = [
  {
    title: "Tìm dịch vụ chăm sóc tốt nhất",
    desc: "Khách sạn, spa, phòng khám thú y gần bạn.",
    img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1600",
  },
  {
    title: "Đặt lịch thú y trong 1 phút",
    desc: "Chọn giờ phù hợp, bác sĩ uy tín.",
    img: "https://images.unsplash.com/photo-1558944351-c7e60f0e8f54?q=80&w=1600",
  },
  {
    title: "Khách sạn thú cưng an toàn",
    desc: "Theo dõi tình trạng, camera 24/7.",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600",
  },
];

export function HeroCarousel() {
  const plugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    })
  );

  return (
    <section className="@container px-4">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          loop: true,
        }}
        className="mt-4 w-full"
      >
        <CarouselContent>
          {slides.map((s, i) => (
            <CarouselItem key={i}>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 @[600px]:p-10">
                  <h1 className="text-white text-3xl @[600px]:text-4xl font-black tracking-[-0.03em]">
                    {s.title}
                  </h1>
                  <p className="mt-2 text-white/90 @[600px]:text-lg">
                    {s.desc}
                  </p>
                  <div className="mt-4">
                    <Button className="bg-primary text-white hover:bg-primary/90">
                      Khám phá ngay
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controls */}
        <CarouselPrevious className="left-4 bg-black/50 text-white hover:bg-black/70" />
        <CarouselNext className="right-4 bg-black/50 text-white hover:bg-black/70" />
      </Carousel>
    </section>
  );
}
