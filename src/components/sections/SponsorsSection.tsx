"use client";

import Image from "next/image";
import { SectionWrapper } from "@/components/common/SectionWrapper";

interface SponsorsSectionProps {
  title?: string;
  subtitle?: string;
}

export function SponsorsSection({
  title = "Our Sponsors",
  subtitle = "Proudly supported by the world's leading sports brands",
}: SponsorsSectionProps) {
  return (
    <SectionWrapper title={title} subtitle={subtitle}>
      <div className="flex justify-center items-center mt-10">
        <a
          href="#"
          className="inline-flex items-center justify-center p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
          aria-label="Aravalli Hills Organics"
          title="Aravalli Hills Organics"
        >
          <div className="relative w-full max-w-sm">
            <Image
              src="/images/sponsor.jpeg"
              alt="Aravalli Hills Organics"
              width={300}
              height={150}
              className="object-cover w-full h-auto filter opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              unoptimized
            />
          </div>
        </a>
      </div>
    </SectionWrapper>
  );
}
