import mongoose, { Schema, Document } from "mongoose";

export interface ICoachBooking extends Document {
  coachName: string;
  sport: string;
  academy: string;
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

const CoachBookingSchema = new Schema<ICoachBooking>(
  {
    coachName: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    academy: { type: String, required: true, trim: true },
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

export const CoachBooking =
  mongoose.models.CoachBooking || mongoose.model<ICoachBooking>("CoachBooking", CoachBookingSchema);
