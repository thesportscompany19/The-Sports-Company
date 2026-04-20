"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { ArrowRight } from "lucide-react";
import { HeroCarousel, type Slide } from "@/components/sections/HeroCarousel";

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  slides?: Slide[];
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

export function Hero({
  title = "Welcome to The Sports Company",
  subtitle = "Your Complete Sports Ecosystem - Connecting Athletes, Coaches, Events & More",
  primaryCta = { label: "Register as Player – ₹99", href: "#register" },
  secondaryCta = { label: "View Sports / Events", href: "#events" },
  slides = defaultSlides,
}: HeroProps) {
  return (
    <section id="home" aria-label="Hero banner" className="relative overflow-hidden bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/banner.png')" }} >
      {/* Top hero */}
      <div className="relative bg-[#042457]/80 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-18 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={primaryCta.href}>
              <PrimaryButton
                size="lg"
                className="px-6 py-5 text-base h-14 font-medium cursor-pointer"
              >
                {primaryCta.label}
                <ArrowRight className="ml-2 size-4" />
              </PrimaryButton>
            </a>
            <a href={secondaryCta.href}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-[#0B1C2D] hover:bg-white/10 hover:text-white px-6 py-5 text-base h-14 font-medium cursor-pointer"
              >
                {secondaryCta.label}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Carousel banner */}
      <div className="bg-[#042457]/80 pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <HeroCarousel slides={slides} />
        </div>
      </div>
    </section>
  );
}
