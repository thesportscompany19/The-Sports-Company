"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface MediaCardProps {
  thumbnail: string;
  title: string;
  tag: string;
  /** Show play icon overlay for video cards */
  isVideo?: boolean;
  duration?: string;
  onPlay?: () => void;
  className?: string;
}

export function MediaCard({
  thumbnail,
  title,
  tag,
  isVideo = false,
  duration,
  onPlay,
  className,
}: MediaCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm overflow-hidden flex flex-col cursor-pointer group",
        className
      )}
      onClick={onPlay}
      role={isVideo ? "button" : undefined}
      aria-label={isVideo ? `Play ${title}` : title}
      tabIndex={isVideo ? 0 : undefined}
      onKeyDown={
        isVideo
          ? (e) => e.key === "Enter" && onPlay?.()
          : undefined
      }
    >
      {/* Thumbnail */}
      <div className="relative h-40 w-full bg-gray-200 shrink-0 overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Video overlay */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="size-12 rounded-full bg-white/90 flex items-center justify-center shadow-md">
              <Play className="size-5 text-[#C62828] translate-x-0.5" fill="#C62828" />
            </div>
            {duration && (
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {duration}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-medium text-[#0B1C2D] line-clamp-2">{title}</p>
        <Badge className="mt-2 self-start bg-[#C62828] text-white text-xs px-3 py-1 rounded-full border-0 hover:bg-[#C62828]">
          {tag}
        </Badge>
      </div>
    </div>
  );
}
