import mongoose, { Schema, Types } from "mongoose";

export interface IWellnessBanner extends mongoose.Document {
  providerId: Types.ObjectId;
  contentType: "image/png" | "image/jpeg" | "image/webp";
  data: Buffer;
}

const WellnessBannerSchema = new Schema<IWellnessBanner>({
  providerId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
  contentType: { type: String, required: true, enum: ["image/png", "image/jpeg", "image/webp"] },
  data: { type: Buffer, required: true },
});

export const WellnessBanner =
  mongoose.models.WellnessBanner || mongoose.model<IWellnessBanner>("WellnessBanner", WellnessBannerSchema);
