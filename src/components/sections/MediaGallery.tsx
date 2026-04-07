"use client";

import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CustomTabs } from "@/components/common/CustomTabs";
import { MediaCard, type MediaCardProps } from "@/components/cards/MediaCard";
import { Video, ImageIcon } from "lucide-react";

type MediaData = Omit<MediaCardProps, "onPlay" | "className">;

const VIDEOS: MediaData[] = [
  {
    thumbnail: "/images/event-1.png",
    title: "Inter-City Cricket Championship 2026 — Match Highlights",
    tag: "Cricket",
    isVideo: true,
    duration: "4:32",
  },
  {
    thumbnail: "/images/event-2.png",
    title: "Open Ground Football League — Best Goals of the Tournament",
    tag: "Football",
    isVideo: true,
    duration: "6:14",
  },
  {
    thumbnail: "/images/event-3.png",
    title: "National Badminton Singles Open — Semi Final Recap",
    tag: "Badminton",
    isVideo: true,
    duration: "3:50",
  },
  {
    thumbnail: "/images/event-4.png",
    title: "City Marathon & Sprint Event — Race Day Coverage",
    tag: "Athletics",
    isVideo: true,
    duration: "8:05",
  },
  {
    thumbnail: "/images/result-1.png",
    title: "Winter Tennis Championship — Final Match Full Highlights",
    tag: "Tennis",
    isVideo: true,
    duration: "5:20",
  },
  {
    thumbnail: "/images/sports-banner.png",
    title: "The Sports Company — Season 2026 Opening Ceremony",
    tag: "Event",
    isVideo: true,
    duration: "12:00",
  },
];

const PHOTOS: MediaData[] = [
  {
    thumbnail: "/images/event-1.png",
    title: "Cricket Championship — Action Shots",
    tag: "Cricket",
    isVideo: false,
  },
  {
    thumbnail: "/images/event-2.png",
    title: "Football League — Team Photos & Celebrations",
    tag: "Football",
    isVideo: false,
  },
  {
    thumbnail: "/images/event-3.png",
    title: "Badminton Open — Award Ceremony",
    tag: "Badminton",
    isVideo: false,
  },
  {
    thumbnail: "/images/event-4.png",
    title: "City Marathon — Finish Line Moments",
    tag: "Athletics",
    isVideo: false,
  },
  {
    thumbnail: "/images/result-1.png",
    title: "Tennis Championship — Trophy Presentation",
    tag: "Tennis",
    isVideo: false,
  },
  {
    thumbnail: "/images/sports-banner.png",
    title: "The Sports Company — Behind the Scenes",
    tag: "Event",
    isVideo: false,
  },
];

const DATA_MAP: Record<string, MediaData[]> = {
  videos: VIDEOS,
  photos: PHOTOS,
};

const MEDIA_TABS = [
  { value: "videos", label: "Video Gallery", icon: <Video className="size-4" /> },
  { value: "photos", label: "Photo Gallery", icon: <ImageIcon className="size-4" /> },
];

interface MediaGalleryProps {
  title?: string;
  subtitle?: string;
  onPlay?: (item: MediaData) => void;
}

export function MediaGallery({
  title = "Media Gallery",
  subtitle = "Relive the best moments — match highlights, photos, and event coverage",
  onPlay,
}: MediaGalleryProps) {
  return (
    <SectionWrapper id="media" title={title} subtitle={subtitle} className="bg-[#F4F6F8]">
      <CustomTabs tabs={MEDIA_TABS} variant="dark" centered>
        {(activeTab) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {DATA_MAP[activeTab].map((item) => (
              <MediaCard
                key={item.title}
                {...item}
                onPlay={() => onPlay?.(item)}
              />
            ))}
          </div>
        )}
      </CustomTabs>
    </SectionWrapper>
  );
}
