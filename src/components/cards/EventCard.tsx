"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, IndianRupee, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventCardProps {
  image: string;
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
      <div className="relative h-40 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
        <Badge className="absolute top-3 right-3 bg-[#C62828] text-white text-xs px-3 py-1 rounded-full border-0 hover:bg-[#C62828]">
          {tag}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[#0B1C2D]">{title}</h3>

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
        <div className="flex gap-3 mt-4">
          <Button
            onClick={onRegister}
            className="bg-[#C62828] hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            Register
          </Button>
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="border-gray-300 text-[#0B1C2D] px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
