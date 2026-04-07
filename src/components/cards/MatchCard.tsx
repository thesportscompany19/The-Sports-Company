"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MatchCardProps {
  sport: string;
  round: string;
  title: string;
  date: string;
  time: string;
  location: string;
  /** "upcoming" shows "View Details" button; "completed" shows "View Result" */
  status: "upcoming" | "completed";
  onAction?: () => void;
  className?: string;
}

export function MatchCard({
  sport,
  round,
  title,
  date,
  time,
  location,
  status,
  onAction,
  className,
}: MatchCardProps) {
  return (
    <div
      className={cn(
        "bg-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        className
      )}
    >
      {/* Left */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-[#C62828] text-white text-xs px-3 py-1 rounded-full border-0 hover:bg-[#C62828]">
            {sport}
          </Badge>
          <span className="text-sm text-gray-500">{round}</span>
        </div>
        <h3 className="font-semibold text-[#0B1C2D] mt-1.5 truncate">{title}</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4 shrink-0" />
            {date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4 shrink-0" />
            {time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" />
            {location}
          </span>
        </div>
      </div>

      {/* Right — CTA */}
      <Button
        onClick={onAction}
        className="bg-[#0B1C2D] hover:bg-[#162d47] text-white px-4 py-2 rounded-md text-sm shrink-0 cursor-pointer"
      >
        {status === "upcoming" ? "View Details" : "View Result"}
      </Button>
    </div>
  );
}
