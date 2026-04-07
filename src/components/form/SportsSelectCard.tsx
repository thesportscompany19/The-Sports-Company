"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface SportsSelectCardProps {
  name: string;
  icon: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function SportsSelectCard({
  name,
  icon,
  isSelected,
  onSelect,
}: SportsSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border p-4 text-center cursor-pointer transition-all duration-150 w-full",
        isSelected
          ? "border-[#C62828] bg-red-50 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      <div className="relative h-10 w-10 shrink-0">
        <Image src={icon} alt={name} fill className="object-contain" />
      </div>
      <span
        className={cn(
          "text-xs font-medium leading-tight",
          isSelected ? "text-[#C62828]" : "text-[#0B1C2D]"
        )}
      >
        {name}
      </span>
    </button>
  );
}
