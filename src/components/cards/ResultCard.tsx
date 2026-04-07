"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ResultCardProps {
  image: string;
  title: string;
  winner: string;
  score: string;
  onViewMedia?: () => void;
  className?: string;
}

export function ResultCard({
  image,
  title,
  winner,
  score,
  onViewMedia,
  className,
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-44 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
        <Badge className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full border-0 hover:bg-green-500">
          Completed
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[#0B1C2D] truncate">{title}</h3>

        {/* Winner info */}
        <div className="mt-3 bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-[#C62828]">Winner</p>
          <p className="font-semibold text-[#0B1C2D] mt-0.5">{winner}</p>
          <p className="text-sm text-gray-500 mt-0.5">{score}</p>
        </div>

        {/* Button */}
        <Button
          variant="outline"
          onClick={onViewMedia}
          className="w-full mt-4 border-gray-300 text-[#0B1C2D] rounded-md text-sm cursor-pointer"
        >
          View Photos &amp; Videos
        </Button>
      </div>
    </div>
  );
}
