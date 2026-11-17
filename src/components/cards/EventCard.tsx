"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, IndianRupee, Trophy, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventCardProps {
  image: string;
  description?: string;
  tag: string;
  title: string;
  date: string;
  location: string;
  entryFee: string;
  prize: string;
  onRegister?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export function EventCard({
  image,
  tag,
  title,
  date,
  location,
  entryFee,
  prize,
  onRegister,
  onViewDetails,
  className,
}: EventCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[2/1] w-full">
        <button
          type="button"
          onClick={onViewDetails}
          className="group absolute inset-0 z-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C62828]"
          aria-label={`View details for ${title}`}
        >
          <Image src={image} alt={title} fill unoptimized={image.startsWith("data:")} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          <span className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-sm font-medium text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
            <ImageIcon className="size-4" />
            View event details
          </span>
        </button>
        <Badge className="pointer-events-none absolute top-3 right-3 z-10 bg-[#C62828] text-white text-xs px-3 py-1 rounded-full border-0 hover:bg-[#C62828]">
          {tag}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold leading-snug text-[#0B1C2D]">{title}</h3>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="size-4 shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="size-4 shrink-0" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <IndianRupee className="size-4 shrink-0" />
            <span>{entryFee}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Trophy className="size-4 shrink-0" />
            <span>{prize}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <PrimaryButton
            onClick={onRegister}
            className="min-w-0 flex-1 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm cursor-pointer"
          >
            Register
          </PrimaryButton>
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="min-w-0 flex-1 border-gray-300 text-[#0B1C2D] px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm cursor-pointer"
          >
            Event Details
          </Button>
        </div>
      </div>
    </div>
  );
}
