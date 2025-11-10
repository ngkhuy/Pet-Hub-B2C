import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-14 md:gap-16 mt-6">
      <HeroCarousel />
      <FeaturedCarousel />
      <CategoryGrid />
      <Separator className="mt-2" />
    </main>
  );
}
