"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CarouselControls } from "@/components/common/CarouselControls";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  className?: string;
  /** Auto-play interval in ms. Set 0 to disable. Default 5000. */
  autoplayDelay?: number;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    title: "Special Offer: Player Registration at ₹99",
    subtitle: "Limited time offer – Get your unique Player ID",
    image: "/images/sports-banner.png",
    ctaLabel: "Register Now",
    ctaHref: "#register",
  },
  {
    id: 2,
    title: "Join Sports Events Near You",
    subtitle: "Compete, Connect & Grow",
    image: "/images/sports-banner.png",
    ctaLabel: "View Events",
    ctaHref: "#events",
  },
  {
    id: 3,
    title: "Find Coaches & Training Programs",
    subtitle: "Upgrade your performance",
    image: "/images/sports-banner.png",
    ctaLabel: "Explore",
    ctaHref: "#coaches",
  },
];

export function HeroCarousel({
  slides = defaultSlides,
  className,
  autoplayDelay = 5000,
}: HeroCarouselProps) {
  const plugins =
    autoplayDelay > 0
      ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })]
      : [];

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={plugins}
      className={cn("relative w-full rounded-2xl overflow-hidden", className)}
    >
      <CarouselContent className="-ml-0">
        {slides.map((slide) => (
          <CarouselItem key={slide.id} className="pl-0">
            <div className="relative h-[400px] md:h-[500px] w-full">
              {/* Background image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={slide.id === 1}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2D]/90 to-transparent" />

              {/* Content — bottom-left */}
              <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 max-w-xl">
                <h2 className="text-2xl font-bold text-white md:text-4xl">
                  {slide.title}
                </h2>
                <p className="mt-2 text-sm text-gray-300 sm:text-base">
                  {slide.subtitle}
                </p>
                {slide.ctaLabel && (
                  <a href={slide.ctaHref ?? "#"}>
                    <PrimaryButton
                      size="lg"
                      className="mt-4 rounded-lg px-6 py-3 h-[56px] text-sm font-medium cursor-pointer"
                    >
                      {slide.ctaLabel}
                      <ArrowRight className="ml-2 size-4" />
                    </PrimaryButton>
                  </a>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrow controls */}
      <CarouselControls />
    </Carousel>
  );
}
