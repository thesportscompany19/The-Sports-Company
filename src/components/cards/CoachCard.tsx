"use client";

import Image from "next/image";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Badge } from "@/components/ui/badge";
import { Images, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CoachCardProps {
  image: string;
  name: string;
  sport: string;
  academy: string;
  location: string;
  specialization: string;
  experience: string;
  fee: string;
  galleryImages?: string[];
  discountLabel?: string;
  onContact?: () => void;
  onGalleryOpen?: () => void;
  className?: string;
}

export function CoachCard({
  image,
  name,
  sport,
  academy,
  location,
  specialization,
  experience,
  fee,
  galleryImages = [],
  discountLabel,
  onContact,
  onGalleryOpen,
  className,
}: CoachCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 w-full shrink-0">
        <button
          type="button"
          onClick={onGalleryOpen}
          className="group absolute inset-0 z-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C62828]"
          aria-label={`Open ${name} and ${academy} photo gallery`}
        >
          <Image src={image} alt={`${name} at ${academy}`} fill className="object-cover transition-transform duration-300 hover:scale-105" />
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-sm font-medium text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
            <Images className="size-4" />
            View photos{galleryImages.length > 0 ? ` (${galleryImages.length})` : ""}
          </span>
        </button>
        <Badge className="pointer-events-none absolute top-3 right-3 z-10 bg-[#C62828] text-white text-xs px-3 py-1 rounded-full border-0 hover:bg-[#C62828]">
          {sport}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[#0B1C2D]">{name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{academy}</p>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1.5">
          <MapPin className="size-3.5 shrink-0" />
          <span>{location}</span>
        </div>

        {discountLabel ? (
          <Badge className="mt-3 self-start rounded-full bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] px-3 py-1 text-xs font-semibold">
            {discountLabel}
          </Badge>
        ) : null}

        {/* Info boxes */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-gray-100 rounded-md p-2">
            <p className="text-xs text-gray-400">Specialization</p>
            <p className="text-sm font-medium text-[#0B1C2D] truncate">
              {specialization}
            </p>
          </div>
          <div className="bg-gray-100 rounded-md p-2">
            <p className="text-xs text-gray-400">Experience</p>
            <p className="text-sm font-medium text-[#0B1C2D]">{experience}</p>
          </div>
        </div>

        {/* Fee */}
        <p className="text-[#C62828] font-bold mt-3">{fee}</p>

        {/* CTA */}
        <PrimaryButton
          onClick={onContact}
          className="w-full py-2 rounded-md mt-3 cursor-pointer"
        >
          Book Now
        </PrimaryButton>
      </div>
    </div>
  );
}
