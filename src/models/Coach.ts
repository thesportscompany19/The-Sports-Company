import mongoose, { Schema, Document } from "mongoose";

export type CoachStatus = "active" | "inactive";

export interface ICoach extends Document {
  image: string;
  name: string;
  email?: string;
  sport: string;
  academy: string;
  location: string;
  specialization: string;
  experience: string;
  fee: string;
  status: CoachStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema = new Schema<ICoach>(
  {
    image: { type: String, default: "/images/event-1.png" },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    sport: { type: String, required: true, trim: true },
    academy: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    fee: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Coach = mongoose.models.Coach || mongoose.model<ICoach>("Coach", CoachSchema);