"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WellnessCardProps {
  image: string;
  name: string;
  specialization: string;
  location: string;
  experience: string;
  sessionLabel: string;
  fee: string;
  onBook?: () => void;
  className?: string;
}

export function WellnessCard({
  image,
  name,
  specialization,
  location,
  experience,
  sessionLabel,
  fee,
  onBook,
  className,
}: WellnessCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-48 w-full shrink-0">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[#0B1C2D]">{name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{specialization}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <MapPin className="size-3.5 shrink-0" />
          <span>{location}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{experience}</p>

        {/* Fee box */}
        <div className="bg-gray-100 rounded-md p-2 mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{sessionLabel}</span>
          <span className="text-[#C62828] font-semibold text-sm">{fee}</span>
        </div>

        {/* CTA */}
        <Button
          onClick={onBook}
          className="w-full bg-[#C62828] hover:bg-red-700 text-white py-2 rounded-md mt-3 cursor-pointer"
        >
          Book Session
        </Button>
      </div>
    </div>
  );
}
