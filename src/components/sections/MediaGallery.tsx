"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CustomTabs } from "@/components/common/CustomTabs";
import { MediaCard, type MediaCardProps } from "@/components/cards/MediaCard";
import { Video, ImageIcon, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MediaData = Omit<MediaCardProps, "onPlay" | "className">;

const VIDEOS: MediaData[] = [
  {
    thumbnail: "/images/event-1.png",
    title: "Inter-City Cricket Championship 2026 — Match Highlights",
    tag: "Cricket",
    isVideo: true,
    duration: "4:32",
    date: "Mar 20, 2026",
  },
  {
    thumbnail: "/images/event-2.png",
    title: "Open Ground Football League — Best Goals of the Tournament",
    tag: "Football",
    isVideo: true,
    duration: "6:14",
    date: "Mar 15, 2026",
  },
  {
    thumbnail: "/images/event-3.png",
    title: "National Badminton Singles Open — Semi Final Recap",
    tag: "Badminton",
    isVideo: true,
    duration: "3:50",
    date: "Feb 28, 2026",
  },
  {
    thumbnail: "/images/event-4.png",
    title: "City Marathon & Sprint Event — Race Day Coverage",
    tag: "Athletics",
    isVideo: true,
    duration: "8:05",
    date: "Mar 5, 2026",
  },
  {
    thumbnail: "/images/result-1.png",
    title: "Winter Tennis Championship — Final Match Full Highlights",
    tag: "Tennis",
    isVideo: true,
    duration: "5:20",
    date: "Feb 28, 2026",
  },
  {
    thumbnail: "/images/sports-banner.png",
    title: "The Sports Company — Season 2026 Opening Ceremony",
    tag: "Event",
    isVideo: true,
    duration: "12:00",
    date: "Mar 20, 2026",
  },
];

const PHOTOS: MediaData[] = [
  {
    thumbnail: "/images/event-1.png",
    title: "Cricket Championship — Action Shots",
    tag: "Cricket",
    isVideo: false,
    date: "Mar 10, 2026",
  },
  {
    thumbnail: "/images/event-2.png",
    title: "Football League — Team Photos & Celebrations",
    tag: "Football",
    isVideo: false,
    date: "Mar 15, 2026",
  },
  {
    thumbnail: "/images/event-3.png",
    title: "Badminton Open — Award Ceremony",
    tag: "Badminton",
    isVideo: false,
    date: "Feb 5, 2026",
  },
  {
    thumbnail: "/images/event-4.png",
    title: "City Marathon — Finish Line Moments",
    tag: "Athletics",
    isVideo: false,
    date: "Mar 5, 2026",
  },
  {
    thumbnail: "/images/result-1.png",
    title: "Tennis Championship — Trophy Presentation",
    tag: "Tennis",
    isVideo: false,
    date: "Feb 5, 2026",
  },
  {
    thumbnail: "/images/sports-banner.png",
    title: "The Sports Company — Behind the Scenes",
    tag: "Event",
    isVideo: false,
    date: "Mar 10, 2026",
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
  const [mediaItems, setMediaItems] = useState<MediaData[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaData | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadMedia() {
      try {
        const response = await fetch("/api/media", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.items)) {
          throw new Error(data.errors?.join(", ") || "Unable to load media gallery.");
        }
        if (mounted && data.items.length > 0) {
          setMediaItems(data.items.map((item: {
            thumbnail: string;
            title: string;
            tag: string;
            videoUrl?: string;
            type: "videos" | "photos";
            duration?: string;
            date?: string;
          }) => ({
            thumbnail: item.thumbnail,
            title: item.title,
            tag: item.tag,
            videoUrl: item.videoUrl || "",
            isVideo: item.type === "videos",
            duration: item.duration || undefined,
            date: item.date,
          })));
        }
      } catch (error) {
        console.error("Fetch public media gallery error:", error);
      }
    }
    void loadMedia();
    return () => { mounted = false; };
  }, []);

  function getVideoEmbedUrl(value: string) {
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase().replace(/^www\./, "");
      if (host === "youtu.be") {
        const id = url.pathname.slice(1);
        return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
      }
      if (host === "youtube.com" || host === "m.youtube.com") {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
      }
      if (host === "vimeo.com") {
        const id = url.pathname.split("/").filter(Boolean)[0];
        return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
      }
    } catch {
      return null;
    }
    return null;
  }

  const activeItems = mediaItems.length ? mediaItems : DATA_MAP.videos.concat(DATA_MAP.photos);

  return (
    <SectionWrapper id="media" title={title} subtitle={subtitle} className="bg-[#F4F6F8]">
      <CustomTabs tabs={MEDIA_TABS} centered scrollable>
        {(activeTab) => {
          const visibleItems = activeItems.filter((item) => item.isVideo === (activeTab === "videos"));
          return (
          <div className="mt-6">
            {visibleItems.length ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((item) => (
              <MediaCard
                key={`${item.title}-${item.date || ""}`}
                {...item}
                onPlay={() => {
                  onPlay?.(item);
                  setSelectedItem(item);
                }}
              />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                No {activeTab === "videos" ? "videos" : "photos"} are published yet.
              </p>
            )}
          </div>
          );
        }}
      </CustomTabs>
      <Dialog open={Boolean(selectedItem)} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] overflow-y-auto p-0 sm:max-w-4xl">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {selectedItem.isVideo && selectedItem.videoUrl ? (
                (() => {
                  const embedUrl = getVideoEmbedUrl(selectedItem.videoUrl);
                  const directVideo = /\.(mp4|webm|ogg)(?:$|[?#])/i.test(selectedItem.videoUrl);
                  if (embedUrl) {
                    return <iframe src={embedUrl} title={selectedItem.title} className="absolute inset-0 size-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />;
                  }
                  if (directVideo) {
                    return <video src={selectedItem.videoUrl} controls playsInline className="absolute inset-0 size-full object-contain" />;
                  }
                  return (
                    <a href={selectedItem.videoUrl} target="_blank" rel="noreferrer" className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
                      <ExternalLink className="size-8" />
                      <span>Open video in a new tab</span>
                    </a>
                  );
                })()
              ) : (
                <Image src={selectedItem.thumbnail} alt={selectedItem.title} fill sizes="(max-width: 640px) 100vw, 896px" className="object-contain" />
              )}
            </div>
            <DialogHeader className="px-4 py-4 pr-12 text-left sm:px-6">
              <DialogTitle className="break-words text-lg font-semibold text-[#0B1C2D] sm:text-xl">{selectedItem.title}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{selectedItem.tag}</span>
                {selectedItem.date && <span>{selectedItem.date}</span>}
                {selectedItem.isVideo && selectedItem.duration && <span>{selectedItem.duration}</span>}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </SectionWrapper>
  );
}
