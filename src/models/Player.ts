import mongoose, { Schema, Document } from "mongoose";

export interface IPlayer extends Document {
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  guardianMobile?: string;
  email: string;
  city: string;
  aadhaar: string;
  sports: string[];
  paymentStatus: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema = new Schema<IPlayer>(
  {
    fullName: { type: String, required: true, trim: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    mobile: { type: String, required: true, trim: true },
    guardianMobile: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true },
    aadhaar: { type: String, required: true, trim: true },
    sports: { type: [String], required: true, validate: [(v: string[]) => v.length > 0, "Select at least one sport"] },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Player = mongoose.models.Player || mongoose.model<IPlayer>("Player", PlayerSchema);
