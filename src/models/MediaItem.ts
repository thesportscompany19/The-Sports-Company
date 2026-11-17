import mongoose, { Schema, type Document } from "mongoose";

export type MediaItemType = "videos" | "photos";
export type MediaItemStatus = "published" | "draft";

export interface IMediaItem extends Document {
  thumbnail: string;
  videoUrl: string;
  title: string;
  tag: string;
  type: MediaItemType;
  duration: string;
  date: string;
  status: MediaItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

const MediaItemSchema = new Schema<IMediaItem>(
  {
    thumbnail: { type: String, default: "/images/event-1.png" },
    videoUrl: { type: String, default: "", trim: true },
    title: { type: String, required: true, trim: true },
    tag: { type: String, required: true, trim: true },
    type: { type: String, enum: ["videos", "photos"], required: true },
    duration: { type: String, default: "", trim: true },
    date: { type: String, required: true, trim: true },
    status: { type: String, enum: ["published", "draft"], default: "published" },
  },
  { timestamps: true }
);

export const MediaItem =
  mongoose.models.MediaItem || mongoose.model<IMediaItem>("MediaItem", MediaItemSchema);
