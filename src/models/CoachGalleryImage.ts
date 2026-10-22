import mongoose, { Schema, Types } from "mongoose";
import type { CoachGalleryImageType } from "@/lib/coach-gallery-image";

export interface ICoachGalleryImage extends mongoose.Document {
  coachId: Types.ObjectId;
  contentType: CoachGalleryImageType;
  data: Buffer;
  createdAt: Date;
}

const CoachGalleryImageSchema = new Schema<ICoachGalleryImage>(
  {
    coachId: { type: Schema.Types.ObjectId, required: true, index: true },
    contentType: { type: String, required: true, enum: ["image/png", "image/jpeg", "image/webp"] },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

export const CoachGalleryImage =
  mongoose.models.CoachGalleryImage ||
  mongoose.model<ICoachGalleryImage>("CoachGalleryImage", CoachGalleryImageSchema);
