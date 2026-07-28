import mongoose, { Schema, Document } from "mongoose";

export interface IWellnessBooking extends Document {
  providerName: string;
  providerType: "psychologists" | "counselors" | "gyms";
  specialization: string;
  location: string;
  experience: string;
  sessionLabel: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WellnessBookingSchema = new Schema<IWellnessBooking>(
  {
    providerName: { type: String, required: true, trim: true },
    providerType: { type: String, required: true, enum: ["psychologists", "counselors", "gyms"] },
    specialization: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    sessionLabel: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
  },
  { timestamps: true }
);

export const WellnessBooking =
  mongoose.models.WellnessBooking ||
  mongoose.model<IWellnessBooking>("WellnessBooking", WellnessBookingSchema);
