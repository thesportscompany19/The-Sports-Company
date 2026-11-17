import mongoose, { Schema, Types } from "mongoose";

export interface IMediaThumbnail extends mongoose.Document {
  mediaId: Types.ObjectId;
  contentType: "image/png" | "image/jpeg" | "image/webp";
  data: Buffer;
}

const MediaThumbnailSchema = new Schema<IMediaThumbnail>({
  mediaId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
  contentType: { type: String, required: true, enum: ["image/png", "image/jpeg", "image/webp"] },
  data: { type: Buffer, required: true },
});

export const MediaThumbnail =
  mongoose.models.MediaThumbnail || mongoose.model<IMediaThumbnail>("MediaThumbnail", MediaThumbnailSchema);
