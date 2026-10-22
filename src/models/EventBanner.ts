import mongoose, { Schema, Types } from "mongoose";

export interface IEventBanner extends mongoose.Document {
  eventId: Types.ObjectId;
  contentType: "image/png" | "image/jpeg" | "image/webp";
  data: Buffer;
}

const EventBannerSchema = new Schema<IEventBanner>({
  eventId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
  contentType: { type: String, required: true, enum: ["image/png", "image/jpeg", "image/webp"] },
  data: { type: Buffer, required: true },
});

export const EventBanner =
  mongoose.models.EventBanner || mongoose.model<IEventBanner>("EventBanner", EventBannerSchema);
