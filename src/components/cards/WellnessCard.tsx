"use client";

import Image from "next/image";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type WellnessType = "psychologists" | "counselors" | "gyms";

export interface WellnessCardProps {
  image: string;
  name: string;
  specialization: string;
  location: string;
  experience: string;
  sessionLabel: string;
  fee: string;
  amount: number;
  type?: WellnessType;
  discountLabel?: string;
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
  discountLabel,
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
        <div className="bg-gray-100 rounded-md p-3 mt-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-gray-500">{sessionLabel}</span>
            <span className="text-[#C62828] font-semibold text-sm">{fee}</span>
          </div>
          {discountLabel ? (
            <Badge className="mt-3 rounded-full bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] px-3 py-1 text-xs font-semibold">
              {discountLabel}
            </Badge>
          ) : null}
        </div>

        {/* CTA */}
        <PrimaryButton
          onClick={onBook}
          className="w-full py-2 rounded-md mt-3 cursor-pointer"
        >
          Book Session
        </PrimaryButton>
      </div>
    </div>
  );
}
