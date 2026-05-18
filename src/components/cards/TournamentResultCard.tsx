"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface TournamentResultCardProps {
  category: string;
  position: 1 | 2 | 3;
  playerName: string;
  score?: string;
  className?: string;
}

const positionColors = {
  1: "bg-yellow-400 text-gray-900", // Gold
  2: "bg-gray-300 text-gray-900", // Silver
  3: "bg-orange-400 text-white", // Bronze
};

const positionLabels = {
  1: "🥇 1st",
  2: "🥈 2nd",
  3: "🥉 3rd",
};

export function TournamentResultCard({
  category,
  position,
  playerName,
  score,
  className,
}: TournamentResultCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100",
        className
      )}
    >
      <div className="p-4">
        {/* Position Badge */}
        <div className="flex items-start justify-between mb-3">
          <Badge className={cn(positionColors[position], "border-0 text-sm font-bold")}>
            {positionLabels[position]}
          </Badge>
        </div>

        {/* Player Name */}
        <h4 className="font-semibold text-[#0B1C2D] text-lg truncate">
          {playerName}
        </h4>

        {/* Category */}
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
          {category}
        </p>

        {/* Score if available */}
        {score && (
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Score: {score}
          </p>
        )}
      </div>
    </div>
  );
}
