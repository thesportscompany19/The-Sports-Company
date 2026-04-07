"use client";

import { Button } from "@/components/ui/button";
import { useCarousel } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselControlsProps {
  className?: string;
}

export function CarouselControls({ className }: CarouselControlsProps) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  return (
    <div className={cn("contents", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 hover:text-white disabled:opacity-40 cursor-pointer"
      >
        <ChevronLeft className="size-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 hover:text-white disabled:opacity-40 cursor-pointer"
      >
        <ChevronRight className="size-6" />
      </Button>
    </div>
  );
}
