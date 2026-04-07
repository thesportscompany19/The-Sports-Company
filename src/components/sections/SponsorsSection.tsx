"use client";

import { SectionWrapper } from "@/components/common/SectionWrapper";

const SPONSORS = [
  { name: "Nike",         href: "#" },
  { name: "Adidas",       href: "#" },
  { name: "Puma",         href: "#" },
  { name: "Reebok",       href: "#" },
  { name: "Under Armour", href: "#" },
  { name: "New Balance",  href: "#" },
];

interface SponsorsSectionProps {
  title?: string;
  subtitle?: string;
}

export function SponsorsSection({
  title = "Our Sponsors",
  subtitle = "Proudly supported by the world's leading sports brands",
}: SponsorsSectionProps) {
  return (
    // className="bg-[#F4F6F8]"
    <SectionWrapper title={title} subtitle={subtitle}>
      <div className="flex flex-wrap justify-center items-center gap-10 mt-6">
        {SPONSORS.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.href}
            className="text-gray-400 font-semibold text-lg tracking-wide transition-colors hover:text-[#0B1C2D] select-none"
            aria-label={sponsor.name}
          >
            {sponsor.name}
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}
