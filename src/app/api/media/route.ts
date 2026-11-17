import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { decodeEventImage, isValidEventImage } from "@/lib/event-image";
import { MediaItem, type MediaItemStatus, type MediaItemType } from "@/models/MediaItem";
import { MediaThumbnail } from "@/models/MediaThumbnail";

const MEDIA_TYPES: MediaItemType[] = ["videos", "photos"];
const MEDIA_STATUSES: MediaItemStatus[] = ["published", "draft"];

function isValidVideoUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function mapMediaItem(item: {
  _id: unknown;
  thumbnail: string;
  videoUrl?: string;
  title: string;
  tag: string;
  type: MediaItemType;
  duration: string;
  date: string;
  status: MediaItemStatus;
  updatedAt?: Date;
}) {
  const thumbnail = item.thumbnail.startsWith("/api/media/") && item.updatedAt
    ? `${item.thumbnail}?v=${item.updatedAt.getTime()}`
    : item.thumbnail;
  return {
    id: String(item._id),
    thumbnail,
    videoUrl: item.videoUrl || "",
    title: item.title,
    tag: item.tag,
    type: item.type,
    duration: item.duration,
    date: item.date,
    status: item.status,
  };
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const showAll = req.nextUrl.searchParams.get("all") === "true";
    const items = await MediaItem.find(showAll ? {} : { status: "published" }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, items: items.map(mapMediaItem) });
  } catch (error) {
    console.error("Fetch media items error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to load media items."] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { thumbnail, videoUrl, title, tag, type, duration, date, status } = body;
    const errors: string[] = [];
    if (thumbnail !== undefined && !isValidEventImage(thumbnail)) errors.push("Thumbnail must be a PNG, JPEG, or WebP image no larger than 2 MB.");
    if (typeof title !== "string" || title.trim().length < 2) errors.push("Title is required.");
    if (typeof tag !== "string" || !tag.trim()) errors.push("A media tag is required.");
    if (!MEDIA_TYPES.includes(type)) errors.push("Choose videos or photos as the media type.");
    if (!isValidVideoUrl(videoUrl)) errors.push("Enter a valid HTTP or HTTPS video URL.");
    if (typeof date !== "string" || !date.trim()) errors.push("Date is required.");
    if (status !== undefined && !MEDIA_STATUSES.includes(status)) errors.push("Choose a valid media status.");
    if (errors.length) return NextResponse.json({ success: false, errors }, { status: 400 });

    await connectToDatabase();
    const uploadedThumbnail = typeof thumbnail === "string" ? decodeEventImage(thumbnail) : null;
    const item = await MediaItem.create({
      thumbnail: uploadedThumbnail ? "" : thumbnail || "/images/event-1.png",
      videoUrl: typeof videoUrl === "string" ? videoUrl.trim() : "",
      title: title.trim(),
      tag: tag.trim(),
      type,
      duration: typeof duration === "string" ? duration.trim() : "",
      date: date.trim(),
      status: status || "published",
    });

    if (uploadedThumbnail) {
      try {
        await MediaThumbnail.create({ mediaId: item._id, ...uploadedThumbnail });
        item.thumbnail = `/api/media/${item._id}/image`;
        await item.save();
      } catch (error) {
        await MediaItem.deleteOne({ _id: item._id });
        await MediaThumbnail.deleteOne({ mediaId: item._id });
        throw error;
      }
    }

    return NextResponse.json({ success: true, item: mapMediaItem(item.toObject()) }, { status: 201 });
  } catch (error) {
    console.error("Create media item error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to save media item."] }, { status: 500 });
  }
}
