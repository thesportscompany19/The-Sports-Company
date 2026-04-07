"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
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
  onContact?: () => void;
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
  onContact,
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
        <Image src={image} alt={name} fill className="object-cover" />
        <Badge className="absolute top-3 right-3 bg-[#C62828] text-white text-xs px-3 py-1 rounded-full border-0 hover:bg-[#C62828]">
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
        <Button
          onClick={onContact}
          className="w-full bg-[#C62828] hover:bg-red-700 text-white py-2 rounded-md mt-3 cursor-pointer"
        >
          Contact Coach
        </Button>
      </div>
    </div>
  );
}
