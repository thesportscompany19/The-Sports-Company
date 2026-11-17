import mongoose, { Schema, type Document } from "mongoose";

export type WellnessProviderType = "psychologists" | "counselors" | "gyms";
export type WellnessProviderStatus = "active" | "inactive";

export interface IWellnessProvider extends Document {
  image: string;
  name: string;
  email: string;
  type: WellnessProviderType;
  description: string;
  specialization: string;
  location: string;
  experience: string;
  fee: string;
  status: WellnessProviderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const WellnessProviderSchema = new Schema<IWellnessProvider>(
  {
    image: { type: String, default: "/images/event-1.png" },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    type: { type: String, enum: ["psychologists", "counselors", "gyms"], required: true },
    description: { type: String, default: "", trim: true },
    specialization: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    fee: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const WellnessProvider =
  mongoose.models.WellnessProvider ||
  mongoose.model<IWellnessProvider>("WellnessProvider", WellnessProviderSchema);
