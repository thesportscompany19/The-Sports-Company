import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { decodeEventImage, isValidEventImage } from "@/lib/event-image";
import { MediaItem, type MediaItemStatus, type MediaItemType } from "@/models/MediaItem";
import { MediaThumbnail } from "@/models/MediaThumbnail";

const MEDIA_TYPES: MediaItemType[] = ["videos", "photos"];
const MEDIA_STATUSES: MediaItemStatus[] = ["published", "draft"];
type RouteContext = { params: Promise<{ id: string }> };

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

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, errors: ["Invalid media item ID."] }, { status: 400 });
    }

    const body = await req.json();
    const { thumbnail, videoUrl, title, tag, type, duration, date, status } = body;
    const errors: string[] = [];
    if (thumbnail !== undefined && !isValidEventImage(thumbnail)) errors.push("Thumbnail must be a PNG, JPEG, or WebP image no larger than 2 MB.");
    if (title !== undefined && (typeof title !== "string" || title.trim().length < 2)) errors.push("Title is required.");
    if (tag !== undefined && (typeof tag !== "string" || !tag.trim())) errors.push("A media tag is required.");
    if (type !== undefined && !MEDIA_TYPES.includes(type)) errors.push("Choose videos or photos as the media type.");
    if (videoUrl !== undefined && !isValidVideoUrl(videoUrl)) errors.push("Enter a valid HTTP or HTTPS video URL.");
    if (date !== undefined && (typeof date !== "string" || !date.trim())) errors.push("Date is required.");
    if (status !== undefined && !MEDIA_STATUSES.includes(status)) errors.push("Choose a valid media status.");
    if (errors.length) return NextResponse.json({ success: false, errors }, { status: 400 });

    await connectToDatabase();
    const updates: Record<string, unknown> = Object.fromEntries(
      Object.entries({ videoUrl, title, tag, type, duration, date, status })
        .filter(([, value]) => value !== undefined)
    );
    if (typeof videoUrl === "string") updates.videoUrl = videoUrl.trim();

    const uploadedThumbnail = typeof thumbnail === "string" && thumbnail.startsWith("data:")
      ? decodeEventImage(thumbnail)
      : null;
    const keepCurrentThumbnail = typeof thumbnail === "string" && thumbnail.startsWith("/api/media/");
    if (thumbnail !== undefined && !keepCurrentThumbnail) {
      updates.thumbnail = uploadedThumbnail ? "" : thumbnail;
    }

    const item = await MediaItem.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!item) {
      return NextResponse.json({ success: false, errors: ["Media item not found."] }, { status: 404 });
    }

    if (uploadedThumbnail) {
      await MediaThumbnail.findOneAndUpdate(
        { mediaId: item._id },
        { ...uploadedThumbnail },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      item.thumbnail = `/api/media/${item._id}/image`;
      await item.save();
    } else if (thumbnail !== undefined && !keepCurrentThumbnail) {
      await MediaThumbnail.deleteOne({ mediaId: item._id });
    }
    return NextResponse.json({ success: true, item: mapMediaItem(item.toObject()) });
  } catch (error) {
    console.error("Update media item error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to update media item."] }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, errors: ["Invalid media item ID."] }, { status: 400 });
    }
    await connectToDatabase();
    const item = await MediaItem.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ success: false, errors: ["Media item not found."] }, { status: 404 });
    }
    await MediaThumbnail.deleteOne({ mediaId: item._id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete media item error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to delete media item."] }, { status: 500 });
  }
}
